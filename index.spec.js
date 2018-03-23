const bundle = require('./babel/main.bundle');

describe('feature: nextGrid', ()=>{

    it('', ()=>{
        console.log('3');

        bundle.nextGrid({rows:[
                [[],[]],
                [[],[]]
            ],
            arrows:[]
        });
        console.log(bundle.seedGrid())
    });
});