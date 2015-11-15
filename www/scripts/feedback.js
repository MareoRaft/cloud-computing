define( ['esprima'], function(esprima){

/*
var syntax = esprima.parse([
	'    var greeting;',
	'    for(var x=0; x<6; x+=10){var these; var that; if(1===1){ alert("hi"); var x }}',
	'document.getElementById("demo").innerHTML = greeting;',

].join('\n'))
*/
// syntax becomes a JSON object
// var syntax = esprima.tokenize('var answer = 42;') // syntax becomes a JSON object
// alert(JSON.stringify(syntax, null, 4))
// alert(syntax.type)

function die(message) {
    alert(message)
    throw message
}

// Sees if something is defined
function def(scalar){
	return typeof(scalar)!=='undefined'
}
// alert( def({}) )

var constructnames = []
// Generates a function which checks if an object is a specific type
function generate_type_checker(type){
	constructnames.push(type)
	return function(syntax){
		return def(syntax) && def(syntax.type) && syntax.type===type
	}
}
// The strings passed in below must match the Parser API standard: https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API
window._if = generate_type_checker('IfStatement')
window._while = generate_type_checker('WhileStatement')
window._do_while = generate_type_checker('DoWhileStatement')
window._var = generate_type_checker('VariableDeclaration')
window._function = generate_type_checker('FunctionDeclaration')
window._for = generate_type_checker('ForStatement') // discludes _for_in, such as "for( window.x in y )"
window._for_in = generate_type_checker('ForInStatement')
window._for_loop = function(syntax){ return _for(syntax) || _for_in(syntax) } // general "for"
// alert( _if({ type: 'IfStatement', htype:undefined }) )
// alert( _for_loop({ type: 'ForStatement', htype:undefined }) )

// Executes visitor on the object and its children (recursively).
function exists_construct( con, syntax ) {
    if( con(syntax) || exists_construct_in_children( con, syntax ) ) return true
    return false
}
// alert( exists_construct( _function, syntax ) )
// alert( exists_construct( _for, syntax.body[0] ) )
// alert( exists_construct( _for, syntax.body[1] ) )

function exists_construct_in_children( con, syntax ){
	for( var key in syntax )if( syntax.hasOwnProperty(key) ){
        var syntaxchild = syntax[key]
        if( typeof(syntaxchild)==='object' && syntaxchild!==null ){
            if( exists_construct( con, syntaxchild ) ) return true
        }
	}
	return false
}
// alert( exists_construct_in_children( _function, syntax ) )

// Checks for more than one construct at once
/*
function exists_constructs( cons, syntax ) {
    var key, child
    for( var i=0; i<cons.length; ++i ) if( cons[i]!==1 && cons[i].call(null, syntax) ){
    	// make that visitor a 1
    	cons[i] = 1 // 1 means we found it!
    	if( all_cons_found(cons) ) return cons
    }
    for (key in syntax) {
        if (syntax.hasOwnProperty(key)) {
            child = syntax[key]
            if (typeof child==='object' && child!==null) {
                cons = cons | exists_constructs( cons, child )
	            if( all_cons_found(cons) ) return cons
            }
        }
    }
    return cons
}
alert( exists_constructs( [_for], syntax ) ) // we will try this later as a bonus if we have time
*/

function exists_all_constructs( cons, syntax ){
	for( var i=0; i<cons.length; ++i )if( !exists_construct( cons[i], syntax ) ) return false
	return true
}
// alert( exists_all_constructs( [_if,_while,_var,_for], syntax ) )

function exists_any_constructs( cons, syntax ){
	for( var i=0; i<cons.length; ++i )if( exists_construct( cons[i], syntax ) ) return true
	return false
}
// alert( exists_any_constructs( [_while,_while,_while,_function,_while], syntax ) )

function exists_no_constructs( cons, syntax ){
	return !exists_any_constructs( cons, syntax )
}
// alert( exists_no_constructs( [_while,_for,_while,_do_while,_while,_while], syntax ) )

function exists_embedded_construct( conchild, conparent, syntax ){
    if( conparent(syntax) && exists_construct_in_children( conchild, syntax ) ) return true
    for( var key in syntax )if( syntax.hasOwnProperty(key) ){
        var syntaxchild = syntax[key]
        if( typeof(syntaxchild)==='object' && syntaxchild!==null ){
            if( exists_embedded_construct( conchild, conparent, syntaxchild ) ) return true
        }
    }
    return false
}
// alert( exists_embedded_construct( _for, _for, syntax ) )
// alert( exists_embedded_construct( _var, _for, syntax ) )

// We can make a more general function that inputs
// { is: _for, has: _if } or
// [{ is: _while, has: _for }, { is: var }] or
// [{ is: _while, has: [{ is: _for, has: [_var] }] }] etc
// and outputs true or false

function exists_construct_tree( con_tree, syntax ){
	// base case
	if( typeof(con_tree)==='function' ) return exists_construct( con_tree, syntax )
	// base case 2
	if( con_tree.constructor===Array ){
		for( var i=0; i<con_tree.length; ++i ){
			if( !exists_construct_tree( con_tree[i], syntax ) ) return false
		}
		return true
	}
	// object structure
	if( 'is' in con_tree ){
		// error check that con_tree.is is really a type checker
		if( !con_tree.is(syntax) ) return exists_construct_tree_in_children( con_tree, syntax ) // it's not here, go deeper
		/* yay, it is here!  Moving on to 'has' below... */
	}
	else die('construct tree "'+con_tree+'" has no "is" key')
	if( 'has' in con_tree ){
		// error check
		return exists_construct_tree_in_children( con_tree.has, syntax )
	}
	return true // when no 'has' key exists, we are done!
}

function exists_construct_tree_in_children( con_tree, syntax ){
	for( var key in syntax )if( syntax.hasOwnProperty(key) ){
        var syntaxchild = syntax[key]
        if( typeof(syntaxchild)==='object' && syntaxchild!==null ){
            if( exists_construct_tree( con_tree, syntaxchild ) ) return true
        }
	}
	return false
}
// alert( exists_construct_tree( { is: _var, has: [ {is:_var}, {is:_function} ] }, syntax ) )
// alert( exists_construct_tree( { is: _for, has: [ {is:_if}, {is:_if} ] }, syntax ) ) // doesn't look for two separate if's
// alert( exists_construct_tree( { is: _for, has: [ {is:_if}, {is:_var} ] }, syntax ) )
// alert( exists_construct_tree( { is: _for, has: [ _if, _var ] }, syntax ) )
// alert( exists_construct_tree( [ _if, _var, _for, {is:_for}, { is:_if, has:_var } ] , syntax ) )
// alert( exists_construct_tree( [ _if, _var, _for, {is:_for}, { is:_if, has:_function } ] , syntax ) )

function stringify_construct( con ){
	for( var i=0; i<constructnames.length; ++i )if( con({ type: constructnames[i] }) ) return constructnames[i]
	return '!NameNotFound!'
}
// alert( stringify_construct( _for_loop ) )

function stringify_construct_tree_helper( con_tree ){ // alternative: use JSON.stringify() then run result through regex
	if( con_tree.constructor===Array ){
		return $.map( con_tree, function(el){ return stringify_construct_tree_helper(el) } ).join(' and')
	}
	var string = '', construct
	if( 'is' in con_tree ) construct = con_tree.is; else construct = con_tree
	string += ' a ' + stringify_construct( construct )
	if( 'has' in con_tree ) string += ', which contains ('+stringify_construct_tree_helper( con_tree.has )+' )'
	return string
}

function stringify_and_validate_construct_tree( con_tree, syntax ){
	var validated = (exists_construct_tree( con_tree, syntax ))? true: false
	var containment = (validated)? ' contains': ' must contain'
	var content = stringify_construct_tree_helper( con_tree )
	return { string: 'Your code' + containment + content + '.', validated: validated }
}
// alert( stringify_construct_tree( [ _var, _function, _for_loop ] ) )
// alert( stringify_construct_tree( {is:_do_while, has: [_var,_do_while,_function]} ) )
// alert( stringify_construct_tree( [{ is: _while, has: [{ is: _for, has: [_var,_function] }] }, _do_while, {is:_var,has:_var}] ) )

return {
	exists_construct: exists_construct,
	exists_construct_in_children: exists_construct_in_children,
	exists_all_constructs: exists_all_constructs,
	exists_any_constructs: exists_any_constructs,
	exists_no_constructs: exists_no_constructs,
	exists_embedded_construct: exists_embedded_construct,
	exists_construct_tree: exists_construct_tree,
	exists_construct_tree_in_children: exists_construct_tree_in_children,
	stringify_and_validate_construct_tree: stringify_and_validate_construct_tree,
}

}) // end of define
