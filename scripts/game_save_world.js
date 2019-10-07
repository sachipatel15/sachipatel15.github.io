/**
 * game_save_world logic
 */
var timeline = require( "timeline" );
var UsrScr = require( "lib/UsrScr" );
//var sound = require( "lib/sound" );
var waste = require( "factory/waste" );
var score = require( "object/score" );
var message = require( "message" );
var state = require( "state" );
var lose = require( "object/lose" );
var game_save_worldOver = require( "object/game_save_world-over" );
var knife = require( "object/knife" );
// var sense = require( "sense" );
var background = require( "object/background" );
var light = require( "object/light" );

var scoreNumber = 0;

var random = UsrScr.randomNumber;

var volleyNum = 2, volleyMultipleNumber = 5;
var wastes = [];
var game_save_worldInterval;

var snd;
var boomSnd;

// waste barbette
var barbette = function(){
    if( wastes.length >= volleyNum )
        return ;

    var startX = random( 640 ), endX = random( 640 ), startY = 600;
    var f = waste.create( startX, startY ).shotOut( 0, endX );

    wastes.push( f );
   // snd.play();

    barbette();
};

// start game_save_world
exports.start = function(){
   // snd = sound.create( "sound/throw" );
    //boomSnd = sound.create( "sound/boom" );
    timeline.setTimeout(function(){
        state( "game_save_world-state" ).set( "playing" );
        game_save_worldInterval = timeline.setInterval( barbette, 1e3 );
    }, 500);
};

exports.game_save_worldOver = function(){
    state( "game_save_world-state" ).set( "over" );
    game_save_worldInterval.stop();

    game_save_worldOver.show();


    scoreNumber = 0;
    volleyNum = 2;
    wastes.length = 0;
};

exports.applyScore = function( score ){
    if( score > volleyNum * volleyMultipleNumber )
        volleyNum ++,
        volleyMultipleNumber += 50;
};

exports.sliceAt = function( waste, angle ){
    var index;

    if( state( "game_save_world-state" ).isnot( "playing" ) )
        return;

    if( waste.type != "boom" ){
        waste.broken( angle );
        if( index = wastes.indexOf( waste ) )
            wastes.splice( index, 1 );
        score.number( ++ scoreNumber );
        this.applyScore( scoreNumber );
    }else{
       // boomSnd.play();
        this.pauseAllwaste();
        background.wobble();
        light.start( waste );
    }
};

exports.pauseAllwaste = function(){
    game_save_worldInterval.stop();
    knife.pause();
    wastes.invoke( "pause" );
};


message.addEventListener("waste.remove", function( waste ){
    var index;
    if( ( index = wastes.indexOf( waste ) ) > -1 )
        wastes.splice( index, 1 );
});

var eventwasteFallOutOfViewer = function( waste ){
    if( waste.type != "boom" )
        lose.showLoseAt( waste.originX );
};

state( "game_save_world-state" ).hook( function( value ){
    if( value == "playing" )
        message.addEventListener( "waste.fallOutOfViewer", eventwasteFallOutOfViewer );
    else
        message.removeEventListener( "waste.fallOutOfViewer", eventwasteFallOutOfViewer );
} );

message.addEventListener("game_save_world.over", function(){
    exports.game_save_worldOver();
    knife.switchOn();
});

message.addEventListener("overWhiteLight.show", function(){
    knife.endAll();
    for(var i = wastes.length - 1; i >= 0; i --)
        wastes[i].remove();
    background.stop();
});

message.addEventListener("click", function(){
    state( "click-enable" ).off();
    game_save_worldOver.hide();
    message.postMessage( "home-menu", "sense.switchsense" );
});