# Triangle Grid Mode — Spec for AG16 Integration

## Overview

This document captures everything needed to add a **Triangle Grid Mode** to AG16
(Arrow Grid: 16 Channel). The goal is to unify Pascal's Music Box and AG16 into a
single app with a grid-shape toggle: **Square** (existing) vs **Triangle** (new).

All AG16 features (16 channels, synth engine, scales, walls, undo/redo, save/load,
MIDI, presets, etc.) should work in both modes. The triangle mode is not a separate
app — it's a geometry variant that changes rendering, movement, boundaries, and
collision math while sharing everything else.

---

## 1. Geometry Fundamentals

### Square Grid (existing AG16)
- **Shape**: Square/rectangle
- **Directions**: 4 (up=0, right=1, down=2, left=3)
- **Cell coords**: Integer `(x, y)` where `0 ≤ x < size` and `0 ≤ y < size`
- **Valid cells**: `size × size` total
- **Movement**: ±1 on one axis per step
- **Flip**: `(vector + 2) % 4` (180° reversal)
- **Collision rotation**: `(vector + groupSize - 1) % 4`
- **Dedup modulus**: `count % 4 || 4`

### Triangle Grid (new mode)
- **Shape**: Equilateral triangle pointing down
- **Directions**: 6 (up-right=0, right=1, down-right=2, down-left=3, left=4, up-left=5)
- **Cell coords**: Integer `(x, y)` where `0 ≤ x`, `0 ≤ y`, and `x + y < size`
- **Valid cells**: `size * (size + 1) / 2` total (triangular number)
- **Movement**: Fractional increments (see below)
- **Flip**: Lookup table `[2, 5, 4, 1, 0, 3]` (reflects across the boundary hit)
- **Collision rotation**: `(vector + groupSize - 1) % 6`
- **Dedup modulus**: `count % 6 || 6`

---

## 2. The 6 Directions — Movement Vectors

Each arrow carries a `vector` (0–5) and a `speed` (default 1).

```
Direction    Vector    X delta         Y delta
─────────────────────────────────────────────────
Up-Right     0         +1/speed        -1/speed
Right        1         +1/speed         0
Down-Right   2          0              +1/speed
Down-Left    3         -1/speed        +1/speed
Left         4         -1/speed         0
Up-Left      5          0              -1/speed
```

Pascal's original used `1/speed` fractional movement, meaning arrows could take
multiple ticks to cross a cell. For the AG16 integration, **simplify to integer
movement** (`speed = 1` always, deltas of ±1 or 0) to match AG16's existing
convention. The fractional speed was a Pascal's-specific feature that can be omitted.

**Simplified integer movement operations:**
```javascript
const TRIANGLE_MOVES = [
    (arrow) => { arrow.x += 1; arrow.y -= 1; }, // 0: up-right
    (arrow) => { arrow.x += 1;               }, // 1: right
    (arrow) => {               arrow.y += 1;  }, // 2: down-right
    (arrow) => { arrow.x -= 1; arrow.y += 1;  }, // 3: down-left
    (arrow) => { arrow.x -= 1;               }, // 4: left
    (arrow) => {               arrow.y -= 1;  }, // 5: up-left
];
```

---

## 3. Boundary Detection (Three Edges)

The triangle has **3 exterior boundaries**, not 4:

| Boundary | Condition          | Applies to vectors heading toward it |
|----------|--------------------|--------------------------------------|
| Top      | `y === 0`          | 0 (up-right) and 5 (up-left)        |
| Left     | `x === 0`          | 3 (down-left) and 4 (left)          |
| Hypotenuse | `x + y === size - 1` | 1 (right) and 2 (down-right)     |

**Pascal's original boundary check** (cleaned up):
```javascript
const isAtTriangleBoundary = (arrow, size) => {
    const { x, y, vector } = arrow;
    // Top edge: y=0, heading upward
    if (y === 0 && (vector === 0 || vector === 5)) return true;
    // Left edge: x=0, heading left
    if (x === 0 && (vector === 3 || vector === 4)) return true;
    // Hypotenuse: x+y=size-1, heading right/down-right
    if (x + y === size - 1 && (vector === 1 || vector === 2)) return true;
    return false;
};
```

