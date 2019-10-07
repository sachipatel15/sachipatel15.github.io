
var Raphael = require( "lib/raphael" );
var UsrScr = require( "lib/UsrScr" );

var layers = {};
var zindexs = {
	"default": zi(),
	"light": zi(),
	"knife": zi(),
	"waste": zi(),
	"garbage": zi(),
	"flash": zi(),
	"mask": zi()
};

exports.createImage = function( layer, src, x, y, w, h ){
	layer = this.getLayer( layer );
    return layer.image( src, x, y, w, h );
};

exports.createText = function( layer, text, x, y, fill, size ){
	layer = this.getLayer( layer );

	if( UsrScr.isIe )
		y += 2;

	return layer.text(x, y, text).attr({
		fill: fill || "#fff",
		"font-size": size || "14px",
		"text-anchor": "start"
	});
};

exports.getLayer = function( name ){
	var p, layer;
	name = name || "default";
	
	if( p = layers[name] ){
	    return p;
	}else{
		layer = UsrScr.makeElement( "div", { "class": "layer", "style": "z-index: " + ( zindexs[name] || 0 ) + ";" } );
		UsrScr.Element( "extra" ).add( layer );
		p = layers[name] = Raphael( layer, 640, 480 );
		return p;
	}
};

function zi(){
    return zi.num = ++ zi.num || 2;
}