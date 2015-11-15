// alert('begin main')
require.config({
	baseUrl: 'scripts',
	paths: {
		'esprima': 'https://cdn.rawgit.com/jquery/esprima/1.2/esprima',
		'jquery': 'http://code.jquery.com/jquery-1.11.2.min',
		'codemirror': 'codemirror-4.12',
	},
})
// alert('after config')

require( [
	'jquery',
	'codemirror/lib/codemirror', 'codemirror/mode/javascript/javascript', 'codemirror/addon/edit/matchbrackets', 'codemirror/addon/comment/comment',
	'esprima',
	'profile',
	'feedback',
	'browser-detect'
], function(
	$,
	CodeMirror, undefined, undefined, undefined,
	esprima,
	undefined,
	feedback,
	browser
){
//////////////////////////////// HELPERS /////////////////////////////////
function select($sel,$desel1,$desel2,$desel3){
	var black = '#111'
	if( def($sel) ){ $sel.css('cursor','inherit'); $sel.css('color','white') }
	if( def($desel1) ){ $desel1.css('cursor','pointer'); $desel1.css('color',black) }
	if( def($desel2) ){ $desel2.css('cursor','pointer'); $desel2.css('color',black) }
	if( def($desel3) ){ $desel3.css('cursor','pointer'); $desel3.css('color',black) }
}
function grammarify(string){
	string = string.replace( / a (?=[aAeEiIoOuU])/g, ' an ' ) // the method seeks out $1 itself and replaces it
	string = string.replace( /[^.]$/, '$&.' )
	return string.charAt(0).toUpperCase() + string.substr(1)
}
// alert( grammarify('a owl') )

//////////////////////////////// FEEDBACK ////////////////////////////////
function feedback_give(){
	var code = editor.getValue()
	// alert('your code is '+code)
	$('#content').children().remove()
	try{
		var syntax = esprima.parse(code) // use http://www.w3schools.com/js/js_errors.asp for errors
	}
	catch(error){
		$('#content').append( '<div class="incorrect">' + grammarify(error.toString()) + '</div>' )
	}
	// alert('your syntax is '+JSON.stringify(syntax))
	// alert( exists_construct_tree( [ _if, _var, _for, {is:_for}, { is:_if, has:_function } ] , syntax ) ) // _for discludes _for_in
	// alert( exists_construct_tree( [ _if, _var, _for_loop, {is:_for_in}, { is:_if, has:_var } ] , syntax ) )
	var con_trees = [ // put your requirements here. each entry gets 1 box, so separate how you like:
		[ { is: _for_loop, has: _var } ],
		_if,
		_while,
//		_for_loop,
//		[_if,_var],
//		{ is: _do_while, has: _var },
//		[ { is:_if, has:{ is: _do_while, has: _var } } ],
	]
	for( var i=0; i<con_trees.length; ++i ){
		var myfeedback = feedback.stringify_and_validate_construct_tree( con_trees[i], syntax ) // _for_loop includes _for_in
		var classname = (myfeedback.validated)? 'correct': 'incorrect'
		$('#content').append( '<div class="'+classname+'">' + grammarify(myfeedback.string) + '</div>' )
	}
}
var feedbackloop
function feedback_on(){
	$('#check').fadeOut()
	feedback_give(); feedbackloop = setInterval( feedback_give, 2000 )
	select( $('#always'), $('#button') )
}
function feedback_off(){
	clearInterval( feedbackloop )
	//$('#content').children().remove()
	$('#check').fadeIn()
	select( $('#button'), $('#always') )
}
$('#always').click( feedback_on )
$('#button').click( feedback_off )
$('#check').click( feedback_give )

//////////////////////////////// ANIMATION ////////////////////////////////
function animation_on(){
	$('#animation').addClass('animating')
	select( $('#animationon'), $('#animationoff') )
}
function animation_off(){
	$('#animation').removeClass('animating')
	select( $('#animationoff'), $('#animationon') )
}
function animation_reset(){
	$('#animation').toggleClass('animating')
	$('#animation').toggleClass('animating')
}
$('#animationon').click( animation_on )
$('#animationoff').click( animation_off )

////////////////////////////////// SOUND //////////////////////////////////
function sound_on(){
	$('audio').get(0).play()
	select( $('#soundon'), $('#soundoff') )
}
function sound_off(){
	$('audio').get(0).pause()
	select( $('#soundoff'), $('#soundon') )
}
$('#soundon').click( sound_on )
$('#soundoff').click( sound_off )

/*
we want an mp3 since all browsers support it.  the media type is called "audio/mpeg"
http://mysoftmusic.com/categories/relaxing good but not free


*/

/////////////////////////////////// THEME /////////////////////////////////
function theme_change( $el, classname, codemirrorname ){
	$('body').removeClass('bubblegum solarized solarized-dark'); $('body').addClass(classname)
	// alert(editor)
	editor.setOption( 'theme', codemirrorname )
	select( undefined, $('#day'), $('#evening'), $('#night') ); select( $el )
}
$('#day').click( function(){ theme_change( $(this), 'bubblegum', 'bubblegum' ) } )
$('#evening').click( function(){ theme_change( $(this), 'solarized', 'solarized light' ) } )
$('#night').click( function(){ theme_change( $(this), 'solarized-dark', 'solarized dark' ) } )

////////////////////////////////// SETUP //////////////////////////////////
var editor = CodeMirror.fromTextArea( $('#code').get(0), {
	theme: 'solarized dark',
	lineNumbers: true,
	matchBrackets: true,
	mode: 'javascript',
	viewportMargin: Infinity,
	extraKeys: {
		"Ctrl-/": "toggleComment",
		"Cmd-/": "toggleComment",
	},
}) // finish creating my CodeMirror instance
$('textarea').focus()
// alert('10')
if( !browser.isFirefox ) animation_on(); else animation_off()
if( false ) sound_on(); else sound_off()
if( false ){ feedback_on() }else{ feedback_give(); feedback_off() }
var hours = new Date().getHours() // returns 0-23
if( hours < 17 ) $('#day').trigger('click')
else if( hours < 21 ) $('#evening').trigger('click')
else $('#night').trigger('click')

}) // end of require