**Boundary identification** (which edge was hit — needed for note mapping):
```javascript
const triangleBoundaryEdge = (arrow, size) => {
    const { x, y, vector } = arrow;
    if (y === 0 && (vector === 0 || vector === 5)) return 'top';
    if (x + y === size - 1 && (vector === 1 || vector === 2)) return 'hyp';
    if (x === 0 && (vector === 3 || vector === 4)) return 'left';
    return null;
};
```

---

## 4. Flip/Reflection Logic

When an arrow hits a boundary, its direction reverses. The triangle flip is NOT
a simple `(v + 3) % 6` (180° reversal). It's a **reflection** — the arrow bounces
off the wall it hit:

```javascript
const TRIANGLE_FLIP = [2, 5, 4, 1, 0, 3];
// 0 (up-right) → 2 (down-right)     [bounces off top]
// 1 (right)     → 5 (up-left)        [bounces off hypotenuse]
// 2 (down-right)→ 4 (left)           [bounces off hypotenuse]
// 3 (down-left) → 1 (right)          [bounces off left wall]
// 4 (left)      → 0 (up-right)       [bounces off left wall]
// 5 (up-left)   → 3 (down-left)      [bounces off top]
```

The flip is applied to direction **before** movement, same as AG16's square grid.

**Double-flip (corner hits):** Pascal's handles the case where an arrow hits TWO
boundaries simultaneously (e.g., top-left corner at `x=0, y=0`). In that case,
the flip is applied TWICE — the arrow effectively does a 180° reversal at the corner.
AG16's square grid doesn't need this because square corners always redirect cleanly
with a single `(v+2)%4`, but the triangle has corners where two edges meet at
non-right angles.

---

## 5. Collision/Rotation

When multiple arrows occupy the same cell, they rotate — identical mechanic to AG16,
just with 6 directions instead of 4:

```javascript
// Square (AG16 current):
const rotateBy = (groupSize - 1) % 4;
arrow.vector = (arrow.vector + rotateBy) & 3;  // bitwise AND for mod 4

// Triangle (new):
const rotateBy = (groupSize - 1) % 6;
arrow.vector = (arrow.vector + rotateBy) % 6;
```

**Deduplication** also changes modulus:
```javascript
// Square: keep = count % 4 || 4;
// Triangle: keep = count % 6 || 6;
```

---

## 6. Note Mapping

### Pascal's original approach
Pascal's mapped boundary position to note index based on which edge was hit:
- Top boundary (`y=0`): note index = `x` position
- Left boundary (`x=0`): note index = `y` position  
- Hypotenuse (`x+y=size-1`): note index = `y` position

For AG16 integration, this maps cleanly to the **existing scale system**. The note
index is: `position % scaleNotes.length`, where `position` is the coordinate along
the struck edge.

### Mapping to AG16's scale/key system
```javascript
const getTriangleNoteIndex = (arrow, size) => {
    const { x, y, vector } = arrow;
    if (y === 0 && (vector === 0 || vector === 5)) return x;         // top edge
    if (x + y === size - 1 && (vector === 1 || vector === 2)) return y;  // hypotenuse
    if (x === 0 && (vector === 3 || vector === 4)) return y;         // left edge
    return 0;
};
```

This feeds directly into AG16's existing `playSounds()` → `synth-engine.js` pipeline.
No changes needed to the audio system — the note index maps to scale degree the
same way as square grid.

---

## 7. Rendering — Canvas Geometry

### Coordinate conversion: grid index → pixel position

In the triangle grid, cells are arranged in an equilateral triangle. The pixel
position of cell `(x, y)` is:

```javascript
const SQRT3 = Math.sqrt(3);

// Cell (x,y) → pixel top-left corner
const triangleCellToPixel = (x, y, cellSize) => ({
    px: borderSize + x * cellSize + y * cellSize / 2.0,
    py: borderSize + y * cellSize * SQRT3 / 2.0
});
```

This creates a triangular grid where:
- Each row shifts right by `cellSize/2` (creating the diagonal)
- Row height is `cellSize * √3/2` (equilateral triangle height)

### Coordinate conversion: pixel → grid index (for mouse/touch)

```javascript
const pixelToTriangleCell = (px, py, cellSize) => {
    const y = Math.floor((py - borderSize) / (cellSize * SQRT3 / 2));
    const x = Math.floor((px - borderSize - y * cellSize / 2) / cellSize);
    return { x, y };
};
```

