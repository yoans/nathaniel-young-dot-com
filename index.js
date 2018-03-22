

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
const getVector = () => chance.natural({
  min: 0,
  max: 3
});

const cycleVector = (vector) => {
  return (vector + 1) % 4
}

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
}

const seedGrid = () => newGrid(getRandomNumber(20)+1, getRandomNumber(100)+1);

const nextGrid = (grid) => {

  const size = grid.rows.length;
  const arrows = grid.arrows;
  // arrows.map();
  return grid;
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
}

const renderRow = (row, index) => {
  return (
    <tr key={index.toString()}>
      {row.map(renderItem)}
    </tr>
  )
}
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
    await sleep(1000);
    ReactDOM.render(Application(cyclingGrid), document.getElementById('root'));

  }
}

demo();

