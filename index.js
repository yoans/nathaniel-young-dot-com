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
// export const seedGrid = () => newGrid(getRandomNumber(20)+12, getRandomNumber(50)+1);
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

const renderRow = (row) => {
  return (
    <tr key={chance.guid()}>
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

const maxArrows=200;
const minArrows=1;
const maxSize=50;
const minSize=2;
const maxArrowLength=25;
const minArrowLength=2;

class Application extends React.Component { 
constructor(props) {
  super(props);

  this.state = {
    gridSize: 10,
    numberOfArrows: 10,
    grid: newGrid(10, 10),
    playing: true,
    arrowLength: 5
  }
  this.newSizeHandler = this.newSize.bind(this);
  this.newNumberOfArrowsHandler = this.newNumberOfArrows.bind(this);
  this.newArrowLengthHandler = this.newArrowLength.bind(this);
  this.nextGridHandler = this.nextGrid.bind(this);
  this.newGridHandler = this.newGrid.bind(this);
  this.playHandler = this.play.bind(this);
  this.getStylesHandler = this.getStyles.bind(this);
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
newSize(e) {
  let input = parseInt(e.target.value);
  if (isNaN(input)) {
    input = 10;
  }else if(input > maxSize){
    input = maxArrows;
  }else if(input < minSize){
    input = minArrows;
  }
  this.setState({
    gridSize: input
  });
    this.newGridHandler(this.state.numberOfArrows, input, this.state.arrowLength);
}

newArrowLength(e) {
  let input = parseInt(e.target.value);
  if (isNaN(input)) {
    input = 10;
  }else if(input > maxArrowLength){
    input = maxArrowLength;
  }else if(input < minArrowLength){
    input = minArrowLength;
  }
  this.setState({
    arrowLength: input
  });
  this.newGridHandler(this.state.numberOfArrows, this.state.gridSize, input)
}
newNumberOfArrows(e) {
  let input = parseInt(e.target.value);
  if (isNaN(input)) {
    input = 10;
  }else if(input > maxArrows){
    input = maxArrows;
  }else if(input < minArrows){
    input = minArrows;
  }
  this.setState({
    numberOfArrows: input
  });
  this.newGridHandler(input, this.state.gridSize, this.state.arrowLength)
}
nextGrid() {
  this.setState({
    grid: nextGrid(this.state.grid)
  })
}
newGrid(number, size, arrowLength) {
  this.setState({
    grid: newGrid(size, number)
  })
}
render() {
  const styles = this.getStylesHandler();
  return(
  <div>
    <br/>
    <input type='number' max={maxArrowLength} min={minArrowLength} value={this.state.arrowLength} onChange={this.newArrowLengthHandler}/>
    <br/>
    <input type='number' max={maxArrows} min={minArrows} value={this.state.numberOfArrows} onChange={this.newNumberOfArrowsHandler}/>
    <br/>
    <input type='number' max={maxSize} min={minSize} value={this.state.gridSize} onChange={this.newSizeHandler}/>
    <br/>
    <table align="center">
      <tbody>
        {renderGrid(this.state.grid)}
      </tbody>
    </table>
    <a href= 'http://earslap.com/page/otomata.html'>Inspiration: Otomata by Earslap</a>
  </div>
)};
}

ReactDOM.render(<Application/>, document.getElementById('root'));