### Canvas dimensions
```javascript
const canvasWidth = triangleSize * 2.0;          // base of the triangle
const canvasHeight = triangleSize * SQRT3;        // height of the triangle
// Where triangleSize is dynamically computed based on viewport (like AG16)
```

### Drawing the grid border
```
sketch.triangle(
    0, 0,                              // top-left
    canvasWidth, 0,                    // top-right
    canvasWidth / 2, canvasHeight      // bottom-center
);
```

### Drawing cell markers
Pascal's draws **hexagon markers** at each valid cell position. AG16 could use
the same approach or draw subtle grid lines.

Hexagon marker at cell center:
```javascript
const drawHexMarker = (sketch, cx, cy, radius) => {
    sketch.beginShape();
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
        sketch.vertex(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    }
    sketch.endShape(sketch.CLOSE);
};
```

Cell center = `(px + cellSize/2, py + cellSize*√3/6)`.

### Valid cell check (for mouse interaction)
A pixel is inside the triangle if:
```javascript
const pointInTriangle = (px, py) => (
    px - py / SQRT3 >= borderSize &&           // left edge
    px <= canvasWidth - borderSize - py / SQRT3 &&  // right edge
    py >= borderSize                           // top edge
);
```

### Drawing arrows
Pascal's draws arrows as small hexagons (not directional triangles like AG16's
squares). For AG16 integration, draw them as **directional triangles rotated to
match the 6 directions** (extending the existing `triangleDrawingArray` to handle
6 orientations instead of 4).

Arrow shapes for 6 directions:
```javascript
// Each arrow is a small triangle pointing in its direction
// Rotate by 60° per direction (0° = up-right, 60° = right, etc.)
const drawTriangleArrow = (sketch, cx, cy, size, vector) => {
    const angle = -Math.PI / 6 + vector * Math.PI / 3; // start at 30° (up-right)
    sketch.push();
    sketch.translate(cx, cy);
    sketch.rotate(angle);
    sketch.triangle(0, -size * 0.4, size * 0.35, size * 0.2, -size * 0.35, size * 0.2);
    sketch.pop();
};
```

### Animation interpolation
Same concept as AG16 — arrows smoothly slide between positions using `percentage`:
```javascript
const timeShift = (pos, vector, percentage, cellSize) => {
    const shifts = [
        { dx: percentage * cellSize / 2,   dy: -percentage * cellSize * SQRT3 / 2 },  // 0: up-right
        { dx: percentage * cellSize,       dy: 0 },                                     // 1: right
        { dx: percentage * cellSize / 2,   dy: percentage * cellSize * SQRT3 / 2 },    // 2: down-right
        { dx: -percentage * cellSize / 2,  dy: percentage * cellSize * SQRT3 / 2 },    // 3: down-left
        { dx: -percentage * cellSize,      dy: 0 },                                     // 4: left
        { dx: -percentage * cellSize / 2,  dy: -percentage * cellSize * SQRT3 / 2 },   // 5: up-left
    ];
    const s = shifts[vector];
    return { x: pos.x + s.dx, y: pos.y + s.dy };
};
```

---

## 8. Internal Walls (Extending AG16's Wall System)

AG16's square grid uses walls like `"h:y:x"` (horizontal, bottom of cell) and
`"v:y:x"` (vertical, right of cell). The triangle grid has **3 edge types per
cell** instead of 2:

### Triangle cell edges
Each triangular cell `(x, y)` has edges shared with neighbors:
- **Right edge**: shared with cell `(x+1, y)` — if `x+1+y < size`
- **Bottom-right edge**: shared with cell `(x, y+1)` — if `y+1 < size` and `x+y+1 < size`
- **Bottom-left edge**: shared with cell from diagonal

For the triangle grid's internal walls, use a labeling scheme:
```
"r:y:x"  = wall on the right edge of cell (x,y)  [blocks vectors 1 and 4]
"br:y:x" = wall on the bottom-right edge of cell (x,y) [blocks vectors 2 and 5]
"bl:y:x" = wall on the bottom-left edge of cell (x,y) [blocks vectors 3 and 0]
```

