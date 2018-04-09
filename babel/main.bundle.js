'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextGrid = exports.flipArrow = exports.rotateSet = exports.rotateArrow = exports.newArrayIfFalsey = exports.arrowBoundaryKey = exports.arrowKey = exports.moveArrow = exports.newGrid = exports.getArrow = exports.getRows = exports.getRandomNumber = exports.cycleVector = exports.getVector = exports.vectorOperations = exports.vectors = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
const _newGrid = function (size, numberOfArrows) {
  const arrows = R.range(0, numberOfArrows).map(getArrow(size));

  return { size, arrows };
};
// export const seedGrid = () => newGrid(getRandomNumber(20)+12, getRandomNumber(50)+1);
exports.newGrid = _newGrid;
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
const _nextGrid = function (grid) {
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

exports.nextGrid = _nextGrid;
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

const maxArrows = 200;
const minArrows = 1;
const maxSize = 50;
const minSize = 2;
const maxArrowLength = 25;
const minArrowLength = 2;

let Application = function (_React$Component) {
  _inherits(Application, _React$Component);

  function Application(props) {
    _classCallCheck(this, Application);

    var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this, props));

    _this.state = {
      gridSize: 10,
      numberOfArrows: 10,
      grid: _newGrid(10, 10),
      playing: true,
      arrowLength: 5
    };
    _this.newSizeHandler = _this.newSize.bind(_this);
    _this.newNumberOfArrowsHandler = _this.newNumberOfArrows.bind(_this);
    _this.newArrowLengthHandler = _this.newArrowLength.bind(_this);
    _this.nextGridHandler = _this.nextGrid.bind(_this);
    _this.newGridHandler = _this.newGrid.bind(_this);
    _this.playHandler = _this.play.bind(_this);
    _this.getStylesHandler = _this.getStyles.bind(_this);
    return _this;
  }

  _createClass(Application, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.playHandler();
    }
  }, {
    key: 'play',
    value: function play() {
      var _this2 = this;

      this.timerID = setInterval(function () {
        return _this2.nextGridHandler();
      }, 500);
      {
        playing: true;
      }
    }
  }, {
    key: 'newSize',
    value: function newSize(e) {
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
      this.newGridHandler(this.state.numberOfArrows, input, this.state.arrowLength);
    }
  }, {
    key: 'newArrowLength',
    value: function newArrowLength(e) {
      let input = parseInt(e.target.value);
      if (isNaN(input)) {
        input = 10;
      } else if (input > maxArrowLength) {
        input = maxArrowLength;
      } else if (input < minArrowLength) {
        input = minArrowLength;
      }
      this.setState({
        arrowLength: input
      });
      this.newGridHandler(this.state.numberOfArrows, this.state.gridSize, input);
    }
  }, {
    key: 'newNumberOfArrows',
    value: function newNumberOfArrows(e) {
      let input = parseInt(e.target.value);
      if (isNaN(input)) {
        input = 10;
      } else if (input > maxArrows) {
        input = maxArrows;
      } else if (input < minArrows) {
        input = minArrows;
      }
      this.setState({
        numberOfArrows: input
      });
      this.newGridHandler(input, this.state.gridSize, this.state.arrowLength);
    }
  }, {
    key: 'nextGrid',
    value: function nextGrid() {
      this.setState({
        grid: _nextGrid(this.state.grid)
      });
    }
  }, {
    key: 'newGrid',
    value: function newGrid(number, size, arrowLength) {
      this.setState({
        grid: _newGrid(size, number)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      const styles = this.getStylesHandler();
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('br', null),
        _react2.default.createElement('input', { type: 'number', max: maxArrowLength, min: minArrowLength, value: this.state.arrowLength, onChange: this.newArrowLengthHandler }),
        _react2.default.createElement('br', null),
        _react2.default.createElement('input', { type: 'number', max: maxArrows, min: minArrows, value: this.state.numberOfArrows, onChange: this.newNumberOfArrowsHandler }),
        _react2.default.createElement('br', null),
        _react2.default.createElement('input', { type: 'number', max: maxSize, min: minSize, value: this.state.gridSize, onChange: this.newSizeHandler }),
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
          { href: 'http://earslap.com/page/otomata.html' },
          'Inspiration: Otomata by Earslap'
        )
      );
    }
  }]);

  return Application;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(Application, null), document.getElementById('root'));
