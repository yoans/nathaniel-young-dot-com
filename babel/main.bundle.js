'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Application = exports.nextGrid = exports.playSounds = exports.flipArrow = exports.rotateSet = exports.rotateArrow = exports.newArrayIfFalsey = exports.arrowBoundaryKey = exports.arrowKey = exports.moveArrow = exports.newGrid = exports.getArrow = exports.getRows = exports.getRandomNumber = exports.cycleVector = exports.getVector = exports.vectorOperations = exports.vectors = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _pizzicato = require('pizzicato');

var _pizzicato2 = _interopRequireDefault(_pizzicato);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const chance = new _chance2.default();
const vectors = exports.vectors = ['arrow-up', 'arrow-right', 'arrow-down', 'arrow-left'];
const vectorOperations = exports.vectorOperations = [function ({ x, y, vector }) {
  return { x, y: y - 1, vector };
}, function ({ x, y, vector }) {
  return { x: x + 1, y, vector };
}, function ({ x, y, vector }) {
  return { x, y: y + 1, vector };
}, function ({ x, y, vector }) {
  return { x: x - 1, y, vector };
}];
const getVector = exports.getVector = function () {
  return chance.natural({
    min: 0,
    max: 3
  });
};
const cycleVector = exports.cycleVector = function (vector, number) {
  return (vector + number - 1) % 4;
};
const getRandomNumber = exports.getRandomNumber = function (size) {
  return chance.natural({
    min: 0,
    max: size - 1
  });
};
const getRows = exports.getRows = function (size) {
  return R.range(0, size).map(function () {
    return R.range(0, size);
  });
};
const getArrow = exports.getArrow = function (size) {
  return function () {
    return {
      x: getRandomNumber(size),
      y: getRandomNumber(size),
      vector: getVector()
    };
  };
};
const newGrid = exports.newGrid = function (size, numberOfArrows) {
  const arrows = R.range(0, numberOfArrows).map(getArrow(size));

  return { size, arrows, muted: true };
};
// export const seedGrid = () => newGrid(getRandomNumber(20)+12, getRandomNumber(50)+1);
const moveArrow = exports.moveArrow = function (arrow) {
  return vectorOperations[arrow.vector](arrow);
};
const arrowKey = exports.arrowKey = function (arrow) {
  return '{x:' + arrow.x + ',y:' + arrow.y + '}';
};
const arrowBoundaryKey = exports.arrowBoundaryKey = function (arrow, size) {
  if (arrow.y === 0 && arrow.vector === 0) {
    return 'boundary';
  }
  if (arrow.x === size - 1 && arrow.vector === 1) {
    return 'boundary';
  }
  if (arrow.y === size - 1 && arrow.vector === 2) {
    return 'boundary';
  }
  if (arrow.x === 0 && arrow.vector === 3) {
    return 'boundary';
  }
  return 'no-boundary';
};
const newArrayIfFalsey = exports.newArrayIfFalsey = function (thingToCheck) {
  return thingToCheck ? thingToCheck : [];
};
const rotateArrow = exports.rotateArrow = function (number) {
  return function (arrow) {
    return _extends({}, arrow, {
      vector: cycleVector(arrow.vector, number)
    });
  };
};
const rotateSet = exports.rotateSet = function (set) {
  return set.map(rotateArrow(set.length));
};
const flipArrow = function (_ref) {
  let { vector } = _ref,
      rest = _objectWithoutProperties(_ref, ['vector']);

  return _extends({ vector: (vector + 2) % 4 }, rest);
};

exports.flipArrow = flipArrow;
function sound(src, speed) {
  const aSound = document.createElement("audio");
  aSound.src = src;
  aSound.setAttribute("preload", "auto");
  aSound.setAttribute("controls", "none");
  aSound.style.display = "none";
  aSound.setAttribute("playbackRate", speed);
  document.body.appendChild(aSound);
  return {
    play: function () {
      aSound.play();
      setTimeout(function () {
        return document.body.removeChild(aSound);
      }, 500);
    }
    // ,
    // Ele: aSound

    // this.stop = function(){
    // aSound.pause();
    // }
  };
}
const getSpeed = function (x, y, size) {
  if (x === size - 1 || x === 0) {
    return parseFloat(y) * 2.0 / parseFloat(size) + 0.5;
  } else if (y === size - 1 || x === 0) {
    return parseFloat(x) * 2.0 / parseFloat(size) + 0.5;
  }
  return 1.0;
};
const makePizzaSound = function (speed) {
  const aSound = new _pizzicato2.default.Sound({
    source: 'wave',
    options: {
      frequency: 440.0 * speed
    }
  });
  return {
    play: function () {
      aSound.play();
      setTimeout(function () {
        return aSound.stop();
      }, 500);
    }
  };
};
const playSounds = exports.playSounds = function (boundaryArrows, size) {
  boundaryArrows.map(function (arrow) {
    const speed = getSpeed(arrow.x, arrow.y, size);
    // console.log(speed);
    // const snd = sound("testSound.wav", speed);
    const snd = makePizzaSound(speed);
    snd.play();
  });
};
const nextGrid = exports.nextGrid = function (grid) {
  const size = grid.size;
  const arrows = grid.arrows;

  const arrowSetDictionary = arrows.reduce(function (arrowDictionary, arrow) {
    arrowDictionary[arrowKey(arrow)] = [...newArrayIfFalsey(arrowDictionary[arrowKey(arrow)]), arrow];
    return arrowDictionary;
  }, {});

  const arrowSets = Object.keys(arrowSetDictionary).map(function (key) {
    return arrowSetDictionary[key];
  });
  const rotatedArrows = arrowSets.map(rotateSet);
  const flatRotatedArrows = rotatedArrows.reduce(function (accum, current) {
    return [...accum, ...current];
  }, []);

  const arrowBoundaryDictionary = flatRotatedArrows.reduce(function (arrowDictionary, arrow) {
    arrowDictionary[arrowBoundaryKey(arrow, size)] = [...newArrayIfFalsey(arrowDictionary[arrowBoundaryKey(arrow, size)]), arrow];
    return arrowDictionary;
  }, {});
  if (!grid.muted) {
    playSounds(newArrayIfFalsey(arrowBoundaryDictionary['boundary']), size);
  }
  const movedArrowsInMiddle = newArrayIfFalsey(arrowBoundaryDictionary['no-boundary']).map(moveArrow);
  const movedFlippedBoundaryArrows = newArrayIfFalsey(arrowBoundaryDictionary['boundary']).map(flipArrow).map(moveArrow);

  return _extends({}, grid, {
    size,
    arrows: [...movedArrowsInMiddle, ...movedFlippedBoundaryArrows]
  });
};

