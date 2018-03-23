const bundle = require('./babel/main.bundle');
const chai = require('./node_modules/chai');

const getUpArrow = (x,y) => ({x,y, vector: 0});
const getRightArrow = (x,y) => ({x,y, vector: 1});
const getDownArrow = (x,y) => ({x,y, vector: 2});
const getLeftArrow = (x,y) => ({x,y, vector: 3});
const getLocation = (x,y) => ({x,y});

describe('feature: nextGrid', ()=>{
//cycle => ^ > < V
//increasing x => right
//increasing y => down
    it('happy normal', ()=>{

        const result = bundle.nextGrid({
            size: 2,
            arrows: [getUpArrow(0,0)]
        });
        console.log(result);
        chai.expect(result).to.deep.equal(
            {
                size: 2,
                arrows: [getDownArrow(0,1)]
            }
        );
    });

    it('cycle vector', ()=>{
        //happy
        let result = bundle.cycleVector(0, 1);
        chai.expect(result).to.equal(0);
        result = bundle.cycleVector(1, 1);
        chai.expect(result).to.equal(1);
        result = bundle.cycleVector(2, 1);
        chai.expect(result).to.equal(2);
        result = bundle.cycleVector(3, 1);
        chai.expect(result).to.equal(3);

        result = bundle.cycleVector(4, 1);
        chai.expect(result).to.equal(0);
        result = bundle.cycleVector(5, 1);
        chai.expect(result).to.equal(1);

        result = bundle.cycleVector(4, 2);
        chai.expect(result).to.equal(1);
        result = bundle.cycleVector(4, 5);
        chai.expect(result).to.equal(0)


    })
});