The boundary check extends to:
```javascript
const isAtTriangleBoundary = (arrow, size, wallSet) => {
    const { x, y, vector } = arrow;
    // Exterior boundaries (existing logic from §3)
    if (y === 0 && (vector === 0 || vector === 5)) return true;
    if (x === 0 && (vector === 3 || vector === 4)) return true;
    if (x + y === size - 1 && (vector === 1 || vector === 2)) return true;
    // Internal walls
    if (wallSet && wallSet.size > 0) {
        if (vector === 1 && wallSet.has(`r:${y}:${x}`)) return true;   // right
        if (vector === 4 && x > 0 && wallSet.has(`r:${y}:${x-1}`)) return true; // left (neighbor's right)
        if (vector === 2 && wallSet.has(`br:${y}:${x}`)) return true;  // down-right
        if (vector === 5 && y > 0 && wallSet.has(`br:${y-1}:${x}`)) return true; // up-left (neighbor's br)
        if (vector === 3 && wallSet.has(`bl:${y}:${x}`)) return true;  // down-left
        if (vector === 0 && y > 0 && wallSet.has(`bl:${y-1}:${x+1}`)) return true; // up-right (neighbor's bl)
    }
    return false;
};
```

---

## 9. Symmetry Modes

AG16 has 4 symmetry modes. For the triangle grid, adapt them to the triangular
geometry:

| AG16 Symmetry          | Triangle Equivalent           | Axis                      |
|------------------------|-------------------------------|---------------------------|
| Horizontal             | Horizontal                    | Mirror across the median from top vertex to base center |
| Vertical               | N/A (triangle has no vertical symmetry axis in the same sense) |
| Backward Diagonal      | Left-edge reflection          | Mirror across the left edge median |
| Forward Diagonal       | Hypotenuse reflection         | Mirror across the hypotenuse median |

The triangle has **3 natural symmetry axes** (one from each vertex to the midpoint
of the opposite edge). These map to 3-fold symmetry rather than 4-fold.

**Direction mirroring for horizontal symmetry (left—right):**
```javascript
// Mirror across the vertical median of the triangle
// Position mirror: swap x and (size - 1 - x - y) 
// Vector mirror: [3, 5, 4, 0, 2, 1]
const TRIANGLE_HORIZ_FLIP = [3, 5, 4, 0, 2, 1];
```

This needs careful design. The simplest approach: implement **rotational 3-fold
symmetry** (120° rotations) and **reflective symmetry** (mirror across the
vertical axis of the triangle). These are the natural symmetries of an equilateral
triangle.

---

## 10. Grid State — Data Model

The grid object gains a `gridType` field:

```javascript
// Existing AG16 grid:
{
    size: 9,
    gridType: 'square',    // NEW FIELD — 'square' or 'triangle'
    id: 'grid-42',
    arrows: [
        { x: 3, y: 2, vector: 1, channel: 1, velocity: 1.0 },
        ...
    ],
    walls: ["h:2:3", "v:4:5"],
    muted: false,
    soundOn: true,
    midiOn: false,
}

// Triangle grid:
{
    size: 9,
    gridType: 'triangle',  // ← this changes everything
    id: 'grid-43',
    arrows: [
        { x: 2, y: 1, vector: 4, channel: 3, velocity: 0.8 },
        ...
    ],
    walls: ["r:1:2", "br:3:1"],  // triangle wall format
    muted: false,
    soundOn: true,
    midiOn: false,
}
```

---

## 11. Integration Points — What Changes, What Doesn't

