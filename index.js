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
    }
}
const getIndex = (x, y, size, vector) => {
    if(vector===1 ||vector===3){
        return y;
    }else if(vector===0 ||vector===2){
        return x
    }
    return 0;
}

const makeMIDImessage = (index, length) => {

  const midiKeyNumbers = [45, 47, 48, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74];
  const noteIndex = index%midiKeyNumbers.length;

  return {        
      play: function(){
          (midiOut||{send:()=>{}}).send(
            [
              0x90,
              midiKeyNumbers[noteIndex],
              0x40
            ]
          );
          setTimeout(()=>{
            const midcon = (midiOut||{send:()=>{}}).send(
              [
                0x80,
                midiKeyNumbers[noteIndex],
                0x00
              ]
            );
            
          }, length-1);
      }
  }
}
const makePizzaSound = (index, length) => {

    // const frequencies = notesFrequencies('D3 F3 G#3 C4 D#4 G4 A#5');
    const frequencies = notesFrequencies('A3 B3 C3 D3 E3 F3 G3 A4 B4 C4 D4 E4 F4 G4 A5 B5 C5 D5 E5 F5 G5');
    const aSound = new Pizzicato.Sound({ 
        source: 'wave', 
        options: {
            frequency: frequencies[noteIndex][0],
            attack: 0.1,
            release: 0.1,
            type:'triangle'
        }
    });
    var distortion = new Pizzicato.Effects.Distortion({
        gain: 0.8
    });
     
    aSound.addEffect(distortion);
    
    var reverb = new Pizzicato.Effects.Reverb({
        time: length/2.0,
        decay: length/2.0,
        reverse: true,
        mix: 0.7
    });
     
    aSound.addEffect(reverb);
    return {        
        play: function(){
            aSound.play();
            setTimeout(()=>{
              aSound.stop()
            }, length-1);
        }
    }
}
export const playSounds = (boundaryArrows, size, length, muted) => {
    boundaryArrows.map((arrow) => {
        const speed = getIndex(arrow.x, arrow.y, size, arrow.vector);

        if(!muted) {
          const snd = makePizzaSound(speed, length);
          snd.play();
        }
        
        const midiMessage = makeMIDImessage(speed, length);
        midiMessage.play();
    })
}
const reduceArrowNumber = (arrowSet)=>R.take(arrowSet.length%4, arrowSet);//This has the side effect of destroying arrows that don't have the same vector
export const nextGrid = (grid, length) => {
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

    const noisyArrowBoundaryDictionary = arrows.reduce(
        (arrowDictionary, arrow) => {
        arrowDictionary[arrowBoundaryKey(arrow, size)] = [
            ...(newArrayIfFalsey(arrowDictionary[arrowBoundaryKey(arrow, size)])),
            arrow
        ];
        return arrowDictionary;
        }
        ,{}
    );
    playSounds(newArrayIfFalsey(noisyArrowBoundaryDictionary['boundary']), size, length, grid.muted);

    const arrowSets = Object.keys(arrowSetDictionary).map(key => arrowSetDictionary[key]);
    const rotatedArrows = arrowSets.map(reduceArrowNumber).map(rotateSet);
    const flatRotatedArrows = rotatedArrows.reduce((accum, current)=>[...accum, ...current],[]);

    const arrowBoundaryDictionary = flatRotatedArrows.reduce(
        (arrowDictionary, arrow) => {
        arrowDictionary[arrowBoundaryKey(arrow, size)] = [
            ...(newArrayIfFalsey(arrowDictionary[arrowBoundaryKey(arrow, size)])),
            arrow
        ];
        return arrowDictionary;
        }
        ,{}
    );
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
const minNoteLength=50;
const maxNoteLength=500;
export class Application extends React.Component { 

constructor(props) {
  super(props);

  this.state = {
    gridSize: 8,
    noteLength: 150,
    numberOfArows: 8,
    grid: newGrid(8, 8),
    playing: true,
    muted: true
  }
  this.newSizeHandler = this.newSize.bind(this);
  this.newNoteLengthHandler = this.newNoteLength.bind(this);
  this.newNumberOfArrowsHandler = this.newNumberOfArrows.bind(this);
  this.nextGridHandler = this.nextGrid.bind(this);
  this.newGridHandler = this.newGrid.bind(this);
  this.playHandler = this.play.bind(this);
  this.pauseHandler = this.pause.bind(this);
  this.muteToggleHandler = this.muteToggle.bind(this);
}

componentDidMount() {
  this.playHandler();
}
play() {
  this.timerID = setInterval(
    () => this.nextGridHandler(this.state.noteLength),
    this.state.noteLength
  );
  this.setState({playing: true});
}
pause() {
  clearInterval(this.timerID);
  this.setState({playing:false});
}
muteToggle() {
  this.setState({muted: !this.state.muted});
}
newSize(e) {
  let input = parseInt(e.target.value);
  if (isNaN(input)) {
    input = 8;
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
newNoteLength(e) {
  clearInterval(this.timerID);
  let input = parseInt(e.target.value);
  if (isNaN(input)) {
    input = 150;
  }else if(input > maxNoteLength){
    input = maxNoteLength;
  }else if(input < minNoteLength){
    input = minNoteLength;
  }
  this.setState({
    noteLength: input
  });
    this.play();
}
newNumberOfArrows(e) {
  let input = parseInt(e.target.value);
  if (isNaN(input)) {
    input = 8;
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
nextGrid(length) {
  this.setState({
    grid: nextGrid({...this.state.grid, muted: this.state.muted}, length)
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
    <label className='arrow-input-label'>{'Sound:'}</label>
    <button className='arrow-input'  onClick={this.muteToggleHandler}>{this.state.muted ? 'Turn Sound On' : 'Turn Sound Off'}</button>
    <label className='arrow-input-label'>{'Time per Step:'}</label>
    <input className='arrow-input' type='number' max={maxNoteLength} min={minNoteLength} value={this.state.noteLength} onChange={this.newNoteLengthHandler}/>
    <label className='arrow-input-label'>{'Number of Arrows:'}</label>
    <input className='arrow-input' type='number' max={maxArrows} min={minArrows} value={this.state.numberOfArows} onChange={this.newNumberOfArrowsHandler}/>
    <label className='arrow-input-label'>{'Size of Grid:'}</label>
    <input className='arrow-input' type='number' max={maxSize} min={minSize} value={this.state.gridSize} onChange={this.newSizeHandler}/>
    <label className='arrow-input-label'>{'Start/Stop:'}</label>
    {
      this.state.playing ? 
        <button className='arrow-input' onClick={this.pauseHandler}>{'Stop'}</button> :
        <button className='arrow-input' onClick={this.playHandler}>{'Start'}</button>
    }
    

    <table align="center">
      <tbody>
        {renderGrid(this.state.grid)}
      </tbody>
      
    </table>
    
    <label className='arrow-input-label'>{'MIDI Output:'}</label>
		<select id='midiOut' className='arrow-input' onchange='changeMidiOut();'>
			<option value="">Not connected</option>
		</select>

    {/* <label className='arrow-input-label'>{'MIDI Output:'}</label>
    <div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Select Output
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
  </div>
</div> */}

    <a href="http://www.tobias-erichsen.de/software/loopmidi.html" target="_blank" className="image-credit aStyle">
        Click here to learn how to create a Virtual MIDI Device
    </a>
    <a href= 'http://earslap.com/page/otomata.html' className='image-credit aStyle'>
    Inspiration: Otomata by Earslap
    </a>
    <a href="https://www.flickr.com/photos/aigle_dore" target="_blank" className="image-credit aStyle">
        Image Credit: Moyan Brenn
    </a>
    <a href="http://www.tobias-erichsen.de" target="_blank" className="image-credit aStyle">
        MIDI Wizard: Tobias Erichsen
    </a>
    
  </div>
)};
}

function onMIDIFail( err ) {
	alert("MIDI initialization failed.");
}

let selectMIDIOut = null;
let midiAccess = null;
let midiIn = null;
let midiOut = null;
let launchpadFound = false;

function changeMIDIOut( ev ) {
  var selectedID = selectMIDIOut[selectMIDIOut.selectedIndex].value;

  for (var output of midiAccess.outputs.values()) {
    if (selectedID == output.id) {
      midiOut = output;
      return
  	}
  }
  midiOut = null;
}
function onMIDIInit( midi ) {
  midiAccess = midi;
  selectMIDIOut=document.getElementById("midiOut");

  // clear the MIDI output select
  selectMIDIOut.options.length = 0;
  selectMIDIOut.add(new Option('Select Device',undefined,false,false));
  for (var output of midiAccess.outputs.values()) {
    	selectMIDIOut.add(new Option(output.name,output.id,false,false));
  }
  selectMIDIOut.onchange = changeMIDIOut;

}


navigator.requestMIDIAccess({}).then( onMIDIInit, onMIDIFail );
ReactDOM.render(<Application/>, document.getElementById('root'));

