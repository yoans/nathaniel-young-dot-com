

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

const nextGrid = (grid) => {

};

const renderItem = (item) => {
  console.log(item);
  if(item.length == 1){
    return (
      <td>
        <div className={vectors[item[0].vector]}/>
      </td>
    )
  }
  else if(item.length){
      
    return (
      <td>
        <div className={'full-space'}/>
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

const Application = (grid) => <div>
      <h1>Arrows</h1>
      <br/>
      <br/>
      <table>
        <tbody>
        {renderGrid(grid)}
        </tbody>
      </table>
    </div>

ReactDOM.render(Application(newGrid(10, 20)), document.getElementById('root'));


console.log('Hello World')
