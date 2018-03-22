'use strict';

let demo = (() => {
  var _ref = _asyncToGenerator(function* () {
    let cyclingGrid = seedGrid();
    while (true) {
      cyclingGrid = seedGrid();
      yield sleep(1000);
      _reactDom2.default.render(Application(cyclingGrid), document.getElementById('root'));
    }
  });

  return function demo() {
    return _ref.apply(this, arguments);
  };
})();

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

const chance = new _chance2.default();
const vectors = ['arrow-up', 'arrow-left', 'arrow-down', 'arrow-right'];
const getVector = () => chance.natural({
  min: 0,
  max: 3
});
const cycleVector = vector => {
  return (vector + 1) % 4;
};

const getRandomNumber = size => chance.natural({
  min: 0,
  max: size - 1
});

const getGrid = size => ({
  rows: R.range(0, size).map(() => R.range(0, size))
});

const getArrow = size => () => ({
  x: getRandomNumber(size),
  y: getRandomNumber(size),
  vector: getVector()
});

const newGrid = (size, numberOfArrows) => {
  const arrows = R.range(0, numberOfArrows).map(getArrow(size));

  return Object.assign(getGrid(size), { arrows });
};

const seedGrid = () => newGrid(getRandomNumber(20) + 1, getRandomNumber(100) + 1);

const nextGrid = grid => {

  const size = grid.rows.length;
  const arrows = grid.arrows;
  arrows;
  return grid;
};

const renderItem = item => {
  if (item.length == 1) {
    return _react2.default.createElement(
      'td',
      null,
      _react2.default.createElement('div', { className: vectors[item[0].vector] })
    );
  } else if (item.length) {
    const classes = R.uniqBy(x => x.vector, item).map(({ vector }) => vectors[vector]).join(' ');
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

const renderRow = (row, index) => {
  return _react2.default.createElement(
    'tr',
    { key: index.toString() },
    row.map(renderItem)
  );
};
const renderGrid = grid => {

  const populateArrow = x => y => grid.arrows.filter(arrow => arrow.x === x && arrow.y === y);
  const populateRow = (row, index) => row.map(populateArrow(index));

  const populatedGrid = grid.rows.map(populateRow);
  return populatedGrid.map(renderRow);
};

const Application = grid => _react2.default.createElement(
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

demo();
