import React from 'react';
import ReactDOM from 'react-dom';
import Chance from 'chance';
import * as R from 'ramda';

const chance = new Chance();
export const vectors = [
  'arrow-up',
  'arrow-right',
  'arrow-down',
  'arrow-left'
];
export const vectorOperations = [
  ({x, y, vector})=>({x, y: y-1, vector}),
  ({x, y, vector})=>({x: x+1, y, vector}),
  ({x, y, vector})=>({x, y: y+1, vector}),
  ({x, y, vector})=>({x: x-1, y, vector})
];
export const getVector = () => chance.natural({
  min: 0,
  max: 3
});
export const cycleVector = (vector, number) => {
  return (vector + number - 1) % 4
};
export const getRandomNumber = (size) => chance.natural({
  min: 0,
  max: size - 1
});
export const getGrid = (size) => ({
  rows: R.range(0, size).map(() => R.range(0, size))
});
export const getArrow = size => () => ({
  x: getRandomNumber(size),
  y: getRandomNumber(size),
  vector: getVector()
});
export const newGrid = (size, numberOfArrows) => {
  const arrows = R.range(0, numberOfArrows).map(getArrow(size))

  return Object.assign(getGrid(size), {arrows});
};
export const seedGrid = () => newGrid(getRandomNumber(20)+1, getRandomNumber(100)+1);
export const moveArrow = arrow => vectorOperations[arrow.vector](arrow);
export const arrowKey = arrow => '{x:'+arrow.x+',y:'+arrow.y+'}';
export const arrowBoundaryKey = (arrow, size)=> {
  if(arrow.y === 0 && arrow.vector === 0) {
    return 'v0';
  }
  if(arrow.x === size && arrow.vector === 1) {
    return 'v1';
  }
  if(arrow.y === size && arrow.vector === 2) {
    return 'v2';
  }
  if(arrow.x === 0 && arrow.vector === 3) {
    return 'v3';
  }
  return 'no-boundary';
};
export const newArrayIfFalsey = thingToCheck => thingToCheck ? thingToCheck : [];
export const rotateArrow = number => arrow => ({
  ...arrow,
  vector: cycleVector(arrow.vector, number)
});
export const rotateSet = set => set.map(rotateArrow(set.length));
export const flipArrow = ({vector, ...rest}) => ({vector: (vector+2)%4, ...rest});
export const nextGrid = (grid) => {
  const size = grid.rows.length;
  const arrows = grid.arrows;
  const newGrid = {
    rows: getGrid(size).rows,
    arrows:[]
  };

  const arrowSetDictionary = arrows.reduce(
      (arrowDictionary, arrow) => {
        arrowDictionary[arrowKey(arrow)] = [
          ...(newArrayIfFalsey(arrowDictionary[arrowKey(arrow)])),
          arrow
        ];
        return arrowDictionary;
      }
  ,{});

  const arrowSets = Object.keys(arrowSetDictionary).map(key => arrowSetDictionary[key]);
  const rotatedArrows = arrowSets.map(rotateSet);
  const flatRotatedArrows = rotatedArrows.reduce((accum, current)=>[...accum, ...current],[]);

  const arrowBoundaryDictionary = flatRotatedArrows.reduce(
      (arrowDictionary, arrow) => {
        arrowDictionary[arrowBoundaryKey(arrow, size)] = [
          ...(newArrayIfFalsey(arrowDictionary[arrowBoundaryKey(arrow, size)])),
          arrow
        ];
        return arrowDictionary;
      }
      ,{});

  const movedArrowsInMiddle = newArrayIfFalsey(arrowBoundaryDictionary['no-boundary']).map(moveArrow);

  const movedBoundaryArrows = vectorOperations.map((operation, key) => {
    const index = 'v'+key;
    return newArrayIfFalsey(arrowBoundaryDictionary[index]).map(flipArrow).map(operation)
  }).reduce((arr1,arr2)=>[...arr1, ...arr2],[]);
  newGrid.arrows = [
    ...movedArrowsInMiddle,
    ...movedBoundaryArrows
  ];
  return newGrid;
};

const renderItem = (item) => {
  if(item.length){
    const classes = R.uniqBy(x=>x.vector, item).map(({vector})=>vectors[vector]).join(' ');

    return (
      <td>
        <div className={classes}/>
      </td>
    )
  }
  return (
    <td>
      <div className={'empty-space'}/>
    </td>
    )
};

const renderRow = (row, index) => {
  return (
    <tr key={index.toString()}>
      {row.map(renderItem)}
    </tr>
  )
};
const renderGrid = (grid) => {
  
  const populateArrow = y => x => grid.arrows.filter(arrow => arrow.x===x && arrow.y===y);
  const populateRow = (row, index) => row.map(populateArrow(index));

  const populatedGrid = grid.rows.map(populateRow);
  return populatedGrid.map(renderRow);
};

export const Application = (grid) => (
  <div>
    <h1>Arrows</h1>
    <br/>
    <br/>
    <table>
      <tbody>
        {renderGrid(grid)}
      </tbody>
    </table>
  </div>
)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  let cyclingGrid = seedGrid();
  while(true){
    cyclingGrid = nextGrid(cyclingGrid);
    await sleep(500);
    ReactDOM.render(Application(cyclingGrid), document.getElementById('root'));
  }
}

// demo();

