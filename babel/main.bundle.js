'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Application = exports.nextGrid = exports.flipArrow = exports.rotateSet = exports.rotateArrow = exports.newArrayIfFalsey = exports.arrowBoundaryKey = exports.arrowKey = exports.moveArrow = exports.seedGrid = exports.newGrid = exports.getArrow = exports.getRows = exports.getRandomNumber = exports.cycleVector = exports.getVector = exports.vectorOperations = exports.vectors = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

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

  return { size, arrows };
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

  const movedArrowsInMiddle = newArrayIfFalsey(arrowBoundaryDictionary['no-boundary']).map(moveArrow);
  const movedFlippedBoundaryArrows = newArrayIfFalsey(arrowBoundaryDictionary['boundary']).map(flipArrow).map(moveArrow);

  return {
    size,
    arrows: [...movedArrowsInMiddle, ...movedFlippedBoundaryArrows]
  };
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
// const onChangeSize = (event) => 

class Application extends _react2.default.Component {

  constructor(props) {
    super(props);

    this.state = {
      gridSize: 10,
      numberOfArows: 10,
      grid: newGrid(10, 10),
      playing: true
    };
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
    var _this = this;

    this.timerID = setInterval(function () {
      return _this.nextGridHandler();
    }, 500);
    {
      playing: true;
    }
  }
  pause() {
    clearInterval(this.timerID);
    this.setState({ playing: false });
  }
  newSize(e) {
    this.setState({
      gridSize: parseInt(e.target.value)
    });
  }
  newNumberOfArrows(e) {
    this.setState({
      numberOfArows: parseInt(e.target.value)
    });
  }
  nextGrid() {
    this.setState({
      grid: nextGrid(this.state.grid)
    });
  }
  newGrid() {
    this.setState({
      grid: newGrid(this.state.gridSize, this.state.numberOfArows)
    });
  }
  render() {

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'h1',
        null,
        'Arrows'
      ),
      _react2.default.createElement('br', null),
      _react2.default.createElement(
        'p',
        null,
        'Size:'
      ),
      _react2.default.createElement('input', { type: 'number', onChange: this.newSizeHandler }),
      _react2.default.createElement('br', null),
      _react2.default.createElement(
        'p',
        null,
        'Number:'
      ),
      _react2.default.createElement('input', { type: 'number', onChange: this.newNumberOfArrowsHandler }),
      _react2.default.createElement('br', null),
      _react2.default.createElement(
        'button',
        { onClick: this.newGridHandler },
        'Reset'
      ),
      _react2.default.createElement(
        'button',
        { onClick: this.nextGridHandler },
        'Next'
      ),
      _react2.default.createElement(
        'button',
        { disabled: this.state.playing, onClick: this.playHandler },
        'Play'
      ),
      _react2.default.createElement(
        'button',
        { onClick: this.pauseHandler },
        'Pause'
      ),
      _react2.default.createElement('br', null),
      _react2.default.createElement(
        'table',
        null,
        _react2.default.createElement(
          'tbody',
          null,
          renderGrid(this.state.grid)
        )
      )
    );
  }
}
exports.Application = Application; // function sleep(ms) {
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

_reactDom2.default.render(_react2.default.createElement(Application, null), document.getElementById('root'));
