import $ from 'jquery';
import FlippingMeteo from './flippingMeteo';


$(document).ready(()=>{
    var flippingMeteoWidget = new FlippingMeteo($('[data-module="flipping-meteo"]'));
    flippingMeteoWidget.init();
});