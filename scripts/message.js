var UsrScr = require( "lib/UsrScr" );

/**
 * send a message
 * @param  {Any} message,message...		message contents
 * @param  {String} to 					message address
 */
exports.postMessage = function( message/, to ){
	var messages = [].slice.call( arguments, 0 ),
		splitIndex = messages.length - 1;

	to = messages[ splitIndex ];
	messages.slice( 0, splitIndex );

	UsrScr.dispatch( to, messages );
};

/**
 * bind an message handler
 * @param {String}   from 	message address
 * @param {Function} fn 	message handler
 */
exports.addEventListener = function( from, fn ){
	UsrScr.dispatch( from, fn );
};

/**
 * remove an message handler
 * @param {String}   from 	message address
 * @param {Function} fn 	message handler
 */
exports.removeEventListener = function( from, fn ){
	UsrScr.dispatch.remove( from, fn );
};