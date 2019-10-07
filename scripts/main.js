var timeline = require( "timeline" );
var tools = require( "tools" );
var sense = require( "sense" );
var UsrScr = require( "lib/UsrScr" );
//var buzz = require( "lib/buzz" );
var control = require( "control" );
var csl = require( "object/console" );
var message = require( "message" );
var state = require( "state" );

var game_save_world = require( "game_save_world" );

var hit = require( "hit" );

var setTimeout = timeline.setTimeout.bind( timeline );

var log = function(){
    var time = 1e3, add = 300, fn;
    fn = function( text ){
        setTimeout( function(){ csl.log( text ); }, time );
        time += add;
    };
    fn.clear = function(){
        setTimeout( csl.clear.bind( csl ), time );
        time += add;
    };
    return fn;
}();

exports.start = function(){

    [ timeline, sense, control ].invoke( "init" );


    setTimeout( sense.switchsense.saturate( sense, "home-menu" ), 10 );
};

message.addEventListener("slice", function( knife ){
    var wastes = hit.check( knife ), angle;
    if( wastes.length )
        angle = tools.getAngleByRadian( tools.pointToRadian( knife.slice(0, 2), knife.slice(2, 4) ) ),
        wastes.forEach(function( waste ){
           message.postMessage( waste, angle, "slice.at" );
        });
});

message.addEventListener("slice.at", function( waste, angle ){

    if( state( "sense-state" ).isnot( "ready" ) )
        return ;

    if( state( "sense-name" ).is( "game_save_world-body" ) ){
        game_save_world.sliceAt( waste, angle );
        return ;
    }

    if( state( "sense-name" ).is( "home-menu" ) ){
        waste.broken( angle );
        if( waste.isHomeMenu )
            switch( 1 ){
                case waste.isstartRecyclingIcon:
                    sense.switchsense( "startRecycling-body" ); break;
                case waste.isNewgame_save_worldIcon:
                    sense.switchsense( "game_save_world-body" ); break;
                case waste.isQuitIcon:
                    sense.switchsense( "quit-body" ); break;
            }
        return ;
    }
});

var tip = "";

if( !UsrScr.isChrome )
    tip = "$for best experience, use <span class='b'>Google Chrome</span> ";

//if( !buzz.isSupported() )
  //  tip = tip.replace( "$", "audio is not supported" );

tip = tip.replace( "$", "" );

UsrScr.Element( "browser" ).html( tip );