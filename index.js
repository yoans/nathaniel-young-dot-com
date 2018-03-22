import React from 'react';
import ReactDOM from 'react-dom';
import Chance from 'chance';
import * as R from 'ramda';

const chance = new Chance();
const vectors = [
  'arrow-up',
  'arrow-left',
  'arrow-down',
  'arrow-right'
];
const vectorOperations = [
  {func:({x, y})=>({x, y: y+1})},
  {func:({x, y})=>({x: x-1, y})},
  {func:({x, y})=>({x, y: y-1})},
  {func:({x, y})=>({x: x+1, y})}
];
const getVector = () => chance.natural({
  min: 0,
  max: 3
});
const cycleVector = (vector, number) => {
  return (vector + number - 1) % 4
};
const getRandomNumber = (size) => chance.natural({
  min: 0,
  max: size - 1
});
const getGrid = (size) => ({
  rows: R.range(0, size).map(() => R.range(0, size))
});
const getArrow = size => () => ({
  x: getRandomNumber(size),
  y: getRandomNumber(size),
  vector: getVector()
});
const newGrid = (size, numberOfArrows) => {
  const arrows = R.range(0, numberOfArrows).map(getArrow(size))

  return Object.assign(getGrid(size), {arrows});
};
const seedGrid = () => newGrid(getRandomNumber(20)+1, getRandomNumber(100)+1);
const moveArrow = arrow => {
  return {
    ...arrow,
    ...vectorOperations[arrow.vector].func(arrow)
  }
};
const arrowKey = arrow => '{x:'+arrow.x+',y:'+arrow.y+'}';
const arrowBoundaryKey = (arrow, size)=> {
  if(arrow.x === size && arrow.vector === 3) {
    return 3;
  }
  if(arrow.y === size && arrow.vector === 2) {
    return 2;
  }
  if(arrow.x === 0 && arrow.vector === 1) {
    return 1;
  }
  if(arrow.y === 0 && arrow.vector === 0) {
    return 0;
  }
  return 'no-boundary';
};
const newArrayIfFalsey = thingToCheck => thingToCheck ? thingToCheck : [];
const rotateArrow = number => arrow => ({
  ...arrow,
  vector: cycleVector(arrow.vector, number)
});
const rotateSet = set => set.map(rotateArrow(set.length));
const nextGrid = (grid) => {
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
    console.log(arrowBoundaryDictionary[(key+2)%4]);
    console.log(newArrayIfFalsey(arrowBoundaryDictionary[(key+2)%4]));
    console.log(operation)

    console.log({key});
    console.log({mod: (key+2)%4});

    return newArrayIfFalsey(arrowBoundaryDictionary[(key+2)%4]).map(operation.func)
  });
  newGrid.arrows = [
    ...movedArrowsInMiddle,
    ...movedBoundaryArrows
  ];
  return newGrid;
};

const renderItem = (item) => {
  if(item.length == 1){
    return (
      <td>
        <div className={vectors[item[0].vector]}/>
      </td>
    )
  }
  else if(item.length){
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
  
  const populateArrow = x => y => grid.arrows.filter(arrow => arrow.x===x && arrow.y===y);
  const populateRow = (row, index) => row.map(populateArrow(index));

  const populatedGrid = grid.rows.map(populateRow);
  return populatedGrid.map(renderRow);
};

const Application = (grid) => (
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
    await sleep(10000);
    ReactDOM.render(Application(cyclingGrid), document.getElementById('root'));
  }
}

demo();

