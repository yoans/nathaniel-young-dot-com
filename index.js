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
  // this.pauseHandler = this.pause.bind(this);
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
// pause() {
//   clearInterval(this.timerID);
//   this.setState({playing:false});
// }
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
  this.newGridHandler();
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
    numberOfArows: input
  });
  this.newGridHandler()
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
    <br/>
    <input type='number' max={maxArrows} min={minArrows} value={this.state.numberOfArows} onChange={this.newNumberOfArrowsHandler}/>
    <br/>
    <input type='number' max={maxSize} min={minSize} value={this.state.gridSize} onChange={this.newSizeHandler}/>
    <br/>
    <table align="center">
      <tbody>
        {renderGrid(this.state.grid)}
      </tbody>
    </table>
  </div>
)};
}
//
// function midiProc(event) {
//   data = event.data;
//   var cmd = data[0] >> 4;
//   var channel = data[0] & 0xf;
//   var noteNumber = data[1];
//   var velocity = data[2];
//
//   if ( cmd==8 || ((cmd==9)&&(velocity==0)) ) { // with MIDI, note on with velocity zero is the same as note off
//     // note off
//     //noteOff(b);
//   } else if (cmd == 9) {  // Note on
//     if ((noteNumber&0x0f)==8)
//       tick();
//     else {
//       var x = noteNumber & 0x0f;
//       var y = (noteNumber & 0xf0) >> 4;
//       flipXY( x, y );
//     }
//   } else if (cmd == 11) { // Continuous Controller message
//     switch (noteNumber) {
//     }
//   }
// }
//
// function onMIDIFail( err ) {
// 	alert("MIDI initialization failed.");
// }
//
// function onMIDIInit( midi ) {
//   midiAccess = midi;
//   selectMIDIOut=document.getElementById("midiOut");
//
//   for (var input of midiAccess.inputs.values()) {
//     if ((input.name.toString().indexOf("Launchpad") != -1)||(input.name.toString().indexOf("QUNEO") != -1)) {
//       launchpadFound = true;
//       selectMIDIIn.add(new Option(input.name,input.id,true,true));
//       midiIn=input;
// 	  midiIn.onmidimessage = midiProc;
//     }
//     else
//     	selectMIDIIn.add(new Option(input.name,input.id,false,false));
//   }
//   selectMIDIIn.onchange = changeMIDIIn;
//
//   // clear the MIDI output select
//   selectMIDIOut.options.length = 0;
//   for (var output of midiAccess.outputs.values()) {
//     if ((output.name.toString().indexOf("Launchpad") != -1)||(output.name.toString().indexOf("QUNEO") != -1)) {
//       selectMIDIOut.add(new Option(output.name,output.id,true,true));
//       midiOut=output;
//     }
//     else
//     	selectMIDIOut.add(new Option(output.name,output.id,false,false));
//   }
//   selectMIDIOut.onchange = changeMIDIOut;
//
//   if (midiOut && launchpadFound) {
// 	midiOut.send( [0xB0,0x00,0x00] ); // Reset Launchpad
// 	midiOut.send( [0xB0,0x00,0x01] ); // Select XY mode
// 	drawFullBoardToMIDI();
//   }
// }
//
//
// navigator.requestMIDIAccess({}).then( onMIDIInit, onMIDIFail );
ReactDOM.render(<Application/>, document.getElementById('root'));

