"use strict";
define([], function () {

window.die = function(string) {
	alert(string);
	throw string;
}

window.def = function(input) {
	return typeof input !== "undefined";
}


}) // end of define

