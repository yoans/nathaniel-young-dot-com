import React from 'react';
import ReactDOM from 'react-dom';
import Chance from 'chance';
import * as R from 'ramda';
import Pizzicato from 'pizzicato';
import notesFrequencies from 'notes-frequencies';
import { release } from 'os';

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

  return {size, arrows, muted: true};
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

function sound(src, speed) {
    const aSound = document.createElement("audio");
    aSound.src = src;
    aSound.setAttribute("preload", "auto");
    aSound.setAttribute("controls", "none");
    aSound.style.display = "none";
    aSound.setAttribute("playbackRate", speed);
    document.body.appendChild(aSound);
    return {
        play: function(){
            aSound.play();
            setTimeout(()=>document.body.removeChild(aSound), 500);
        }
        // ,
        // Ele: aSound
    }
    // this.stop = function(){
        // aSound.pause();
    // }
}
const getSpeed = (x, y, size) => {
    if(x === size - 1 || x === 0){
        return (parseFloat(y)*2.0/parseFloat(size))+0.5;
    }else if(y === size - 1 || x === 0){
        return (parseFloat(x)*2.0/parseFloat(size))+0.5;
    }
    return 1.0;
}
const getIndex = (x, y, size) => {
    if(x === size - 1 || x === 0){
        return y;
    }else if(y === size - 1 || y === 0){
        return x
    }
    return 0;
}

const makePizzaSound = (index) => {

    // const frequencies = notesFrequencies('D3 F3 G#3 C4 D#4 G4 A#5');
    const frequencies = notesFrequencies('A3 C3 D3 E3 F3 G3 A4 C4 D4 E4 F4 G4 A5 C5 D5 E5 F5 G5');
    const aSound = new Pizzicato.Sound({ 
        source: 'wave', 
        options: {
            frequency: frequencies[index%frequencies.length][0],
            attack: 0.9,
            release: 0.9,
            type:'sawtooth'
        }
    });
    var distortion = new Pizzicato.Effects.Distortion({
        gain: 0.8
    });
     
    aSound.addEffect(distortion);
    
    // var flanger = new Pizzicato.Effects.Flanger({
    //     time: chance.natural({min:20, max: 60})*1.0/100,
    //     speed: chance.natural({min:50, max: 60})*1.0/100,
    //     depth: chance.natural({min:20, max: 40})*1.0/100,
    //     feedback: 0.3,
    //     mix: 0.4
    // });
    // aSound.addEffect(flanger);
    var reverb = new Pizzicato.Effects.Reverb({
        time: 0.2,
        decay: 0.3,
        reverse: true,
        mix: 0.5
    });
     
    aSound.addEffect(reverb);
    return {        
        play: function(){
            aSound.play();
            setTimeout(()=>aSound.stop(), 550);
        }
    }
}
export const playSounds = (boundaryArrows, size) => {
    boundaryArrows.map((arrow)=>{
        const speed = getIndex(arrow.x, arrow.y, size);
        // console.log(speed);
        // const snd = sound("testSound.wav", speed);
        const snd = makePizzaSound(speed);
        snd.play();
    })
}
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
    if(!grid.muted){
        playSounds(newArrayIfFalsey(arrowBoundaryDictionary['boundary']), size);
    }
    const movedArrowsInMiddle = newArrayIfFalsey(arrowBoundaryDictionary['no-boundary']).map(moveArrow);
    const movedFlippedBoundaryArrows = newArrayIfFalsey(arrowBoundaryDictionary['boundary']).map(flipArrow).map(moveArrow);
    

    return {
        ...grid,
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

const updateStyle = ()=>{
    const style = document.createElement('style');
    style.type = 'text/css';
    const keyFrames = ''+
    '@keyframes go-up {'+
    '    0%   {left:0px; top:DYNAMICpx;}'+
    '    100% {left:0px; top:0px;}'+
    '}'+
    '@keyframes go-right {'+
    '    0%   {left:-DYNAMICpx; top:0px;}'+
    '    100% {left:0px; top:0px;}'+
    '}'+
    '@keyframes go-down {'+
    '    0%   {left:0px; top:-DYNAMICpx;}'+
    '    100% {left:0px; top:0px;}'+
    '}'+
    '@keyframes go-left {'+
    '    0%   {left:DYNAMICpx; top:0px;}'+
    '    100% {left:0px; top:0px;}'+
    '';
    style.innerHTML = keyFrames.replace(/DYNAMIC/g, "19");
    document.getElementsByTagName('head')[0].appendChild(style);
}


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
const maxArrows=30;
const minArrows=1;
const maxSize=18;
const minSize=2;
export class Application extends React.Component { 

constructor(props) {
  super(props);

  this.state = {
    gridSize: 10,
    numberOfArows: 10,
    grid: newGrid(10, 10),
    playing: true,
    muted: true
  }
  this.newSizeHandler = this.newSize.bind(this);
  this.newNumberOfArrowsHandler = this.newNumberOfArrows.bind(this);
  this.nextGridHandler = this.nextGrid.bind(this);
  this.newGridHandler = this.newGrid.bind(this);
  this.playHandler = this.play.bind(this);
  // this.pauseHandler = this.pause.bind(this);
  this.muteToggleHandler = this.muteToggle.bind(this);
}

componentDidMount() {
  this.playHandler();
}
play() {
  this.timerID = setInterval(
    () => this.nextGridHandler(),
    500
  );
//   {playing:true}
}
// pause() {
//   clearInterval(this.timerID);
//   this.setState({playing:false});
// }
muteToggle() {
  this.setState({muted: !this.state.muted});
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
    this.newGridHandler(this.state.numberOfArows, input);
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
  this.newGridHandler(input, this.state.gridSize)
}
nextGrid() {
  this.setState({
    grid: nextGrid({...this.state.grid, muted: this.state.muted})
  })
}
newGrid(number, size) {
  this.setState({
    grid: newGrid(size, number)
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
    <button onClick={this.muteToggleHandler}>{this.state.muted ? 'Turn Sound On' : 'Turn Sound Off'}</button>
    <br/>
    <table align="center">
      <tbody>
        {renderGrid(this.state.grid)}
      </tbody>
    </table>
    <a href= 'http://earslap.com/page/otomata.html' id='image-credit'>Inspiration: Otomata by Earslap</a>
  </div>
)};
}
updateStyle();
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

