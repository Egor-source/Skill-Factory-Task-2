import Slider from "./slider.js";

let slider = new Slider(document.querySelector('.js-slider'),{
    navigation:true,
    pagination:{
        bullet:true,
        tabs:[{
            text:'Rostov-on-Don, Admiral',
            classList:['tab-pagination','h4']
        },{
            text:'Sochi Thieves',
            classList:['tab-pagination','h4']
        },{
            text:'Rostov-on-Don Patriotic',
            classList:['tab-pagination','h4']
        }]
    }
});