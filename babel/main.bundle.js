'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let demo = function () {
  var _ref2 = _asyncToGenerator(function* () {
    let cyclingGrid = seedGrid();
    while (true) {
      cyclingGrid = nextGrid(cyclingGrid);
      yield sleep(500);
      _reactDom2.default.render(Application(cyclingGrid), document.getElementById('root'));
    }
  });

  return function demo() {
    return _ref2.apply(this, arguments);
  };
}();

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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const chance = new _chance2.default();
const vectors = ['arrow-up', 'arrow-right', 'arrow-down', 'arrow-left'];
const vectorOperations = [function ({ x, y, vector }) {
  return { x, y: y - 1, vector };
}, function ({ x, y, vector }) {
  return { x: x + 1, y, vector };
}, function ({ x, y, vector }) {
  return { x, y: y + 1, vector };
}, function ({ x, y, vector }) {
  return { x: x - 1, y, vector };
}];
const getVector = function () {
  return chance.natural({
    min: 0,
    max: 3
  });
};
const cycleVector = function (vector, number) {
  return (vector + number - 1) % 4;
};
const getRandomNumber = function (size) {
  return chance.natural({
    min: 0,
    max: size - 1
  });
};
const getGrid = function (size) {
  return {
    rows: R.range(0, size).map(function () {
      return R.range(0, size);
    })
  };
};
const getArrow = function (size) {
  return function () {
    return {
      x: getRandomNumber(size),
      y: getRandomNumber(size),
      vector: getVector()
    };
  };
};
const newGrid = function (size, numberOfArrows) {
  const arrows = R.range(0, numberOfArrows).map(getArrow(size));

  return Object.assign(getGrid(size), { arrows });
};
const seedGrid = function () {
  return newGrid(getRandomNumber(20) + 1, getRandomNumber(100) + 1);
};
const moveArrow = function (arrow) {
  return vectorOperations[arrow.vector](arrow);
};
const arrowKey = function (arrow) {
  return '{x:' + arrow.x + ',y:' + arrow.y + '}';
};
const arrowBoundaryKey = function (arrow, size) {
  if (arrow.y === 0 && arrow.vector === 0) {
    return 'v0';
  }
  if (arrow.x === size && arrow.vector === 1) {
    return 'v1';
  }
  if (arrow.y === size && arrow.vector === 2) {
    return 'v2';
  }
  if (arrow.x === 0 && arrow.vector === 3) {
    return 'v3';
  }
  return 'no-boundary';
};
const newArrayIfFalsey = function (thingToCheck) {
  return thingToCheck ? thingToCheck : [];
};
const rotateArrow = function (number) {
  return function (arrow) {
    return _extends({}, arrow, {
      vector: cycleVector(arrow.vector, number)
    });
  };
};
const rotateSet = function (set) {
  return set.map(rotateArrow(set.length));
};
const flipArrow = function (_ref) {
  let { vector } = _ref,
      rest = _objectWithoutProperties(_ref, ['vector']);

  return _extends({ vector: (vector + 2) % 4 }, rest);
};
const nextGrid = function (grid) {
  const size = grid.rows.length;
  const arrows = grid.arrows;
  const newGrid = {
    rows: getGrid(size).rows,
    arrows: []
  };

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

  const movedBoundaryArrows = vectorOperations.map(function (operation, key) {
    const index = 'v' + key;
    return newArrayIfFalsey(arrowBoundaryDictionary[index]).map(flipArrow).map(operation);
  }).reduce(function (arr1, arr2) {
    return [...arr1, ...arr2];
  }, []);
  newGrid.arrows = [...movedArrowsInMiddle, ...movedBoundaryArrows];
  return newGrid;
};

const renderItem = function (item) {
  if (item.length) {
    const classes = R.uniqBy(function (x) {
      return x.vector;
    }, item).map(function ({ vector }) {
      return vectors[vector];
    }).join(' ');

    return _react2.default.createElement(
      'td',
      null,
      _react2.default.createElement('div', { className: classes })
    );
  }
  return _react2.default.createElement(
    'td',
    null,
    _react2.default.createElement('div', { className: 'empty-space' })
  );
};

const renderRow = function (row, index) {
  return _react2.default.createElement(
    'tr',
    { key: index.toString() },
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

  const populatedGrid = grid.rows.map(populateRow);
  return populatedGrid.map(renderRow);
};

const Application = function (grid) {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'h1',
      null,
      'Arrows'
    ),
    _react2.default.createElement('br', null),
    _react2.default.createElement('br', null),
    _react2.default.createElement(
      'table',
      null,
      _react2.default.createElement(
        'tbody',
        null,
        renderGrid(grid)
      )
    )
  );
};

function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

demo();
