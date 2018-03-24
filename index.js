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
export const getRows = size => R.range(0, size).map(() => R.range(0, size));
export const getArrow = size => () => ({
  x: getRandomNumber(size),
  y: getRandomNumber(size),
  vector: getVector()
});
export const newGrid = (size, numberOfArrows) => {
  const arrows = R.range(0, numberOfArrows).map(getArrow(size))

  return {size, arrows};
};
export const seedGrid = () => newGrid(getRandomNumber(20)+12, getRandomNumber(50)+1);
export const moveArrow = arrow => vectorOperations[arrow.vector](arrow);
export const arrowKey = arrow => '{x:'+arrow.x+',y:'+arrow.y+'}';
export const arrowBoundaryKey = (arrow, size)=> {
  if(arrow.y === 0 && arrow.vector === 0) {
    return 'boundary';
  }
  if(arrow.x === size - 1 && arrow.vector === 1) {
    return 'boundary';
  }
  if(arrow.y === size - 1 && arrow.vector === 2) {
    return 'boundary';
  }
  if(arrow.x === 0 && arrow.vector === 3) {
    return 'boundary';
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
  const size = grid.size;
  const arrows = grid.arrows;

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
  const movedFlippedBoundaryArrows = newArrayIfFalsey(arrowBoundaryDictionary['boundary']).map(flipArrow).map(moveArrow);

    return {
        size,
        arrows: [
            ...movedArrowsInMiddle,
            ...movedFlippedBoundaryArrows
        ]
    };
};

const renderItem = (item) => {
  if(item.length){
    const classes = R.uniqBy(x=>x.vector, item).map(({vector})=>vectors[vector]);

    return (
      <td>
          <div className={'space'}>
              {classes.map(divClass=>(<div className={divClass}/>))}
          </div>
      </td>
    )
  }
  return (
    <td>
      <div className={'space'}/>
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

  const populatedGrid = getRows(grid.size).map(populateRow);
  return populatedGrid.map(renderRow);
};
// const onChangeSize = (event) => 

export class Application extends React.Component { 

constructor(props) {
  super(props);

  this.state = {
    gridSize: 10,
    numberOfArows: 10,
    grid: newGrid(10, 10),
    playing: true
  }
  this.newSizeHandler = this.newSize.bind(this);
  this.newNumberOfArrowsHandler = this.newNumberOfArrows.bind(this);
  this.nextGridHandler = this.nextGrid.bind(this);
  this.newGridHandler = this.newGrid.bind(this);
  this.playHandler = this.play.bind(this);
  this.pauseHandler = this.pause.bind(this);
}

componentDidMount() {
  this.playHandler();
}
play() {
  this.timerID = setInterval(
    () => this.nextGridHandler(),
    500
  );
  {playing:true}
}
pause() {
  clearInterval(this.timerID);
  this.setState({playing:false});
}
newSize(e) {
  this.setState({
    gridSize: parseInt(e.target.value)
  })
}
newNumberOfArrows(e) {
  this.setState({
    numberOfArows: parseInt(e.target.value)
  })
}
nextGrid() {
  this.setState({
    grid: nextGrid(this.state.grid)
  })
}
newGrid() {
  this.setState({
    grid: newGrid(this.state.gridSize, this.state.numberOfArows)
  })
}
render() {
  
  return(
  <div>
    <h1>Arrows</h1>
    <br/>
    <p>Size:</p>
    <input type='number' onChange={this.newSizeHandler}/>
    <br/>
    <p>Number:</p>
    <input type='number' onChange={this.newNumberOfArrowsHandler}/>
    <br/>
    <button onClick={this.newGridHandler}>
      Reset
    </button>
    <button onClick={this.nextGridHandler}>
      Next
    </button>
    <button disabled={this.state.playing} onClick={this.playHandler}>
      Play
    </button>
    <button onClick={this.pauseHandler}>
      Pause
    </button>
    <br/>
    <table>
      <tbody>
        {renderGrid(this.state.grid)}
      </tbody>
    </table>
  </div>
)};
}
// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function demo() {
//   let cyclingGrid = seedGrid();
//   while(true){
//     cyclingGrid = nextGrid(cyclingGrid);
//     await sleep(500);
//     ReactDOM.render(Application(cyclingGrid), document.getElementById('root'));
//   }
// }

// demo();

ReactDOM.render(<Application/>, document.getElementById('root'));

