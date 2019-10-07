var UsrScr = require( "lib/UsrScr" );
//var sound = require( "lib/sound" );
var waste = require( "factory/waste" );
var flash = require( "object/flash" );

var state = require( "state" );
var message = require( "message" );

// the fixed elements
var background = require( "object/background" );
var fps = require( "object/fps" );

// the home page elements
var homeMask = require( "object/home-mask" );
var logo = require( "object/logo" );
var ninja = require( "object/ninja" )
var homeDesc = require( "object/home-desc" );

var startRecycling = require( "object/startRecycling" );
var newgame_save_world = require( "object/new-game_save_world" );
var quit = require( "object/quit" );
var newSign = require( "object/new" );
var peach, sandia, boom;

// the elements in game_save_world body
var score = require( "object/score" );
var lose = require( "object/lose" );

// the game_save_world logic
var game_save_world = require( "game_save_world" );

// the elements in 'UnderConstruction' module
var UnderConstruction = require( "object/UnderConstruction" );
var game_save_worldOver = require( "object/game_save_world-over" );

// commons
var message = require( "message" );
var timeline = require( "timeline" );
var setTimeout = timeline.setTimeout.bind( timeline );
var setInterval = timeline.setInterval.bind( timeline );

var menuSnd;
var game_save_worldStartSnd;

// initialize sense
exports.init = function(){
   // menuSnd = sound.create( "sound/menu" );
   // game_save_worldStartSnd = sound.create( "sound/start" );
	[ background, homeMask, logo, ninja, homeDesc, startRecycling, newSign, newgame_save_world, quit, score, lose, UnderConstruction, game_save_worldOver, flash /*, fps */ ].invoke( "set" );
    // setInterval( fps.update.bind( fps ), 500 );
};

// switch sense
exports.switchsense = function( name ){
    var cursense = state( "sense-name" );
    var senseState = state( "sense-state" );

    if( cursense.is( name ) )
        return ;

    var onHide = function(){
        cursense.set( name );
        senseState.set( "entering" );
        switch( name ){
            case "home-menu": this.showMenu( onShow ); break;
            case "startRecycling-body": this.showstartRecycling( onShow ); break;
            case "game_save_world-body": this.showNewgame_save_world( onShow ); break;
            case "quit-body": this.showQuit( onShow ); break;
        }
    }.bind( this );

    var onShow = function(){
        senseState.set( "ready" );

        if( name == "startRecycling-body" || name == "quit-body" ){
            exports.switchsense( "home-menu" );
        }
    };

    senseState.set( "exiting" );

    if( cursense.isunset() ) onHide();
    else if( cursense.is( "home-menu" ) ) this.hideMenu( onHide );
    else if( cursense.is( "startRecycling-body" ) ) this.hidestartRecycling( onHide );
    else if( cursense.is( "game_save_world-body" ) ) this.hideNewgame_save_world( onHide );
    else if( cursense.is( "quit-body" ) ) this.hideQuit( onHide );
};

// to enter home page menu
exports.showMenu = function( callback ){
    var callee = arguments.callee;
    var times = callee.times = ++ callee.times || 1;

    peach = waste.create( "peach", 137, 333, true );
    sandia = waste.create( "sandia", 330, 322, true );
    boom = waste.create( "boom", 552, 367, true, 2500 );

    [ peach, sandia, boom ].forEach(function( f ){ f.isHomeMenu = 1; });
    peach.isstartRecyclingIcon = sandia.isNewgame_save_worldIcon = boom.isQuitIcon = 1;

    var group = [
    	[ homeMask, 0 ], 
    	[ logo, 0 ], 

    	[ ninja, 500 ], 
    	[ homeDesc, 1500 ], 

    	[ startRecycling, 2000 ], 
    	[ newgame_save_world, 2000 ], 
    	[ quit, 2000 ],
        
        [ newSign, 2000 ],

        [ peach, 2000 ],
        [ sandia, 2000 ],
        [ boom, 2000 ]
    ];

    group.invoke( "show" );
    [ peach, sandia ].invoke( "rotate", 2500 );

   // menuSnd.play();
    setTimeout( callback, 2500 );
};

// to exit home page menu
exports.hideMenu = function( callback ){
    [ newSign, startRecycling, newgame_save_world, quit ].invoke( "hide" );
    [ homeMask, logo, ninja, homeDesc ].invoke( "hide" );
    [ peach, sandia, boom ].invoke( "fallOff", 150 );

    //menuSnd.stop();
    setTimeout( callback, waste.getDropTimeSetting() );
};

// to enter game_save_world body
exports.showNewgame_save_world = function( callback ){
    score.show();
    lose.show();
    game_save_world.start();
    
    game_save_worldStartSnd.play();
    setTimeout( callback, 1000 );
};

// to exit game_save_world body
exports.hideNewgame_save_world = function( callback ){
    score.hide();
    lose.hide();

    game_save_worldStartSnd.stop();
    setTimeout( callback, 1000 );
};

// to enter startRecycling mode
exports.showstartRecycling = function( callback ){
    UnderConstruction.show( 250 );
    setTimeout( callback, 1500 );
};

// to exit startRecycling mode
exports.hidestartRecycling = function( callback ){
    // TODO: 
    setTimeout( callback, 1000 );
};

// to enter quit page
exports.showQuit = function( callback ){
    UnderConstruction.show( 250 );
    setTimeout( callback, 1500 );
};

// to exit quit page
exports.hideQuit = function( callback ){
    // TODO: 
    setTimeout( callback, 1000 );
};

message.addEventListener("sense.switchsense", function( name ){
    exports.switchsense( name );
});