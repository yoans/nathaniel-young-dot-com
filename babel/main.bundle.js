'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Application = exports.nextGrid = exports.playSounds = exports.flipArrow = exports.rotateSet = exports.rotateArrow = exports.newArrayIfFalsey = exports.arrowBoundaryKey = exports.arrowKey = exports.moveArrow = exports.seedGrid = exports.newGrid = exports.getArrow = exports.getRows = exports.getRandomNumber = exports.cycleVector = exports.getVector = exports.vectorOperations = exports.vectors = undefined;

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

var _notesFrequencies = require('notes-frequencies');

var _notesFrequencies2 = _interopRequireDefault(_notesFrequencies);

var _os = require('os');

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
const seedGrid = exports.seedGrid = function () {
  return newGrid(getRandomNumber(20) + 12, getRandomNumber(50) + 1);
};
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
  };
}
const getIndex = function (x, y, size, vector) {
  if (vector === 1 || vector === 3) {
    return y;
  } else if (vector === 0 || vector === 2) {
    return x;
  }
  return 0;
};

const makeMIDImessage = function (index, length) {

  const midiKeyNumbers = [45, 47, 48, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74];
  const noteIndex = index % midiKeyNumbers.length;

  return {
    play: function () {
      (midiOut || { send: function () {} }).send([0x90, midiKeyNumbers[noteIndex], 0x40]);
      setTimeout(function () {
        const midcon = (midiOut || { send: function () {} }).send([0x80, midiKeyNumbers[noteIndex], 0x00]);
      }, length - 1);
    }
  };
};
const makePizzaSound = function (index, length) {

  // const frequencies = notesFrequencies('D3 F3 G#3 C4 D#4 G4 A#5');
  const frequencies = (0, _notesFrequencies2.default)('A3 B3 C3 D3 E3 F3 G3 A4 B4 C4 D4 E4 F4 G4 A5 B5 C5 D5 E5 F5 G5');
  const aSound = new _pizzicato2.default.Sound({
    source: 'wave',
    options: {
      frequency: frequencies[noteIndex][0],
      attack: 0.1,
      release: 0.1,
      type: 'triangle'
    }
  });
  var distortion = new _pizzicato2.default.Effects.Distortion({
    gain: 0.8
  });

  aSound.addEffect(distortion);

  var reverb = new _pizzicato2.default.Effects.Reverb({
    time: length / 2.0,
    decay: length / 2.0,
    reverse: true,
    mix: 0.7
  });

  aSound.addEffect(reverb);
  return {
    play: function () {
      aSound.play();
      setTimeout(function () {
        aSound.stop();
      }, length - 1);
    }
  };
};
const playSounds = exports.playSounds = function (boundaryArrows, size, length, muted) {
  boundaryArrows.map(function (arrow) {
    const speed = getIndex(arrow.x, arrow.y, size, arrow.vector);

    if (!muted) {
      const snd = makePizzaSound(speed, length);
      snd.play();
    }

    const midiMessage = makeMIDImessage(speed, length);
    midiMessage.play();
  });
};
const reduceArrowNumber = function (arrowSet) {
  return R.take(arrowSet.length % 4, arrowSet);
}; //This has the side effect of destroying arrows that don't have the same vector
const nextGrid = exports.nextGrid = function (grid, length) {
  const size = grid.size;
  const arrows = grid.arrows;

  const arrowSetDictionary = arrows.reduce(function (arrowDictionary, arrow) {
    arrowDictionary[arrowKey(arrow)] = [...newArrayIfFalsey(arrowDictionary[arrowKey(arrow)]), arrow];
    return arrowDictionary;
  }, {});

  const noisyArrowBoundaryDictionary = arrows.reduce(function (arrowDictionary, arrow) {
    arrowDictionary[arrowBoundaryKey(arrow, size)] = [...newArrayIfFalsey(arrowDictionary[arrowBoundaryKey(arrow, size)]), arrow];
    return arrowDictionary;
  }, {});
  playSounds(newArrayIfFalsey(noisyArrowBoundaryDictionary['boundary']), size, length, grid.muted);

  const arrowSets = Object.keys(arrowSetDictionary).map(function (key) {
    return arrowSetDictionary[key];
  });
  const rotatedArrows = arrowSets.map(reduceArrowNumber).map(rotateSet);
  const flatRotatedArrows = rotatedArrows.reduce(function (accum, current) {
    return [...accum, ...current];
  }, []);

  const arrowBoundaryDictionary = flatRotatedArrows.reduce(function (arrowDictionary, arrow) {
    arrowDictionary[arrowBoundaryKey(arrow, size)] = [...newArrayIfFalsey(arrowDictionary[arrowBoundaryKey(arrow, size)]), arrow];
    return arrowDictionary;
  }, {});
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

const maxArrows = 30;
const minArrows = 1;
const maxSize = 18;
const minSize = 2;
const minNoteLength = 50;
const maxNoteLength = 500;
class Application extends _react2.default.Component {

  constructor(props) {
    super(props);

    this.state = {
      gridSize: 8,
      noteLength: 150,
      numberOfArows: 8,
      grid: newGrid(8, 8),
      playing: true,
      muted: true
    };
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
    var _this = this;

    this.timerID = setInterval(function () {
      return _this.nextGridHandler(_this.state.noteLength);
    }, this.state.noteLength);
    this.setState({ playing: true });
  }
  pause() {
    clearInterval(this.timerID);
    this.setState({ playing: false });
  }
  muteToggle() {
    this.setState({ muted: !this.state.muted });
  }
  newSize(e) {
    let input = parseInt(e.target.value);
    if (isNaN(input)) {
      input = 8;
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
  newNoteLength(e) {
    clearInterval(this.timerID);
    let input = parseInt(e.target.value);
    if (isNaN(input)) {
      input = 150;
    } else if (input > maxNoteLength) {
      input = maxNoteLength;
    } else if (input < minNoteLength) {
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
  nextGrid(length) {
    this.setState({
      grid: nextGrid(_extends({}, this.state.grid, { muted: this.state.muted }), length)
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
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Sound:'
      ),
      _react2.default.createElement(
        'button',
        { className: 'arrow-input', onClick: this.muteToggleHandler },
        this.state.muted ? 'Turn Sound On' : 'Turn Sound Off'
      ),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Time per Step:'
      ),
      _react2.default.createElement('input', { className: 'arrow-input', type: 'number', max: maxNoteLength, min: minNoteLength, value: this.state.noteLength, onChange: this.newNoteLengthHandler }),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Number of Arrows:'
      ),
      _react2.default.createElement('input', { className: 'arrow-input', type: 'number', max: maxArrows, min: minArrows, value: this.state.numberOfArows, onChange: this.newNumberOfArrowsHandler }),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Size of Grid:'
      ),
      _react2.default.createElement('input', { className: 'arrow-input', type: 'number', max: maxSize, min: minSize, value: this.state.gridSize, onChange: this.newSizeHandler }),
      _react2.default.createElement(
        'label',
        { className: 'arrow-input-label' },
        'Start/Stop:'
      ),
      this.state.playing ? _react2.default.createElement(
        'button',
        { className: 'arrow-input', onClick: this.pauseHandler },
        'Stop'
      ) : _react2.default.createElement(
        'button',
        { className: 'arrow-input', onClick: this.playHandler },
        'Start'
      ),
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
        'label',
        { className: 'arrow-input-label' },
        'MIDI Output:'
      ),
      _react2.default.createElement(
        'select',
        { id: 'midiOut', className: 'arrow-input', onchange: 'changeMidiOut();' },
        _react2.default.createElement(
          'option',
          { value: '' },
          'Not connected'
        )
      ),
      _react2.default.createElement(
        'a',
        { href: 'http://www.tobias-erichsen.de/software/loopmidi.html', target: '_blank', className: 'image-credit aStyle' },
        'Click here to learn how to create a Virtual MIDI Device'
      ),
      _react2.default.createElement(
        'a',
        { href: 'http://earslap.com/page/otomata.html', className: 'image-credit aStyle' },
        'Inspiration: Otomata by Earslap'
      ),
      _react2.default.createElement(
        'a',
        { href: 'https://www.flickr.com/photos/aigle_dore', target: '_blank', className: 'image-credit aStyle' },
        'Image Credit: Moyan Brenn'
      ),
      _react2.default.createElement(
        'a',
        { href: 'http://www.tobias-erichsen.de', target: '_blank', className: 'image-credit aStyle' },
        'MIDI Wizard: Tobias Erichsen'
      )
    );
  }
}

exports.Application = Application;
function onMIDIFail(err) {
  alert("MIDI initialization failed.");
}

let selectMIDIOut = null;
let midiAccess = null;
let midiIn = null;
let midiOut = null;
let launchpadFound = false;

function changeMIDIOut(ev) {
  var selectedID = selectMIDIOut[selectMIDIOut.selectedIndex].value;

  for (var output of midiAccess.outputs.values()) {
    if (selectedID == output.id) {
      midiOut = output;
      return;
    }
  }
  midiOut = null;
}
function onMIDIInit(midi) {
  midiAccess = midi;
  selectMIDIOut = document.getElementById("midiOut");

  // clear the MIDI output select
  selectMIDIOut.options.length = 0;
  selectMIDIOut.add(new Option('Select Device', undefined, false, false));
  for (var output of midiAccess.outputs.values()) {
    selectMIDIOut.add(new Option(output.name, output.id, false, false));
  }
  selectMIDIOut.onchange = changeMIDIOut;
}

navigator.requestMIDIAccess({}).then(onMIDIInit, onMIDIFail);
_reactDom2.default.render(_react2.default.createElement(Application, null), document.getElementById('root'));