### DOES NOT CHANGE (shared between both modes):
- `synth-engine.js` — Web Audio synthesis (receives note index, doesn't care about grid shape)
- `play-notes.js` — Sound dispatch (receives boundary arrows + note index)
- `midi.js` — MIDI output (receives note numbers)
- `channels.js` — Channel colors, settings, ADSR per channel
- `scales.js` — Musical scales and keys
- All UI controls (channel panel, FX modal, save/load, import/export, share)
- Undo/redo system
- State persistence (localStorage, URL encoding — just serialize `gridType`)
- Error boundary, modals, keyboard shortcuts
- CSS/theming

### MUST CHANGE (grid-type-aware):
| Module | Square Logic | Triangle Logic |
|--------|-------------|----------------|
| `arrows-logic-optimized.js` | 4 vectors, `%4`, `(v+2)&3` flip, rect bounds | 6 vectors, `%6`, flip table, triangular bounds (`x+y<size`) |
| `arrows-logic.js` (legacy) | Same | Same |
| `animations.js` | Square canvas, 4-dir triangles, rect grid lines | Triangular canvas, 6-dir hexagons/arrows, hex grid markers |
| `app.js` (state) | `inputDirection` 0–3, grid size = N×N | `inputDirection` 0–5, grid size = triangular number |
| `app.js` (direction UI) | 4 direction buttons | 6 direction buttons (hexagonal layout) |
| `presets.js` | Square presets | Separate array of triangle presets |
| Wall placement UI | 2 edge types (h/v) | 3 edge types (r/br/bl) |

### RECOMMENDED ARCHITECTURE:

Create a **grid geometry abstraction**:

```javascript
// src/arrow-grid/geometry/square.js
export const squareGeometry = {
    type: 'square',
    directions: 4,
    flipVector: (v) => (v + 2) & 3,
    deduplicateMod: 4,
    isValidCell: (x, y, size) => x >= 0 && y >= 0 && x < size && y < size,
    totalCells: (size) => size * size,
    isAtBoundary: (arrow, size, wallSet) => { /* existing logic */ },
    moveInPlace: (arrow) => { /* existing 4-dir logic */ },
    rotateAmount: (groupSize) => (groupSize - 1) % 4,
    cellToPixel: (x, y, cellSize, border) => ({ /* existing */ }),
    pixelToCell: (px, py, cellSize, border) => ({ /* existing */ }),
    canvasDimensions: (cellSize, size, border) => ({ /* existing */ }),
    drawGrid: (sketch, size, cellSize, border) => { /* existing */ },
    drawArrow: (sketch, cx, cy, size, vector, color) => { /* existing */ },
    animationShift: (pos, vector, percentage, cellSize) => ({ /* existing */ }),
    getNoteIndex: (arrow, size) => { /* existing */ },
    symmetryMirror: (x, y, dir, size, axis) => ({ /* existing */ }),
};

// src/arrow-grid/geometry/triangle.js
export const triangleGeometry = {
    type: 'triangle',
    directions: 6,
    flipVector: (v) => [2, 5, 4, 1, 0, 3][v],
    deduplicateMod: 6,
    isValidCell: (x, y, size) => x >= 0 && y >= 0 && x + y < size,
    totalCells: (size) => size * (size + 1) / 2,
    isAtBoundary: (arrow, size, wallSet) => { /* triangle logic */ },
    moveInPlace: (arrow) => { /* 6-dir logic */ },
    rotateAmount: (groupSize) => (groupSize - 1) % 6,
    cellToPixel: (x, y, cellSize, border) => { /* triangle pixel math */ },
    pixelToCell: (px, py, cellSize, border) => { /* inverse triangle math */ },
    canvasDimensions: (cellSize, size, border) => { /* triangular canvas */ },
    drawGrid: (sketch, size, cellSize, border) => { /* hexagon markers */ },
    drawArrow: (sketch, cx, cy, size, vector, color) => { /* 6-dir arrows */ },
    animationShift: (pos, vector, percentage, cellSize) => { /* 6-dir shifts */ },
    getNoteIndex: (arrow, size) => { /* triangle note mapping */ },
    symmetryMirror: (x, y, dir, size, axis) => { /* triangle symmetry */ },
};
```

Then `arrows-logic-optimized.js` and `animations.js` call
`geometry.isAtBoundary()`, `geometry.moveInPlace()`, etc. based on `grid.gridType`.

---

## 12. UI Changes

### Grid Type Toggle
Add a toggle button (square/triangle icon) in the header or tools panel.
When toggled:
- Clear the grid (or attempt to preserve arrows that fit)
- Switch `grid.gridType`
- Adjust max grid size (triangle mode can go larger since fewer total cells)
- Switch direction selector to 6-button hexagonal layout

### Direction Selector
- **Square mode**: 4 buttons in a cross pattern (existing)
- **Triangle mode**: 6 buttons in a hexagonal pattern

Direction button labels for triangle:
```
    0(↗)  5(↖)
  1(→)      4(←)
    2(↘)  3(↙)
```

### Grid Size Slider
- **Square mode**: Size N means N×N cells (existing)
- **Triangle mode**: Size N means `N(N+1)/2` cells. Display could show "Size: 9 (45 cells)" for clarity.

### Note Labels Along Edges
AG16 shows note labels along the grid edges. For triangle mode, show them along
all 3 edges of the triangle (top, left, hypotenuse).

---

## 13. Presets — Triangle-Specific

Pascal's Music Box had 12 presets. Here are key patterns that work well in the
triangular grid and should be included as triangle presets:

### Diagonal cascade (all arrows on the main diagonal, pointing up-right)
```javascript
{
    size: 8, gridType: 'triangle',
    arrows: [
        { x: 0, y: 0, vector: 0 }, { x: 1, y: 1, vector: 0 },
        { x: 2, y: 2, vector: 0 }, { x: 3, y: 3, vector: 0 },
        { x: 4, y: 4, vector: 0 }, { x: 5, y: 5, vector: 0 },
        { x: 6, y: 6, vector: 0 }, { x: 7, y: 7, vector: 0 },
    ]
}
```

### Cross-stream (two diagonals, different directions)
```javascript
{
    size: 8, gridType: 'triangle',
    arrows: [
        { x: 0, y: 0, vector: 0 }, { x: 1, y: 1, vector: 0 },
        { x: 2, y: 2, vector: 0 }, { x: 3, y: 3, vector: 0 },
        { x: 0, y: 7, vector: 1 }, { x: 1, y: 6, vector: 1 },
        { x: 2, y: 5, vector: 1 }, { x: 3, y: 4, vector: 1 },
    ]
}
```

Copy the original 12 presets from Pascal's `presets.js`, adding `channel` and
`velocity` fields to each arrow. Assign channels for visual variety.

---

## 14. URL Sharing / Serialization

The existing compact binary URL encoding needs a bit to indicate grid type:

```
Byte 0: [version:4][gridType:1][reserved:3]
         gridType: 0 = square, 1 = triangle
```

Or simply add a `t=1` query parameter for triangle grids. The arrow vector field
needs to encode 0–5 (3 bits) instead of 0–3 (2 bits).

---

## 15. Optimized Logic — Key Differences

### Arrow hash (for deduplication)
```javascript
// Square: (x << 16) | (y << 8) | vector
// Triangle: (x << 16) | (y << 8) | vector  — same formula works since vector < 8
```

### Bitwise direction ops
```javascript
// Square: (v + 2) & 3  — bitwise AND for mod 4
// Triangle: can't do (v + 3) % 6 with bitwise. Use lookup table or plain modulo.
```

### Bounds filter
```javascript
// Square: x >= 0 && y >= 0 && x < size && y < size
// Triangle: x >= 0 && y >= 0 && x + y < size
```

---

## 16. Summary of All Code Touchpoints

1. **`arrows-logic-optimized.js`** — Add triangle variants of: `moveArrowInPlace`,
   `flipArrowInPlace`, `isAtBoundary`, `isInBounds`, `nextGrid` (rotation mod,
   dedup mod, bounds check). Branch on `grid.gridType` at the top of `nextGrid()`.

2. **`arrows-logic.js`** (legacy/rendering) — Same changes for `boundaryKey`,
   `ballBoundaryKey`, `flipBall`, `cycleVector`, `vectorOperations`, `nextGrid`.

3. **`animations.js`** — New rendering path for triangle geometry: canvas shape,
   cell-to-pixel, pixel-to-cell, grid markers, arrow shapes, animation
   interpolation, wall rendering. Branch on `stateDrawing.grid.gridType`.

4. **`app.js`** — Add `gridType` to state, toggle UI, 6-direction selector,
   triangle presets, wall placement for 3 edge types.

5. **`presets.js`** — Add triangle preset array alongside square presets.

6. **`channels.js`** — No changes needed.

7. **`synth-engine.js`** — No changes needed.

8. **`play-notes.js`** — Minimal change: note index calculation delegates to
   geometry module.

9. **`scales.js`** — No changes needed.

10. **`midi.js`** — No changes needed.

11. **`App.css`** — Add styles for triangle canvas border, 6-direction selector layout,
    grid type toggle button.

---

## 17. Implementation Priority

1. **Phase 1 — Core logic**: Implement `triangleGeometry` module with movement,
   boundaries, flip, collision. Write tests.
2. **Phase 2 — Rendering**: Add triangle canvas rendering in `animations.js`.
   Get arrows bouncing visually.
3. **Phase 3 — UI integration**: Grid type toggle, 6-direction selector, state
   wiring in `app.js`.
4. **Phase 4 — Features**: Internal walls for triangle, symmetry modes, presets.
5. **Phase 5 — Polish**: Share URLs, responsive sizing, elastic pause animation
   for triangle mode.
