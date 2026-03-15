# Hex Grid Mode — Spec for AG16 Integration

## Overview

Add a **Hex Grid Mode** to AG16 (Arrow Grid: 16 Channel). A single toggle button
switches between **Square** (existing) and **Hex** (new). The hex grid uses
**pointy-top hexagons** in a **rectangular layout** so the same grid-size slider,
note labels along edges, and general UX remain familiar.

All AG16 features must work in both modes: 16 channels, synth engine, scales/keys,
walls, symmetry, undo/redo, save/load, import/export, share URLs, MIDI out, presets,
randomize, and all performance optimizations.

---

## 1. Geometry Fundamentals

### Square Grid (existing AG16)
- **Shape**: Rectangle of N×N cells
- **Directions**: 4 (up=0, right=1, down=2, left=3)
- **Cell coords**: Integer `(x, y)` where `0 ≤ x < cols` and `0 ≤ y < rows`
- **Total cells**: `cols × rows` (typically `size × size`)
- **Movement**: ±1 on one axis per step
- **Flip**: `(vector + 2) % 4` (180° reversal)
- **Collision rotation**: `(groupSize - 1) % 4`
- **Dedup modulus**: `count % 4 || 4`

### Hex Grid (new mode)
- **Shape**: Rectangular grid of pointy-top hexagons (odd-r offset layout)
- **Directions**: 6 (E=0, NE=1, NW=2, W=3, SW=4, SE=5)
- **Cell coords**: Axial `(q, r)` — converted from offset for storage/logic
- **Total cells**: `cols × rows` (same as square — it's a rectangular hex grid)
- **Movement**: Axial deltas (see §2)
- **Flip**: `(vector + 3) % 6` (clean 180° reversal — unlike triangle reflection)
- **Collision rotation**: `(groupSize - 1) % 6`
- **Dedup modulus**: `count % 6 || 6`

### Why Rectangular Hex (not Hexagonal-shaped)
- Preserves the existing grid-size slider ("9×9", "12×12", etc.)
- Note labels along 4 edges just like square mode
- Walls, symmetry axes, and UI all transfer cleanly
- Visual departure already covered by the hex cells themselves

---

## 2. The 6 Directions — Movement Vectors (Axial Coordinates)

Pointy-top hexagons, axial coordinate system `(q, r)`:

```
Direction    Vector    Δq     Δr     Visual
───────────────────────────────────────────────
East         0        +1      0      →
NE           1        +1     -1      ↗
NW           2         0     -1      ↖
West         3        -1      0      ←
SW           4        -1     +1      ↙
SE           5         0     +1      ↘
```

```javascript
const HEX_MOVE_DQ = [ 1,  1,  0, -1, -1,  0];
const HEX_MOVE_DR = [ 0, -1, -1,  0,  1,  1];

function moveHexArrowInPlace(arrow) {
    arrow.q += HEX_MOVE_DQ[arrow.vector];
    arrow.r += HEX_MOVE_DR[arrow.vector];
}
```

### Offset ↔ Axial Conversion (Odd-R Offset)
The rendering uses **odd-r offset** coords `(col, row)` where odd rows shift
right by half a hex:

```javascript
// Offset → Axial
function offsetToAxial(col, row) {
    const q = col - Math.floor(row / 2);
    const r = row;
    return { q, r };
}

// Axial → Offset
function axialToOffset(q, r) {
    const col = q + Math.floor(r / 2);
    const row = r;
    return { col, row };
}
```

**Logic uses axial**. **Rendering uses offset**. **Storage uses axial** (more
compact for serialization).

---

## 3. Boundary Detection (Four Edges)

The rectangular hex grid has **4 exterior boundaries**, same as square:

| Boundary | Axial Condition | Applies to vectors heading toward it |
|----------|-----------------|--------------------------------------|
| Top      | `r === 0`       | 1 (NE) and 2 (NW)                   |
| Bottom   | `r === rows - 1`| 4 (SW) and 5 (SE)                   |
| Left     | `col === 0` after offset conversion | 2 (NW), 3 (W), 4 (SW) — context-dependent |
| Right    | `col === cols - 1` after offset conversion | 0 (E), 1 (NE), 5 (SE) — context-dependent |

**Precise boundary check** (using offset coordinates for left/right edges):

```javascript
function isAtHexBoundary(arrow, cols, rows) {
    const { q, r, vector } = arrow;
    const { col } = axialToOffset(q, r);

    // Top edge
    if (r === 0 && (vector === 1 || vector === 2)) return true;
    // Bottom edge
    if (r === rows - 1 && (vector === 4 || vector === 5)) return true;
    // Left edge — check if moving would go out of column bounds
    if (vector === 3) { // West: q-1
        const nextCol = axialToOffset(q - 1, r).col;
        if (nextCol < 0) return true;
    }
    if (vector === 2 && r > 0) { // NW: q, r-1
        const nextCol = axialToOffset(q, r - 1).col;
        if (nextCol < 0) return true;
    }
    if (vector === 4 && r < rows - 1) { // SW: q-1, r+1
        const nextCol = axialToOffset(q - 1, r + 1).col;
        if (nextCol < 0) return true;
    }
    // Right edge
    if (vector === 0) { // East: q+1
        const nextCol = axialToOffset(q + 1, r).col;
        if (nextCol >= cols) return true;
    }
    if (vector === 1 && r > 0) { // NE: q+1, r-1
        const nextCol = axialToOffset(q + 1, r - 1).col;
        if (nextCol >= cols) return true;
    }
    if (vector === 5 && r < rows - 1) { // SE: q, r+1
        const nextCol = axialToOffset(q, r + 1).col;
        if (nextCol >= cols) return true;
    }
    return false;
}
```

**Optimized version** — precompute a bounds lookup per (q, r, vector) at grid
creation/resize, store in a `Set` or flat array for O(1) checks during simulation.

### Note Index from Boundary
When an arrow hits an edge, the position along that edge determines the note:

```javascript
function getHexNoteIndex(arrow, cols, rows) {
    const { q, r, vector } = arrow;
    const { col } = axialToOffset(q, r);

    // Top/bottom edges → note index = column position
    if (r === 0 && (vector === 1 || vector === 2)) return col;
    if (r === rows - 1 && (vector === 4 || vector === 5)) return col;
    // Left/right edges → note index = row position
    if (col === 0 && (vector === 2 || vector === 3 || vector === 4)) return r;
    if (col === cols - 1 && (vector === 0 || vector === 1 || vector === 5)) return r;
    return 0;
}
```

---

## 4. Flip/Reflection Logic

Hex flip is a clean **180° reversal** — much simpler than the triangle:

```javascript
const HEX_FLIP = [3, 4, 5, 0, 1, 2];  // (vector + 3) % 6

function flipHexArrow(arrow) {
    arrow.vector = (arrow.vector + 3) % 6;
}
```

No edge-dependent reflection needed. Every boundary bounce is a straight 180°
reversal, same semantic as the square grid's `(v + 2) % 4`.

### Corner Hits
At a corner (e.g., top-right where top and right edges meet), an arrow heading
NE hits both edges simultaneously. Like the square grid, a single flip to the
opposite direction (SW) handles this correctly.

---

## 5. Collision / Rotation

Identical mechanic to square grid, extended to 6 directions:

```javascript
// When `groupSize` arrows occupy the same cell:
const rotateBy = (groupSize - 1) % 6;
arrow.vector = (arrow.vector + rotateBy) % 6;
```

### Deduplication
```javascript
// Square: keep = count % 4 || 4;
// Hex:    keep = count % 6 || 6;
```

---

## 6. Rendering — Canvas Geometry

### Pointy-Top Hex Dimensions
```
         ╱╲
        ╱    ╲      height = size * √3
       │      │     width  = size * 2
       │      │
        ╲    ╱
         ╲╱

hexWidth  = size * 2
hexHeight = size * √3
```

### Constants
```javascript
const SQRT3 = Math.sqrt(3);

// Per-cell metrics based on hex "size" (center to vertex)
const hexSize;                           // computed from grid dimensions & canvas
const hexWidth = hexSize * 2;
const hexHeight = hexSize * SQRT3;

// Grid spacing (pointy-top, odd-r offset)
const colSpacing = hexWidth * 0.75;      // horizontal distance between columns
const rowSpacing = hexHeight;            // vertical distance between rows
const oddRowShift = hexWidth * 0.375;    // half-column shift for odd rows
```

### Cell → Pixel (Center of Hex)
```javascript
function hexCellToPixel(col, row, hexSize, border) {
    const x = border + col * hexSize * 1.5 + hexSize;
    const y = border + row * hexSize * SQRT3 + hexSize * SQRT3 / 2
              + (row % 2 === 1 ? hexSize * SQRT3 / 2 : 0);
    return { px: x, py: y };
}
```

Wait — simpler with offset coords:
```javascript
function hexCellToPixel(col, row, hexSize, border) {
    const px = border + hexSize + col * hexSize * 1.5;
    const py = border + hexSize * SQRT3 / 2 + row * hexSize * SQRT3
             + (row & 1) * hexSize * SQRT3 / 2;
    return { px, py };
}
```

### Pixel → Cell (Mouse/Touch → Grid Coord)
```javascript
function pixelToHexCell(px, py, hexSize, border) {
    // Convert pixel to fractional axial coordinates, then round
    const x = px - border;
    const y = py - border;

    // Fractional axial
    const q = (x * 2/3) / hexSize;
    const r = (-x / 3 + SQRT3 / 3 * y) / hexSize;

    return axialRound(q, r);
}

function axialRound(qf, rf) {
    const sf = -qf - rf;
    let q = Math.round(qf);
    let r = Math.round(rf);
    let s = Math.round(sf);
    const dq = Math.abs(q - qf);
    const dr = Math.abs(r - rf);
    const ds = Math.abs(s - sf);
    if (dq > dr && dq > ds) q = -r - s;
    else if (dr > ds)       r = -q - s;
    return { q, r };
}
```

### Drawing a Single Hexagon
```javascript
function drawHex(ctx, cx, cy, size, fill, stroke) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 6 + i * Math.PI / 3; // pointy-top: start at 30°
        const vx = cx + size * Math.cos(angle);
        const vy = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
    }
    ctx.closePath();
    if (fill)   { ctx.fillStyle = fill;   ctx.fill();   }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}
```

### Drawing Grid Lines
Iterate all cells, draw each hex outline. For performance, batch into a single
`Path2D` and stroke once:

```javascript
function drawHexGrid(ctx, cols, rows, hexSize, border, lineColor) {
    const path = new Path2D();
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const { px, py } = hexCellToPixel(col, row, hexSize, border);
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 6 + i * Math.PI / 3;
                const vx = px + hexSize * Math.cos(angle);
                const vy = py + hexSize * Math.sin(angle);
                if (i === 0) path.moveTo(vx, vy);
                else path.lineTo(vx, vy);
            }
            path.closePath();
        }
    }
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.stroke(path);
}
```

### Drawing Arrows in Hex Cells
Draw directional arrows (small triangles) rotated to match 6 directions. Each
direction is 60° apart:

```javascript
function drawHexArrow(ctx, cx, cy, arrowSize, vector, color) {
    const angle = vector * Math.PI / 3;  // 0°, 60°, 120°, 180°, 240°, 300°
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    // Arrow pointing right (→), then rotated
    ctx.moveTo(arrowSize * 0.5, 0);
    ctx.lineTo(-arrowSize * 0.3, -arrowSize * 0.35);
    ctx.lineTo(-arrowSize * 0.3, arrowSize * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
```

### Animation Interpolation
Smoothly slide arrows between hex cells during each tick:

```javascript
function hexAnimationShift(px, py, vector, percentage, hexSize) {
    // Direction offsets in pixel space for pointy-top hex
    const dx = [
        hexSize * 1.5,                // E
        hexSize * 0.75,               // NE
        -hexSize * 0.75,              // NW
        -hexSize * 1.5,               // W
        -hexSize * 0.75,              // SW
        hexSize * 0.75,               // SE
    ];
    const dy = [
        0,                            // E
        -hexSize * SQRT3 / 2,         // NE
        -hexSize * SQRT3 / 2,         // NW
        0,                            // W
        hexSize * SQRT3 / 2,          // SW
        hexSize * SQRT3 / 2,          // SE
    ];
    return {
        x: px + dx[vector] * percentage,
        y: py + dy[vector] * percentage,
    };
}
```

### Canvas Dimensions
```javascript
function hexCanvasDimensions(cols, rows, hexSize, border) {
    const width  = border * 2 + hexSize * 1.5 * cols + hexSize * 0.5;
    const height = border * 2 + hexSize * SQRT3 * rows
                 + hexSize * SQRT3 / 2;  // extra for odd-row shift
    return { width, height };
}
```

---

## 7. Internal Walls

### Hex Wall Model
Each hex has **6 edges**, shared with its 6 neighbors. A wall is placed on the
edge between two adjacent hexes. Identify each wall by the cell's axial coords
and the direction of the edge:

```
Wall key format:  "h:<q>:<r>:<dir>"
Where dir is 0–5 matching the 6 hex directions.
```

To avoid duplicates, **normalize** so only directions 0, 1, 5 (E, NE, SE) are
stored — the other three (W, NW, SW) are the same edge from the neighbor's
perspective:

```javascript
function normalizeWallKey(q, r, dir) {
    if (dir >= 3) {
        // Convert to the neighbor's perspective
        const nq = q + HEX_MOVE_DQ[dir];
        const nr = r + HEX_MOVE_DR[dir];
        const oppositeDir = (dir + 3) % 6;
        return `h:${nq}:${nr}:${oppositeDir}`;
    }
    return `h:${q}:${r}:${dir}`;
}
```

### Boundary Check with Walls
```javascript
function isAtHexBoundaryOrWall(arrow, cols, rows, wallSet) {
    const { q, r, vector } = arrow;

    // Check exterior boundaries first (from §3)
    if (isAtHexBoundary(arrow, cols, rows)) return true;

    // Check internal walls
    if (wallSet && wallSet.size > 0) {
        const wallKey = normalizeWallKey(q, r, vector);
        if (wallSet.has(wallKey)) return true;
    }
    return false;
}
```

### Wall Rendering
Draw a thick line segment on the shared edge between two hexes:

```javascript
function drawHexWall(ctx, q, r, dir, hexSize, border, wallColor) {
    const { col, row } = axialToOffset(q, r);
    const { px: cx, py: cy } = hexCellToPixel(col, row, hexSize, border);

    // The two vertices of the hex edge for direction `dir`
    const angle1 = Math.PI / 6 + dir * Math.PI / 3;
    const angle2 = Math.PI / 6 + (dir + 1) * Math.PI / 3;

    const x1 = cx + hexSize * Math.cos(angle1);
    const y1 = cy + hexSize * Math.sin(angle1);
    const x2 = cx + hexSize * Math.cos(angle2);
    const y2 = cy + hexSize * Math.sin(angle2);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = wallColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
}
```

### Wall Placement UI
When wall mode is active, detect which hex edge the user clicks/taps near:

```javascript
function nearestHexEdge(px, py, hexSize, border, cols, rows) {
    // Find the cell the point is in
    const { q, r } = pixelToHexCell(px, py, hexSize, border);
    const { col, row } = axialToOffset(q, r);
    const { px: cx, py: cy } = hexCellToPixel(col, row, hexSize, border);

    // Find which edge is closest to the click point
    let minDist = Infinity;
    let closestDir = 0;

    for (let dir = 0; dir < 6; dir++) {
        const angle1 = Math.PI / 6 + dir * Math.PI / 3;
        const angle2 = Math.PI / 6 + (dir + 1) * Math.PI / 3;
        const mx = cx + hexSize * (Math.cos(angle1) + Math.cos(angle2)) / 2;
        const my = cy + hexSize * (Math.sin(angle1) + Math.sin(angle2)) / 2;
        const dist = Math.hypot(px - mx, py - my);
        if (dist < minDist) {
            minDist = dist;
            closestDir = dir;
        }
    }

    return { q, r, dir: closestDir };
}
```

---

## 8. Symmetry Modes

AG16 has 4 symmetry modes. Hex grids have natural symmetry axes that map well:

| AG16 Square Symmetry | Hex Equivalent | Axis |
|----------------------|----------------|------|
| Horizontal (left↔right) | Horizontal | Mirror across vertical center line |
| Vertical (top↔bottom) | Vertical | Mirror across horizontal center line |
| Forward Diagonal (╱) | 60° Diagonal | Mirror across upper-left → lower-right |
| Backward Diagonal (╲) | 120° Diagonal | Mirror across upper-right → lower-left |

### Horizontal Symmetry (mirror left↔right)
```javascript
function hexMirrorHorizontal(q, r, cols, rows) {
    const { col, row } = axialToOffset(q, r);
    const mirrorCol = cols - 1 - col;
    const { q: mq, r: mr } = offsetToAxial(mirrorCol, row);
    // Mirror direction: E↔W, NE↔NW, SE↔SW
    const HEX_MIRROR_H = [3, 2, 1, 0, 5, 4];
    return { q: mq, r: mr };
}
```

### Vertical Symmetry (mirror top↔bottom)
```javascript
function hexMirrorVertical(q, r, cols, rows) {
    const { col, row } = axialToOffset(q, r);
    const mirrorRow = rows - 1 - row;
    const { q: mq, r: mr } = offsetToAxial(col, mirrorRow);
    // Mirror direction: NE↔SE, NW↔SW, E and W stay
    const HEX_MIRROR_V = [0, 5, 4, 3, 2, 1];
    return { q: mq, r: mr };
}
```

### Direction Mirroring Lookup Tables
```javascript
const HEX_MIRROR = {
    horizontal: [3, 2, 1, 0, 5, 4],  // E↔W, NE↔NW, SE↔SW
    vertical:   [0, 5, 4, 3, 2, 1],  // NE↔SE, NW↔SW, E=E, W=W
    diagonal60:  [5, 0, 3, 2, 1, 4], // rotated mirror
    diagonal120: [1, 4, 3, 2, 5, 0], // rotated mirror
};
```

---

## 9. Grid State — Data Model

The grid object gains `gridType` and hex-specific fields:

```javascript
// Square (existing):
{
    size: 9,
    gridType: 'square',
    arrows: [
        { x: 3, y: 2, vector: 1, channel: 1, velocity: 1.0 },
    ],
    walls: ["h:2:3", "v:4:5"],
    ...
}

// Hex (new):
{
    size: 9,             // used as both cols and rows for a square hex grid
    gridType: 'hex',
    arrows: [
        { q: 2, r: 1, vector: 4, channel: 3, velocity: 0.8 },
    ],
    walls: ["h:1:2:0", "h:3:1:5"],  // axial q, r, direction
    ...
}
```

### Arrow Data Shape
Square arrows use `{ x, y, vector, channel, velocity }`.
Hex arrows use `{ q, r, vector, channel, velocity }`.

For internal consistency, the geometry module translates between them — the rest
of the app doesn't care.

---

## 10. Direction Selector UI

### Square Mode (existing)
4 buttons in a cross:
```
      ↑
    ← · →
      ↓
```

### Hex Mode (new)
6 buttons in a hexagonal layout:
```
    ↗  ↖
   →    ←
    ↘  ↙
```

```html
<!-- Hex direction selector -->
<div class="hex-direction-selector">
    <button class="hex-dir" data-vector="1">↗</button>  <!-- NE -->
    <button class="hex-dir" data-vector="2">↖</button>  <!-- NW -->
    <button class="hex-dir" data-vector="0">→</button>  <!-- E  -->
    <button class="hex-dir" data-vector="3">←</button>  <!-- W  -->
    <button class="hex-dir" data-vector="5">↘</button>  <!-- SE -->
    <button class="hex-dir" data-vector="4">↙</button>  <!-- SW -->
</div>
```

CSS layout (2-column grid, 3 rows):
```css
.hex-direction-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    width: fit-content;
}
```

---

## 11. Grid Type Toggle Button

### Location
Place in the right-side control panel, near the DIRECTION section. A single button
with an icon:

```
[⬡ / ▦]   ← toggles between hex and square icons
```

### Behavior on Toggle
1. Store current grid to undo stack
2. Switch `grid.gridType` between `'square'` and `'hex'`
3. **Clear arrows** (geometries are incompatible — can't map square coords to hex)
4. Keep: channel settings, scale, key, BPM, volume, mute states, MIDI config
5. Swap direction selector UI (4-button ↔ 6-button)
6. Swap wall types
7. Recalculate canvas dimensions
8. Reset symmetry mode (axes differ between grid types)

### Grid Size
- Square: size N → N×N cells
- Hex: size N → N×N hexes (rectangular hex grid, same total count)
- Size slider range and label stay the same

---

## 12. Performance Optimizations (Both Modes)

All of AG16's existing performance features must apply to hex mode:

### Batched Canvas Rendering
- Use `Path2D` for grid lines, walls, and arrow shapes
- Single draw call per layer (grid lines → walls → arrows → animation)
- Same `requestAnimationFrame` loop

### Optimized Simulation (`arrows-logic-optimized.js`)
- **Arrow pooling**: Reuse arrow objects instead of creating new ones each tick
- **Hash-based collision detection**: `(q << 16) | (r << 8) | vector` — same
  formula works since all values fit in the bit ranges
- **Set-based wall lookups**: `wallSet.has(key)` — O(1) per check
- **Precomputed boundary table**: At grid creation, build a `Set` of
  `(q, r, vector)` tuples that are at boundaries. Then `isAtBoundary` is just
  a Set lookup instead of conditional logic.

### Spatial Hashing for Collisions
```javascript
function buildHexCellMap(arrows) {
    const map = new Map();
    for (const arrow of arrows) {
        const key = (arrow.q << 12) | arrow.r;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(arrow);
    }
    return map;
}
```

### Off-Screen Canvas
Draw static elements (grid lines, note labels) to an off-screen canvas and
composite — same technique used in square mode.

---

## 13. Integration Points — What Changes, What Doesn't

### DOES NOT CHANGE (shared between both modes):
- `synth-engine.js` — Receives note index, doesn't care about grid shape
- `play-notes.js` — Receives boundary arrows + note index
- `midi.js` — Receives note numbers
- `channels.js` — Channel colors, ADSR, volume per channel
- `scales.js` — Musical scales and keys
- Save/load to localStorage (just serialize `gridType`)
- Import/export JSON
- Error boundary, modals
- CSS theming (dark mode, colors)
- Undo/redo (stores full grid state, including `gridType`)
- Channel panel UI
- FX modal
- BPM, master volume, scale/key selectors

### MUST CHANGE (grid-type-aware):
| Module | What Changes |
|--------|-------------|
| `arrows-logic-optimized.js` | 6 vectors, `%6` math, axial movement, hex boundary detection, wall check with direction |
| `arrows-logic.js` (legacy) | Same as above for non-optimized path |
| `animations.js` | Hex canvas rendering, `hexCellToPixel`, `drawHex`, `drawHexArrow`, hex animation interpolation, hex wall rendering, hex note labels |
| `app.js` | `gridType` state, toggle UI, 6-direction selector, hex presets, hex wall placement |
| `presets.js` | Add hex preset array |
| Wall placement UI | 6 edge types per cell, nearest-edge detection |
| Direction selector | 6 buttons in hexagonal layout |
| Symmetry | Mirror lookup tables for hex |
| URL share encoding | 1-bit grid type flag, 3-bit vector encoding |

---

## 14. URL Sharing / Serialization

### Binary Encoding
Add a grid type bit to the header byte:

```
Byte 0: [version:4][gridType:1][reserved:3]
         gridType: 0 = square, 1 = hex
```

Arrow vector field needs **3 bits** (0–5) instead of 2 bits (0–3):

```
Square arrow: [x:7][y:7][vector:2][channel:4][velocity:4] = 24 bits = 3 bytes
Hex arrow:    [q:7][r:7][vector:3][channel:4][velocity:4] = 25 bits ≈ 4 bytes
```

Or use a simple `g=hex` query parameter and keep the existing encoding with an
extra bit for vector.

### JSON Export
```json
{
    "version": 2,
    "gridType": "hex",
    "size": 9,
    "scale": "Major",
    "key": "C4",
    "bpm": 120,
    "arrows": [
        { "q": 2, "r": 1, "vector": 4, "channel": 3, "velocity": 0.8 }
    ],
    "walls": ["h:1:2:0", "h:3:1:5"]
}
```

---

## 15. Presets — Hex-Specific

Design a set of hex presets that showcase the 6-direction bouncing. Examples:

### Ring (arrows on the border, all pointing inward)
```javascript
{
    size: 7, gridType: 'hex',
    arrows: [
        { q: 0, r: 3, vector: 0, channel: 1 },  // left edge → E
        { q: 3, r: 0, vector: 5, channel: 2 },  // top → SE
        { q: 6, r: 0, vector: 4, channel: 3 },  // top-right → SW
        { q: 6, r: 3, vector: 3, channel: 4 },  // right edge → W
        { q: 3, r: 6, vector: 1, channel: 5 },  // bottom → NE
        { q: 0, r: 6, vector: 0, channel: 6 },  // bottom-left → E
    ]
}
```

### Spiral (arrows placed in a spiral pattern)
### Cross-streams (two groups heading in opposite hex directions)
### Honeycomb (arrows at every other cell, alternating directions)
### Chaos (randomized arrows, many channels)

Create 8–12 hex-specific presets. Each must be tested for interesting musical
output across scales.

---

## 16. Note Labels Along Edges

### Square Mode (existing)
Note labels appear along top and left edges of the grid.

### Hex Mode
Note labels along all 4 edges of the rectangular hex grid:
- **Top row**: Labels above each hex in row 0
- **Bottom row**: Labels below each hex in the last row
- **Left column**: Labels to the left of column 0
- **Right column**: Labels to the right of the last column

The label text comes from the existing scale/key system —
`scaleNotes[position % scaleNotes.length]`.

---

## 17. Geometry Abstraction Module

Create a shared interface so all grid-type-dependent code goes through one object:

```javascript
// src/arrow-grid/geometry/index.js
import { squareGeometry } from './square.js';
import { hexGeometry } from './hex.js';

export function getGeometry(gridType) {
    return gridType === 'hex' ? hexGeometry : squareGeometry;
}
```

```javascript
// src/arrow-grid/geometry/hex.js
export const hexGeometry = {
    type: 'hex',
    directions: 6,
    flipVector: (v) => (v + 3) % 6,
    deduplicateMod: 6,
    isValidCell: (q, r, cols, rows) => {
        const { col, row } = axialToOffset(q, r);
        return col >= 0 && row >= 0 && col < cols && row < rows;
    },
    totalCells: (size) => size * size,
    isAtBoundary: (arrow, cols, rows, wallSet) => isAtHexBoundaryOrWall(arrow, cols, rows, wallSet),
    moveInPlace: (arrow) => moveHexArrowInPlace(arrow),
    rotateAmount: (groupSize) => (groupSize - 1) % 6,
    cellToPixel: (q, r, hexSize, border) => {
        const { col, row } = axialToOffset(q, r);
        return hexCellToPixel(col, row, hexSize, border);
    },
    pixelToCell: (px, py, hexSize, border) => pixelToHexCell(px, py, hexSize, border),
    canvasDimensions: (size, hexSize, border) => hexCanvasDimensions(size, size, hexSize, border),
    drawGrid: (ctx, size, hexSize, border, color) => drawHexGrid(ctx, size, size, hexSize, border, color),
    drawArrow: (ctx, cx, cy, size, vector, color) => drawHexArrow(ctx, cx, cy, size, vector, color),
    animationShift: (px, py, vector, pct, hexSize) => hexAnimationShift(px, py, vector, pct, hexSize),
    getNoteIndex: (arrow, cols, rows) => getHexNoteIndex(arrow, cols, rows),
    symmetryMirror: (q, r, dir, cols, rows, axis) => hexSymmetryMirror(q, r, dir, cols, rows, axis),
    nearestEdge: (px, py, hexSize, border, cols, rows) => nearestHexEdge(px, py, hexSize, border, cols, rows),
    drawWall: (ctx, q, r, dir, hexSize, border, color) => drawHexWall(ctx, q, r, dir, hexSize, border, color),
};
```

```javascript
// src/arrow-grid/geometry/square.js
export const squareGeometry = {
    type: 'square',
    directions: 4,
    flipVector: (v) => (v + 2) & 3,
    deduplicateMod: 4,
    isValidCell: (x, y, size) => x >= 0 && y >= 0 && x < size && y < size,
    totalCells: (size) => size * size,
    isAtBoundary: (arrow, size, __, wallSet) => isAtSquareBoundary(arrow, size, wallSet),
    moveInPlace: (arrow) => moveSquareArrowInPlace(arrow),
    rotateAmount: (groupSize) => (groupSize - 1) % 4,
    // ... (wrap existing AG16 logic)
};
```

---

## 18. Implementation Priority

### Phase 1 — Core Logic (no rendering)
- [ ] Create `geometry/hex.js` with movement, boundary, flip, collision
- [ ] Unit tests for all hex geometry functions
- [ ] Wire into `arrows-logic-optimized.js` via `getGeometry()`

### Phase 2 — Rendering
- [ ] Hex canvas: grid lines, cell outlines, note labels
- [ ] Hex arrow rendering (6-direction triangles)
- [ ] Animation interpolation for hex movement
- [ ] Wall rendering on hex edges

### Phase 3 — UI Integration
- [ ] Grid type toggle button in control panel
- [ ] 6-direction selector (hexagonal button layout)
- [ ] Wall placement UI (nearest hex edge detection)
- [ ] State management: `gridType` field, toggle handler

### Phase 4 — Features
- [ ] Hex symmetry modes (4 axes)
- [ ] Hex presets (8–12 patterns)
- [ ] Hex wall interaction (click-to-place, click-to-remove)
- [ ] Note label rendering along 4 hex grid edges

### Phase 5 — Polish & Performance
- [ ] Precomputed boundary lookup table
- [ ] Off-screen canvas for static hex grid
- [ ] Path2D batching for hex rendering
- [ ] URL sharing with hex support
- [ ] Save/load with gridType
- [ ] Responsive hex canvas sizing
- [ ] Elastic pause animation for hex mode

---

## 19. Key Differences from the Triangle Spec

| Aspect | Triangle | Hex |
|--------|----------|-----|
| Grid shape | Triangular (fewer cells at bottom) | Rectangular (uniform cols×rows) |
| Total cells | Triangular number: N(N+1)/2 | N×N (same as square) |
| Boundaries | 3 edges (top, left, hypotenuse) | 4 edges (top, right, bottom, left) |
| Flip | Reflection lookup table (edge-dependent) | Simple 180°: `(v+3)%6` |
| Wall edge types | 3 (r, br, bl) | 6, normalized to 3 (E, NE, SE) |
| Symmetry | 3-fold rotational | 4 mirror axes (same count as square) |
| Coordinate system | Integer (x, y) with x+y < size constraint | Axial (q, r) with offset for rendering |
| UX familiarity | Very different from square | Feels like a natural extension of square |

The hex approach is **more consistent** with the existing AG16 UX because it
keeps the rectangular layout, 4-edge boundaries, same grid-size semantics, and
a clean 180° flip — reducing the delta between modes.
