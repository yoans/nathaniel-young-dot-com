'use strict';

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

const chance = new _chance2.default();
const vectors = ['arrow-up', 'arrow-left', 'arrow-down', 'arrow-right'];
const getVector = () => chance.natural({
  min: 0,
  max: 3
});

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

const nextGrid = grid => {};

const renderItem = item => {
  console.log(item);
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

_reactDom2.default.render(Application(newGrid(10, 60)), document.getElementById('root'));

console.log('Hello World');