const renderItem = function (item) {
  if (item.length) {
    const classes = R.uniqBy(function (x) {
      return x.vector;
    }, item).map(function ({ vector }) {
      return vectors[vector];
    });

    return _react2.default.createElement(
      'td',
      null,
      _react2.default.createElement(
        'div',
        { className: 'space' },
        classes.map(function (divClass) {
          return _react2.default.createElement('div', { className: divClass });
        })
      )
    );
  }
  return _react2.default.createElement(
    'td',
    null,
    _react2.default.createElement('div', { className: 'space' })
  );
};

const updateStyle = function () {
  const style = document.createElement('style');
  style.type = 'text/css';
  const keyFrames = '' + '@keyframes go-up {' + '    0%   {left:0px; top:DYNAMICpx;}' + '    100% {left:0px; top:0px;}' + '}' + '@keyframes go-right {' + '    0%   {left:-DYNAMICpx; top:0px;}' + '    100% {left:0px; top:0px;}' + '}' + '@keyframes go-down {' + '    0%   {left:0px; top:-DYNAMICpx;}' + '    100% {left:0px; top:0px;}' + '}' + '@keyframes go-left {' + '    0%   {left:DYNAMICpx; top:0px;}' + '    100% {left:0px; top:0px;}' + '';
  style.innerHTML = keyFrames.replace(/DYNAMIC/g, "19");
  document.getElementsByTagName('head')[0].appendChild(style);
};

const renderRow = function (row) {
  return _react2.default.createElement(
    'tr',
    { key: chance.guid() },
    row.map(renderItem)
  );
};
const renderGrid = function (grid) {

  const populateArrow = function (y) {
    return function (x) {
      return grid.arrows.filter(function (arrow) {
        return arrow.x === x && arrow.y === y;
      });
    };
  };
  const populateRow = function (row, index) {
    return row.map(populateArrow(index));
  };

  const populatedGrid = getRows(grid.size).map(populateRow);
  return populatedGrid.map(renderRow);
};
const maxArrows = 200;
const minArrows = 1;
const maxSize = 50;
const minSize = 2;
class Application extends _react2.default.Component {

  constructor(props) {
    super(props);

    this.state = {
      gridSize: 10,
      numberOfArows: 10,
      grid: newGrid(10, 10),
      playing: true,
      muted: true
    };
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
    var _this = this;

    this.timerID = setInterval(function () {
      return _this.nextGridHandler();
    }, 500);
    //   {playing:true}
  }
  // pause() {
  //   clearInterval(this.timerID);
  //   this.setState({playing:false});
  // }
  muteToggle() {
    this.setState({ muted: !this.state.muted });
  }
  newSize(e) {
    let input = parseInt(e.target.value);
    if (isNaN(input)) {
      input = 10;
    } else if (input > maxSize) {
      input = maxArrows;
    } else if (input < minSize) {
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
    } else if (input > maxArrows) {
      input = maxArrows;
    } else if (input < minArrows) {
      input = minArrows;
    }
    this.setState({
      numberOfArows: input
    });
    this.newGridHandler(input, this.state.gridSize);
  }
  nextGrid() {
    this.setState({
      grid: nextGrid(_extends({}, this.state.grid, { muted: this.state.muted }))
    });
  }
  newGrid(number, size) {
    this.setState({
      grid: newGrid(size, number)
    });
  }
  render() {

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('br', null),
      _react2.default.createElement('input', { type: 'number', max: maxArrows, min: minArrows, value: this.state.numberOfArows, onChange: this.newNumberOfArrowsHandler }),
      _react2.default.createElement('br', null),
      _react2.default.createElement('input', { type: 'number', max: maxSize, min: minSize, value: this.state.gridSize, onChange: this.newSizeHandler }),
      _react2.default.createElement('br', null),
      _react2.default.createElement(
        'button',
        { onClick: this.muteToggleHandler },
        this.state.muted ? 'Turn Sound On' : 'Turn Sound Off'
      ),
      _react2.default.createElement('br', null),
      _react2.default.createElement(
        'table',
        { align: 'center' },
        _react2.default.createElement(
          'tbody',
          null,
          renderGrid(this.state.grid)
        )
      ),
      _react2.default.createElement(
        'a',
        { href: 'http://earslap.com/page/otomata.html', id: 'image-credit' },
        'Inspiration: Otomata by Earslap'
      )
    );
  }
}
exports.Application = Application;
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
_reactDom2.default.render(_react2.default.createElement(Application, null), document.getElementById('root'));
