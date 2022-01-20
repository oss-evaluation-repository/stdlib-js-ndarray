/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var isndarrayLike = require( '@stdlib/assert/is-ndarray-like' );
var isPlainObject = require( '@stdlib/assert/is-plain-object' );
var hasOwnProp = require( '@stdlib/assert/has-own-property' );
var shape2strides = require( './../../base/shape2strides' );
var strides2offset = require( './../../base/strides2offset' );
var buffer = require( './../../base/buffer' );
var numel = require( './../../base/numel' );
var ndarray = require( './../../ctor' );


// MAIN //

/**
* Creates a zero-filled ndarray having the same shape and data type as a provided ndarray.
*
* @param {ndarray} x - input array
* @param {Options} [options] - function options
* @param {string} [options.dtype] - output array data type (overrides the input array's inferred data type)
* @param {string} [options.order] - specifies whether the output array should be 'row-major' (C-style) or 'column-major' (Fortran-style) (overrides the input array's inferred order)
* @param {(NonNegativeIntegerArray|NonNegativeInteger)} [options.shape] - output array shape (overrides the input array's inferred shape)
* @throws {TypeError} first argument must have a recognized data type
* @throws {TypeError} options argument must be an object
* @throws {TypeError} `dtype` option must be a supported ndarray data type
* @throws {TypeError} `order` option must be a supported order
* @throws {TypeError} `shape` option must be either a nonnegative integer or an array of nonnegative integers
* @returns {ndarray} ndarray
*
* @example
* var zeros = require( '@stdlib/ndarray/zeros' );
*
* var x = zeros( [ 2, 2 ] );
* // returns <ndarray>
*
* var y = zerosLike( x );
* // returns <ndarray>
*
* var sh = y.shape;
* // returns [ 2, 2 ]
*
* var dt = y.dtype;
* // returns 'float64'
*/
function zerosLike( x ) {
	var options;
	var opts;
	var buf;
	var st;

	if ( !isndarrayLike( x ) ) {
		throw new TypeError( 'invalid argument. First argument must be an ndarray-like object. Value: `' + x + '`.' );
	}
	opts = {};
	if ( arguments.length > 1 ) {
		options = arguments[ 1 ];
		if ( !isPlainObject( options ) ) {
			throw new TypeError( 'invalid argument. Options argument must be an object. Value: `' + options + '`.' );
		}
		if ( hasOwnProp( options, 'dtype' ) ) {
			opts.dtype = options.dtype;
		} else {
			opts.dtype = x.dtype;
		}
		if ( hasOwnProp( options, 'shape' ) ) {
			opts.shape = options.shape;
			if ( typeof opts.shape === 'number' ) {
				opts.shape = [ opts.shape ];
			}
		} else {
			opts.shape = x.shape;
		}
		if ( hasOwnProp( options, 'order' ) ) {
			opts.order = options.order;
		} else {
			opts.order = x.order;
		}
	} else {
		opts.dtype = x.dtype;
		opts.shape = x.shape;
		opts.order = x.order;
	}
	buf = buffer( opts.dtype, numel( opts.shape ) );
	if ( buf === null ) {
		throw new TypeError( 'invalid argument. First argument must have a recognized data type. Value: `' + opts.dtype + '`.' );
	}
	st = shape2strides( opts.shape, opts.order );
	return new ndarray( opts.dtype, buf, opts.shape, st, strides2offset( opts.shape, st ), opts.order ); // eslint-disable-line max-len
}


// EXPORTS //

module.exports = zerosLike;
