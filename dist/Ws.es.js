var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var anyMap = new WeakMap();
var eventsMap = new WeakMap();
var resolvedPromise = Promise.resolve();

function assertEventName(eventName) {
	if (typeof eventName !== 'string') {
		throw new TypeError('eventName must be a string');
	}
}

function assertListener(listener) {
	if (typeof listener !== 'function') {
		throw new TypeError('listener must be a function');
	}
}

function getListeners(instance, eventName) {
	var events = eventsMap.get(instance);
	if (!events.has(eventName)) {
		events.set(eventName, new Set());
	}

	return events.get(eventName);
}

var Emittery = function () {
	function Emittery() {
		classCallCheck(this, Emittery);

		anyMap.set(this, new Set());
		eventsMap.set(this, new Map());
	}

	createClass(Emittery, [{
		key: 'on',
		value: function on(eventName, listener) {
			assertEventName(eventName);
			assertListener(listener);
			getListeners(this, eventName).add(listener);
			return this.off.bind(this, eventName, listener);
		}
	}, {
		key: 'off',
		value: function off(eventName, listener) {
			assertEventName(eventName);
			assertListener(listener);
			getListeners(this, eventName).delete(listener);
		}
	}, {
		key: 'once',
		value: function once(eventName) {
			var _this = this;

			return new Promise(function (resolve) {
				assertEventName(eventName);
				var off = _this.on(eventName, function (data) {
					off();
					resolve(data);
				});
			});
		}
	}, {
		key: 'emit',
		value: function () {
			var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(eventName, eventData) {
				var _this2 = this;

				var listeners, anyListeners, staticListeners, staticAnyListeners;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								assertEventName(eventName);

								listeners = getListeners(this, eventName);
								anyListeners = anyMap.get(this);
								staticListeners = [].concat(toConsumableArray(listeners));
								staticAnyListeners = [].concat(toConsumableArray(anyListeners));
								_context3.next = 7;
								return resolvedPromise;

							case 7:
								return _context3.abrupt('return', Promise.all([].concat(toConsumableArray(staticListeners.map(function () {
									var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(listener) {
										return regeneratorRuntime.wrap(function _callee$(_context) {
											while (1) {
												switch (_context.prev = _context.next) {
													case 0:
														if (!listeners.has(listener)) {
															_context.next = 2;
															break;
														}

														return _context.abrupt('return', listener(eventData));

													case 2:
													case 'end':
														return _context.stop();
												}
											}
										}, _callee, _this2);
									}));

									return function (_x3) {
										return _ref2.apply(this, arguments);
									};
								}())), toConsumableArray(staticAnyListeners.map(function () {
									var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(listener) {
										return regeneratorRuntime.wrap(function _callee2$(_context2) {
											while (1) {
												switch (_context2.prev = _context2.next) {
													case 0:
														if (!anyListeners.has(listener)) {
															_context2.next = 2;
															break;
														}

														return _context2.abrupt('return', listener(eventName, eventData));

													case 2:
													case 'end':
														return _context2.stop();
												}
											}
										}, _callee2, _this2);
									}));

									return function (_x4) {
										return _ref3.apply(this, arguments);
									};
								}())))));

							case 8:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function emit(_x, _x2) {
				return _ref.apply(this, arguments);
			}

			return emit;
		}()
	}, {
		key: 'emitSerial',
		value: function () {
			var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(eventName, eventData) {
				var listeners, anyListeners, staticListeners, staticAnyListeners, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, listener, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _listener;

				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								assertEventName(eventName);

								listeners = getListeners(this, eventName);
								anyListeners = anyMap.get(this);
								staticListeners = [].concat(toConsumableArray(listeners));
								staticAnyListeners = [].concat(toConsumableArray(anyListeners));
								_context4.next = 7;
								return resolvedPromise;

							case 7:
								/* eslint-disable no-await-in-loop */
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context4.prev = 10;
								_iterator = staticListeners[Symbol.iterator]();

							case 12:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context4.next = 20;
									break;
								}

								listener = _step.value;

								if (!listeners.has(listener)) {
									_context4.next = 17;
									break;
								}

								_context4.next = 17;
								return listener(eventData);

							case 17:
								_iteratorNormalCompletion = true;
								_context4.next = 12;
								break;

							case 20:
								_context4.next = 26;
								break;

							case 22:
								_context4.prev = 22;
								_context4.t0 = _context4['catch'](10);
								_didIteratorError = true;
								_iteratorError = _context4.t0;

							case 26:
								_context4.prev = 26;
								_context4.prev = 27;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 29:
								_context4.prev = 29;

								if (!_didIteratorError) {
									_context4.next = 32;
									break;
								}

								throw _iteratorError;

							case 32:
								return _context4.finish(29);

							case 33:
								return _context4.finish(26);

							case 34:
								_iteratorNormalCompletion2 = true;
								_didIteratorError2 = false;
								_iteratorError2 = undefined;
								_context4.prev = 37;
								_iterator2 = staticAnyListeners[Symbol.iterator]();

							case 39:
								if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
									_context4.next = 47;
									break;
								}

								_listener = _step2.value;

								if (!anyListeners.has(_listener)) {
									_context4.next = 44;
									break;
								}

								_context4.next = 44;
								return _listener(eventName, eventData);

							case 44:
								_iteratorNormalCompletion2 = true;
								_context4.next = 39;
								break;

							case 47:
								_context4.next = 53;
								break;

							case 49:
								_context4.prev = 49;
								_context4.t1 = _context4['catch'](37);
								_didIteratorError2 = true;
								_iteratorError2 = _context4.t1;

							case 53:
								_context4.prev = 53;
								_context4.prev = 54;

								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}

							case 56:
								_context4.prev = 56;

								if (!_didIteratorError2) {
									_context4.next = 59;
									break;
								}

								throw _iteratorError2;

							case 59:
								return _context4.finish(56);

							case 60:
								return _context4.finish(53);

							case 61:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this, [[10, 22, 26, 34], [27,, 29, 33], [37, 49, 53, 61], [54,, 56, 60]]);
			}));

			function emitSerial(_x5, _x6) {
				return _ref4.apply(this, arguments);
			}

			return emitSerial;
		}()
	}, {
		key: 'onAny',
		value: function onAny(listener) {
			assertListener(listener);
			anyMap.get(this).add(listener);
			return this.offAny.bind(this, listener);
		}
	}, {
		key: 'offAny',
		value: function offAny(listener) {
			assertListener(listener);
			anyMap.get(this).delete(listener);
		}
	}, {
		key: 'clearListeners',
		value: function clearListeners(eventName) {
			if (typeof eventName === 'string') {
				getListeners(this, eventName).clear();
			} else {
				anyMap.get(this).clear();
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = eventsMap.get(this).values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var listeners = _step3.value;

						listeners.clear();
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}
			}
		}
	}, {
		key: 'listenerCount',
		value: function listenerCount(eventName) {
			if (typeof eventName === 'string') {
				return anyMap.get(this).size + getListeners(this, eventName).size;
			}

			if (typeof eventName !== 'undefined') {
				assertEventName(eventName);
			}

			var count = anyMap.get(this).size;

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = eventsMap.get(this).values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var value = _step4.value;

					count += value.size;
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			return count;
		}
	}]);
	return Emittery;
}();

// Subclass used to encourage TS users to type their events.


Emittery.Typed = function (_Emittery) {
	inherits(_class, _Emittery);

	function _class() {
		classCallCheck(this, _class);
		return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
	}

	return _class;
}(Emittery);
Object.defineProperty(Emittery.Typed, 'Typed', {
	enumerable: false,
	value: undefined
});

var emittery = Emittery;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var strictUriEncode = function strictUriEncode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (x) {
    return '%' + x.charCodeAt(0).toString(16).toUpperCase();
  });
};

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

var decodeUriComponent = function decodeUriComponent(encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + (typeof encodedURI === 'undefined' ? 'undefined' : _typeof(encodedURI)) + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};

var splitOnFirst = function splitOnFirst(string, separator) {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (separator === '') {
		return [string];
	}

	var separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [string];
	}

	return [string.slice(0, separatorIndex), string.slice(separatorIndex + separator.length)];
};

var queryString = createCommonjsModule(function (module, exports) {

	var isNullOrUndefined = function isNullOrUndefined(value) {
		return value === null || value === undefined;
	};

	function encoderForArrayFormat(options) {
		switch (options.arrayFormat) {
			case 'index':
				return function (key) {
					return function (result, value) {
						var index = result.length;

						if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
							return result;
						}

						if (value === null) {
							return [].concat(toConsumableArray(result), [[encode(key, options), '[', index, ']'].join('')]);
						}

						return [].concat(toConsumableArray(result), [[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')]);
					};
				};

			case 'bracket':
				return function (key) {
					return function (result, value) {
						if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
							return result;
						}

						if (value === null) {
							return [].concat(toConsumableArray(result), [[encode(key, options), '[]'].join('')]);
						}

						return [].concat(toConsumableArray(result), [[encode(key, options), '[]=', encode(value, options)].join('')]);
					};
				};

			case 'comma':
			case 'separator':
				return function (key) {
					return function (result, value) {
						if (value === null || value === undefined || value.length === 0) {
							return result;
						}

						if (result.length === 0) {
							return [[encode(key, options), '=', encode(value, options)].join('')];
						}

						return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
					};
				};

			default:
				return function (key) {
					return function (result, value) {
						if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
							return result;
						}

						if (value === null) {
							return [].concat(toConsumableArray(result), [encode(key, options)]);
						}

						return [].concat(toConsumableArray(result), [[encode(key, options), '=', encode(value, options)].join('')]);
					};
				};
		}
	}

	function parserForArrayFormat(options) {
		var result = void 0;

		switch (options.arrayFormat) {
			case 'index':
				return function (key, value, accumulator) {
					result = /\[(\d*)\]$/.exec(key);

					key = key.replace(/\[\d*\]$/, '');

					if (!result) {
						accumulator[key] = value;
						return;
					}

					if (accumulator[key] === undefined) {
						accumulator[key] = {};
					}

					accumulator[key][result[1]] = value;
				};

			case 'bracket':
				return function (key, value, accumulator) {
					result = /(\[\])$/.exec(key);
					key = key.replace(/\[\]$/, '');

					if (!result) {
						accumulator[key] = value;
						return;
					}

					if (accumulator[key] === undefined) {
						accumulator[key] = [value];
						return;
					}

					accumulator[key] = [].concat(accumulator[key], value);
				};

			case 'comma':
			case 'separator':
				return function (key, value, accumulator) {
					var isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
					var isEncodedArray = typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator);
					value = isEncodedArray ? decode(value, options) : value;
					var newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(function (item) {
						return decode(item, options);
					}) : value === null ? value : decode(value, options);
					accumulator[key] = newValue;
				};

			default:
				return function (key, value, accumulator) {
					if (accumulator[key] === undefined) {
						accumulator[key] = value;
						return;
					}

					accumulator[key] = [].concat(accumulator[key], value);
				};
		}
	}

	function validateArrayFormatSeparator(value) {
		if (typeof value !== 'string' || value.length !== 1) {
			throw new TypeError('arrayFormatSeparator must be single character string');
		}
	}

	function encode(value, options) {
		if (options.encode) {
			return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
		}

		return value;
	}

	function decode(value, options) {
		if (options.decode) {
			return decodeUriComponent(value);
		}

		return value;
	}

	function keysSorter(input) {
		if (Array.isArray(input)) {
			return input.sort();
		}

		if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
			return keysSorter(Object.keys(input)).sort(function (a, b) {
				return Number(a) - Number(b);
			}).map(function (key) {
				return input[key];
			});
		}

		return input;
	}

	function removeHash(input) {
		var hashStart = input.indexOf('#');
		if (hashStart !== -1) {
			input = input.slice(0, hashStart);
		}

		return input;
	}

	function getHash(url) {
		var hash = '';
		var hashStart = url.indexOf('#');
		if (hashStart !== -1) {
			hash = url.slice(hashStart);
		}

		return hash;
	}

	function extract(input) {
		input = removeHash(input);
		var queryStart = input.indexOf('?');
		if (queryStart === -1) {
			return '';
		}

		return input.slice(queryStart + 1);
	}

	function parseValue(value, options) {
		if (options.parseNumbers && !Number.isNaN(Number(value)) && typeof value === 'string' && value.trim() !== '') {
			value = Number(value);
		} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
			value = value.toLowerCase() === 'true';
		}

		return value;
	}

	function parse(query, options) {
		options = _extends({
			decode: true,
			sort: true,
			arrayFormat: 'none',
			arrayFormatSeparator: ',',
			parseNumbers: false,
			parseBooleans: false
		}, options);

		validateArrayFormatSeparator(options.arrayFormatSeparator);

		var formatter = parserForArrayFormat(options);

		// Create an object with no prototype
		var ret = Object.create(null);

		if (typeof query !== 'string') {
			return ret;
		}

		query = query.trim().replace(/^[?#&]/, '');

		if (!query) {
			return ret;
		}

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = query.split('&')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var param = _step.value;

				var _splitOnFirst = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '='),
				    _splitOnFirst2 = slicedToArray(_splitOnFirst, 2),
				    key = _splitOnFirst2[0],
				    value = _splitOnFirst2[1];

				// Missing `=` should be `null`:
				// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters


				value = value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? value : decode(value, options);
				formatter(decode(key, options), value, ret);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = Object.keys(ret)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var key = _step2.value;

				var value = ret[key];
				if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = Object.keys(value)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var k = _step3.value;

							value[k] = parseValue(value[k], options);
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}
				} else {
					ret[key] = parseValue(value, options);
				}
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		if (options.sort === false) {
			return ret;
		}

		return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce(function (result, key) {
			var value = ret[key];
			if (Boolean(value) && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Array.isArray(value)) {
				// Sort object keys, not values
				result[key] = keysSorter(value);
			} else {
				result[key] = value;
			}

			return result;
		}, Object.create(null));
	}

	exports.extract = extract;
	exports.parse = parse;

	exports.stringify = function (object, options) {
		if (!object) {
			return '';
		}

		options = _extends({
			encode: true,
			strict: true,
			arrayFormat: 'none',
			arrayFormatSeparator: ','
		}, options);

		validateArrayFormatSeparator(options.arrayFormatSeparator);

		var shouldFilter = function shouldFilter(key) {
			return options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === '';
		};

		var formatter = encoderForArrayFormat(options);

		var objectCopy = {};

		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = Object.keys(object)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var key = _step4.value;

				if (!shouldFilter(key)) {
					objectCopy[key] = object[key];
				}
			}
		} catch (err) {
			_didIteratorError4 = true;
			_iteratorError4 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion4 && _iterator4.return) {
					_iterator4.return();
				}
			} finally {
				if (_didIteratorError4) {
					throw _iteratorError4;
				}
			}
		}

		var keys = Object.keys(objectCopy);

		if (options.sort !== false) {
			keys.sort(options.sort);
		}

		return keys.map(function (key) {
			var value = object[key];

			if (value === undefined) {
				return '';
			}

			if (value === null) {
				return encode(key, options);
			}

			if (Array.isArray(value)) {
				return value.reduce(formatter(key), []).join('&');
			}

			return encode(key, options) + '=' + encode(value, options);
		}).filter(function (x) {
			return x.length > 0;
		}).join('&');
	};

	exports.parseUrl = function (url, options) {
		options = _extends({
			decode: true
		}, options);

		var _splitOnFirst3 = splitOnFirst(url, '#'),
		    _splitOnFirst4 = slicedToArray(_splitOnFirst3, 2),
		    url_ = _splitOnFirst4[0],
		    hash = _splitOnFirst4[1];

		return _extends({
			url: url_.split('?')[0] || '',
			query: parse(extract(url), options)
		}, options && options.parseFragmentIdentifier && hash ? { fragmentIdentifier: decode(hash, options) } : {});
	};

	exports.stringifyUrl = function (object, options) {
		options = _extends({
			encode: true,
			strict: true
		}, options);

		var url = removeHash(object.url).split('?')[0] || '';
		var queryFromUrl = exports.extract(object.url);
		var parsedQueryFromUrl = exports.parse(queryFromUrl, { sort: false });

		var query = _extends(parsedQueryFromUrl, object.query);
		var queryString = exports.stringify(query, options);
		if (queryString) {
			queryString = '?' + queryString;
		}

		var hash = getHash(object.url);
		if (object.fragmentIdentifier) {
			hash = '#' + encode(object.fragmentIdentifier, options);
		}

		return '' + url + queryString + hash;
	};
});
var queryString_1 = queryString.extract;
var queryString_2 = queryString.parse;
var queryString_3 = queryString.stringify;
var queryString_4 = queryString.parseUrl;
var queryString_5 = queryString.stringifyUrl;

var wsp_browser = createCommonjsModule(function (module, exports) {
  !function (t, e) {
    module.exports = e();
  }(commonjsGlobal, function () {
    var t = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
      return typeof t === 'undefined' ? 'undefined' : _typeof(t);
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t === 'undefined' ? 'undefined' : _typeof(t);
    },
        e = { OPEN: 0, JOIN: 1, LEAVE: 2, JOIN_ACK: 3, JOIN_ERROR: 4, LEAVE_ACK: 5, LEAVE_ERROR: 6, EVENT: 7, PING: 8, PONG: 9 };function o(t, e, o) {
      return o.forEach(function (t) {
        !function (t, e) {
          if (!t || "string" != typeof t) throw new Error(e);
        }(e[t], "expected " + t + " to be a valid string");
      }), { t: t, d: e };
    }var n = {};return Object.keys(e).forEach(function (o) {
      var i = o.toLowerCase().replace(/^\w|_(\w)/g, function (t, e) {
        return e ? e.toUpperCase() : t.toUpperCase();
      });n["is" + i + "Packet"] = function (n) {
        return !(!n || "object" !== (void 0 === n ? "undefined" : t(n)) || n.t !== e[o]);
      };
    }), n.hasTopic = function (t) {
      return !!(t && t.d && t.d.topic);
    }, n.isValidJoinPacket = n.hasTopic, n.isValidLeavePacket = n.hasTopic, n.isValidEventPacket = n.hasTopic, n.joinPacket = function (t) {
      return o(e.JOIN, { topic: t }, ["topic"]);
    }, n.leavePacket = function (t) {
      return o(e.LEAVE, { topic: t }, ["topic"]);
    }, n.joinAckPacket = function (t) {
      return o(e.JOIN_ACK, { topic: t }, ["topic"]);
    }, n.joinErrorPacket = function (t, n) {
      return o(e.JOIN_ERROR, { topic: t, message: n }, ["topic", "message"]);
    }, n.leaveAckPacket = function (t) {
      return o(e.LEAVE_ACK, { topic: t }, ["topic"]);
    }, n.leaveErrorPacket = function (t, n) {
      return o(e.LEAVE_ERROR, { topic: t, message: n }, ["topic", "message"]);
    }, n.eventPacket = function (t, n, i) {
      return o(e.EVENT, { topic: t, event: n, data: i = i || "" }, ["topic", "event"]);
    }, n.pingPacket = function () {
      return { t: e.PING };
    }, n.pongPacket = function () {
      return { t: e.PONG };
    }, _extends({ codes: e }, n);
  });
});

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function ms(val, options) {
  options = options || {};
  var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

var debug = createCommonjsModule(function (module, exports) {
  /**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   *
   * Expose `debug()` as the module.
   */

  exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
  exports.coerce = coerce;
  exports.disable = disable;
  exports.enable = enable;
  exports.enabled = enabled;
  exports.humanize = ms;

  /**
   * The currently active debug mode names, and names to skip.
   */

  exports.names = [];
  exports.skips = [];

  /**
   * Map of special "%n" handling functions, for the debug "format" argument.
   *
   * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
   */

  exports.formatters = {};

  /**
   * Previous log timestamp.
   */

  var prevTime;

  /**
   * Select a color.
   * @param {String} namespace
   * @return {Number}
   * @api private
   */

  function selectColor(namespace) {
    var hash = 0,
        i;

    for (i in namespace) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return exports.colors[Math.abs(hash) % exports.colors.length];
  }

  /**
   * Create a debugger with the given `namespace`.
   *
   * @param {String} namespace
   * @return {Function}
   * @api public
   */

  function createDebug(namespace) {

    function debug() {
      // disabled?
      if (!debug.enabled) return;

      var self = debug;

      // set `diff` timestamp
      var curr = +new Date();
      var ms$$1 = curr - (prevTime || curr);
      self.diff = ms$$1;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;

      // turn the `arguments` into a proper Array
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }

      args[0] = exports.coerce(args[0]);

      if ('string' !== typeof args[0]) {
        // anything else let's inspect with %O
        args.unshift('%O');
      }

      // apply any `formatters` transformations
      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // if we encounter an escaped % then don't increase the array index
        if (match === '%%') return match;
        index++;
        var formatter = exports.formatters[format];
        if ('function' === typeof formatter) {
          var val = args[index];
          match = formatter.call(self, val);

          // now we need to remove `args[index]` since it's inlined in the `format`
          args.splice(index, 1);
          index--;
        }
        return match;
      });

      // apply env-specific formatting (colors, etc.)
      exports.formatArgs.call(self, args);

      var logFn = debug.log || exports.log || console.log.bind(console);
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = exports.enabled(namespace);
    debug.useColors = exports.useColors();
    debug.color = selectColor(namespace);

    // env-specific initialization logic for debug instances
    if ('function' === typeof exports.init) {
      exports.init(debug);
    }

    return debug;
  }

  /**
   * Enables a debug mode by namespaces. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} namespaces
   * @api public
   */

  function enable(namespaces) {
    exports.save(namespaces);

    exports.names = [];
    exports.skips = [];

    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (var i = 0; i < len; i++) {
      if (!split[i]) continue; // ignore empty strings
      namespaces = split[i].replace(/\*/g, '.*?');
      if (namespaces[0] === '-') {
        exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        exports.names.push(new RegExp('^' + namespaces + '$'));
      }
    }
  }

  /**
   * Disable debug output.
   *
   * @api public
   */

  function disable() {
    exports.enable('');
  }

  /**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   * @api public
   */

  function enabled(name) {
    var i, len;
    for (i = 0, len = exports.skips.length; i < len; i++) {
      if (exports.skips[i].test(name)) {
        return false;
      }
    }
    for (i = 0, len = exports.names.length; i < len; i++) {
      if (exports.names[i].test(name)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Coerce `val`.
   *
   * @param {Mixed} val
   * @return {Mixed}
   * @api private
   */

  function coerce(val) {
    if (val instanceof Error) return val.stack || val.message;
    return val;
  }
});
var debug_1 = debug.coerce;
var debug_2 = debug.disable;
var debug_3 = debug.enable;
var debug_4 = debug.enabled;
var debug_5 = debug.humanize;
var debug_6 = debug.names;
var debug_7 = debug.skips;
var debug_8 = debug.formatters;

var browser = createCommonjsModule(function (module, exports) {
  /**
   * This is the web browser implementation of `debug()`.
   *
   * Expose `debug()` as the module.
   */

  exports = module.exports = debug;
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

  /**
   * Colors.
   */

  exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];

  /**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * TODO: add a `localStorage` variable to explicitly enable/disable colors
   */

  function useColors() {
    // NB: In an Electron preload script, document will be defined but not fully
    // initialized. Since we know we're in Chrome, we'll just detect this case
    // explicitly
    if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
      return true;
    }

    // is webkit? http://stackoverflow.com/a/16459606/376773
    // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
    // double check webkit in userAgent just in case we are in a worker
    typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }

  /**
   * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
   */

  exports.formatters.j = function (v) {
    try {
      return JSON.stringify(v);
    } catch (err) {
      return '[UnexpectedJSONParseError]: ' + err.message;
    }
  };

  /**
   * Colorize log arguments if enabled.
   *
   * @api public
   */

  function formatArgs(args) {
    var useColors = this.useColors;

    args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

    if (!useColors) return;

    var c = 'color: ' + this.color;
    args.splice(1, 0, c, 'color: inherit');

    // the final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    var index = 0;
    var lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, function (match) {
      if ('%%' === match) return;
      index++;
      if ('%c' === match) {
        // we only are interested in the *last* %c
        // (the user may have provided their own)
        lastC = index;
      }
    });

    args.splice(lastC, 0, c);
  }

  /**
   * Invokes `console.log()` when available.
   * No-op when `console.log` is not a "function".
   *
   * @api public
   */

  function log() {
    // this hackery is required for IE8/9, where
    // the `console.log` function doesn't have 'apply'
    return 'object' === (typeof console === 'undefined' ? 'undefined' : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
  }

  /**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */

  function save(namespaces) {
    try {
      if (null == namespaces) {
        exports.storage.removeItem('debug');
      } else {
        exports.storage.debug = namespaces;
      }
    } catch (e) {}
  }

  /**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */

  function load() {
    var r;
    try {
      r = exports.storage.debug;
    } catch (e) {}

    // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    if (!r && typeof process !== 'undefined' && 'env' in process) {
      r = process.env.DEBUG;
    }

    return r;
  }

  /**
   * Enable namespaces listed in `localStorage.debug` initially.
   */

  exports.enable(load());

  /**
   * Localstorage attempts to return the localstorage.
   *
   * This is necessary because safari throws
   * when a user disables cookies/localstorage
   * and you attempt to access it.
   *
   * @return {LocalStorage}
   * @api private
   */

  function localstorage() {
    try {
      return window.localStorage;
    } catch (e) {}
  }
});
var browser_1 = browser.log;
var browser_2 = browser.formatArgs;
var browser_3 = browser.save;
var browser_4 = browser.load;
var browser_5 = browser.useColors;
var browser_6 = browser.storage;
var browser_7 = browser.colors;

var Debug = createCommonjsModule(function (module) {

  /*
   * adonis-websocket-client
   *
   * (c) Harminder Virk <virk@adonisjs.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
  */

  if (process.env.NODE_ENV !== 'production') {
    var _Debug = browser;
    _Debug.enable('adonis:*');
    module.exports = _Debug('adonis:websocket');
  } else {
    module.exports = function () {};
  }
});

/**
 * Socket class holds details for a single subscription. The instance
 * of this class can be used to exchange messages with the server
 * on a given topic.
 *
 * @class Socket
 */

var Socket = function () {
  function Socket(topic, connection) {
    classCallCheck(this, Socket);

    this.topic = topic;
    this.connection = connection;
    this.emitter = new emittery();
    this._state = 'pending';
    this._emitBuffer = [];
  }

  /**
   * Socket state
   *
   * @attribute state
   *
   * @return {String}
   */


  createClass(Socket, [{
    key: 'joinAck',


    /**
     * Called when subscription is confirmed by the
     * server
     *
     * @method joinAck
     *
     * @return {void}
     */
    value: function joinAck() {
      var _this = this;

      this.state = 'open';
      this.emitter.emit('ready', this);

      if (process.env.NODE_ENV !== 'production') {
        Debug('clearing emit buffer for %s topic after subscription ack', this.topic);
      }

      /**
       * Process queued events
       */
      this._emitBuffer.forEach(function (buf) {
        return _this.emit(buf.event, buf.data);
      });
      this._emitBuffer = [];
    }

    /**
     * Called when subscription is rejected by the server
     *
     * @method joinError
     *
     * @param  {Object}  packet
     *
     * @return {void}
     */

  }, {
    key: 'joinError',
    value: function joinError(packet) {
      this.state = 'error';
      this.emitter.emit('error', packet);
      this.serverClose();
    }

    /**
     * Called when subscription close is acknowledged
     * by the server
     *
     * @method leaveAck
     *
     * @return {void}
     */

  }, {
    key: 'leaveAck',
    value: function leaveAck() {
      this.state = 'closed';
      this.serverClose();
    }

    /**
     * This method is invoked, when server rejects to close
     * the subscription. The state of the socket should not
     * change here
     *
     * @method leaveError
     *
     * @param  {Object}   packet
     *
     * @return {void}
     */

  }, {
    key: 'leaveError',
    value: function leaveError(packet) {
      this.emitter.emit('leaveError', packet);
    }

    /* istanbul-ignore */
    /**
     * Add an event listener
     *
     * @method on
     */

  }, {
    key: 'on',
    value: function on() {
      var _emitter;

      (_emitter = this.emitter).on.apply(_emitter, arguments);
    }

    /* istanbul-ignore */
    /**
     * Add an event listener for once only
     *
     * @method once
     */

  }, {
    key: 'once',
    value: function once() {
      var _emitter2;

      (_emitter2 = this.emitter).once.apply(_emitter2, arguments);
    }

    /* istanbul-ignore */
    /**
     * Remove event listener(s)
     *
     * @method off
     */

  }, {
    key: 'off',
    value: function off() {
      var _emitter3;

      (_emitter3 = this.emitter).off.apply(_emitter3, arguments);
    }

    /**
     * Emit message on the subscription
     *
     * @method emit
     *
     * @param  {String} event
     * @param  {Mixed} data
     *
     * @return {void}
     */

  }, {
    key: 'emit',
    value: function emit(event, data) {
      if (this.state === 'pending') {
        this._emitBuffer.push({ event: event, data: data });
        return;
      }

      this.connection.sendEvent(this.topic, event, data);
    }

    /**
     * Closes the connection and removes all existing
     * listeners
     *
     * @method serverClose
     *
     * @return {Promise}
     */

  }, {
    key: 'serverClose',
    value: function serverClose() {
      var _this2 = this;

      return this.emitter.emit('close', this).then(function () {
        _this2._emitBuffer = [];
        _this2.emitter.clearListeners();
      }).catch(function () {
        _this2._emitBuffer = [];
        _this2.emitter.clearListeners();
      });
    }

    /**
     * Invoked when a new event is received from the server
     *
     * @method serverEvent
     *
     * @param  {String}    options.event
     * @param  {Mixed}    options.data
     *
     * @return {void}
     */

  }, {
    key: 'serverEvent',
    value: function serverEvent(_ref) {
      var event = _ref.event,
          data = _ref.data;

      this.emitter.emit(event, data);
    }

    /**
     * Received error on connection
     *
     * @method serverError
     *
     * @return {void}
     */

  }, {
    key: 'serverError',
    value: function serverError() {
      this.state = 'error';
    }

    /**
     * Sends the request on server to close the subscription, we
     * have to wait for acknowledgment too
     *
     * @method close
     *
     * @return {void}
     */

  }, {
    key: 'close',
    value: function close() {
      this.state = 'closing';
      if (process.env.NODE_ENV !== 'production') {
        Debug('closing subscription for %s topic with server', this.topic);
      }
      this.connection.sendPacket(wsp_browser.leavePacket(this.topic));
    }

    /**
     * Forcefully terminating the subscription
     *
     * @method terminate
     *
     * @return {void}
     */

  }, {
    key: 'terminate',
    value: function terminate() {
      this.leaveAck();
    }
  }, {
    key: 'state',
    get: function get$$1() {
      return this._state;
    }

    /**
     * Update socket state
     */
    ,
    set: function set$$1(state) {
      if (!this.constructor.states.indexOf(state) === -1) {
        throw new Error(state + ' is not a valid socket state');
      }
      this._state = state;
    }

    /**
     * A static array of internal states
     *
     * @method states
     *
     * @return {Array}
     */

  }], [{
    key: 'states',
    get: function get$$1() {
      return ['pending', 'open', 'closed', 'closing', 'error'];
    }
  }]);
  return Socket;
}();

/**
 * adonis-websocket-client
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/**
 * The default encoder to encode packets.
 */

var JsonEncoder = {
  name: 'json',
  /**
   * Encode a value by stringifying it
   *
   * @method encode
   *
   * @param  {Object}   payload
   * @param  {Function} callback
   *
   * @return {void}
   */
  encode: function encode(payload, callback) {
    var encoded = null;

    try {
      encoded = JSON.stringify(payload);
    } catch (error) {
      return callback(error);
    }
    callback(null, encoded);
  },


  /**
   * Decode value by parsing it
   *
   * @method decode
   *
   * @param  {String}   payload
   * @param  {Function} callback
   *
   * @return {void}
   */
  decode: function decode(payload, callback) {
    var decoded = null;

    try {
      decoded = JSON.parse(payload);
    } catch (error) {
      return callback(error);
    }
    callback(null, decoded);
  }
};

/**
 * Returns the ws protocol based upon HTTP or HTTPS
 *
 * @returns {String}
 *
 */
var wsProtocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss' : 'ws';

/**
 * Connection class is used to make a TCP/Socket connection
 * with the server. It relies on Native Websocket browser
 * support.
 *
 * @class Connection
 *
 * @param {String} url
 * @param {Object} options
 */

var Connection = function (_Emitter) {
  inherits(Connection, _Emitter);

  function Connection(url, options) {
    classCallCheck(this, Connection);

    var _this = possibleConstructorReturn(this, (Connection.__proto__ || Object.getPrototypeOf(Connection)).call(this));

    url = url || wsProtocol + '://' + window.location.host;

    /**
     * Connection options
     *
     * @type {Object}
     */
    _this.options = _extends({
      path: 'adonis-ws',
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      query: null,
      encoder: JsonEncoder
    }, options);

    if (process.env.NODE_ENV !== 'production') {
      Debug('connection options %o', _this.options);
    }

    /**
     * The state connection is in
     *
     * @type {String}
     */
    _this._connectionState = 'idle';

    /**
     * Number of reconnection attempts being made
     *
     * @type {Number}
     */
    _this._reconnectionAttempts = 0;

    /**
     * All packets are sent in sequence to the server. So we need to
     * maintain a queue and process one at a time
     *
     * @type {Array}
     */
    _this._packetsQueue = [];

    /**
     * Whether or not the queue is in process
     *
     * @type {Boolean}
     */
    _this._processingQueue = false;

    /**
     * As per Adonis protocol, the client must ping
     * the server after x interval
     *
     * @type {Timer}
     */
    _this._pingTimer = null;

    /**
     * Extended query is merged with the query params
     * user pass
     *
     * @type {Object}
     */
    _this._extendedQuery = {};

    /**
     * Base URL for the websocket connection
     *
     * @type {String}
     */
    _this._url = url.replace(/\/$/, '') + '/' + _this.options.path;

    /**
     * Subscriptions for a single connection
     *
     * @type {Object}
     */
    _this.subscriptions = {};

    /**
     * Handler called when `close` is emitted from the
     * subscription
     */
    _this.removeSubscription = function (_ref) {
      var topic = _ref.topic;

      delete _this.subscriptions[topic];
    };
    return _this;
  }

  /**
   * Computed value to decide, whether or not to reconnect
   *
   * @method shouldReconnect
   *
   * @return {Boolean}
   */


  createClass(Connection, [{
    key: '_cleanup',


    /**
     * Clean references
     *
     * @method _cleanup
     *
     * @return {void}
     *
     * @private
     */
    value: function _cleanup() {
      clearInterval(this._pingTimer);
      this.ws = null;
      this._pingTimer = null;
    }

    /**
     * Calls a callback passing subscription to it
     *
     * @method _subscriptionsIterator
     *
     * @param  {Function}             callback
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_subscriptionsIterator',
    value: function _subscriptionsIterator(callback) {
      var _this2 = this;

      Object.keys(this.subscriptions).forEach(function (sub) {
        return callback(_this2.subscriptions[sub], sub);
      });
    }

    /**
     * Calls the callback when there is a subscription for
     * the topic mentioned in the packet
     *
     * @method _ensureSubscription
     *
     * @param  {Object}            packet
     * @param  {Function}          cb
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_ensureSubscription',
    value: function _ensureSubscription(packet, cb) {
      var socket = this.getSubscription(packet.d.topic);

      if (!socket) {
        if (process.env.NODE_ENV !== 'production') {
          Debug('cannot consume packet since %s topic has no active subscription %j', packet.d.topic, packet);
        }
        return;
      }

      cb(socket, packet);
    }

    /**
     * Process the packets queue by sending one packet at a time
     *
     * @method _processQueue
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_processQueue',
    value: function _processQueue() {
      var _this3 = this;

      if (this._processingQueue || !this._packetsQueue.length) {
        return;
      }

      /**
       * Turn on the processing flag
       *
       * @type {Boolean}
       */
      this._processingQueue = true;

      this.options.encoder.encode(this._packetsQueue.shift(), function (error, payload) {
        if (error) {
          if (process.env.NODE_ENV !== 'production') {
            Debug('encode error %j', error);
          }
          return;
        }
        _this3.write(payload);

        /**
         * Turn off the processing flag and re call the processQueue to send
         * the next message
         *
         * @type {Boolean}
         */
        _this3._processingQueue = false;
        _this3._processQueue();
      });
    }

    /**
     * As soon as connection is ready, we start listening
     * for new message
     *
     * @method _onOpen
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_onOpen',
    value: function _onOpen() {
      if (process.env.NODE_ENV !== 'production') {
        Debug('opened');
      }
    }

    /**
     * When received connection error
     *
     * @method _onError
     *
     * @param  {Event} event
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_onError',
    value: function _onError(event) {
      if (process.env.NODE_ENV !== 'production') {
        Debug('error %O', event);
      }

      this._subscriptionsIterator(function (subscription) {
        return subscription.serverError();
      });
      this.emit('error', event);
    }

    /**
     * Initiates reconnect with the server by moving
     * all subscriptions to pending state
     *
     * @method _reconnect
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_reconnect',
    value: function _reconnect() {
      var _this4 = this;

      this._reconnectionAttempts++;

      this.emit('reconnect', this._reconnectionAttempts);

      setTimeout(function () {
        _this4._connectionState = 'reconnect';
        _this4.connect();
      }, this.options.reconnectionDelay * this._reconnectionAttempts);
    }

    /**
     * When connection closes
     *
     * @method _onClose
     *
     * @param  {Event} event
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_onClose',
    value: function _onClose(event) {
      var _this5 = this;

      if (process.env.NODE_ENV !== 'production') {
        Debug('closing from %s state', this._connectionState);
      }

      this._cleanup();

      /**
       * Force subscriptions to terminate
       */
      this._subscriptionsIterator(function (subscription) {
        return subscription.terminate();
      });

      this.emit('close', this).then(function () {
        _this5.shouldReconnect ? _this5._reconnect() : _this5.clearListeners();
      }).catch(function () {
        _this5.shouldReconnect ? _this5._reconnect() : _this5.clearListeners();
      });
    }

    /**
     * When a new message was received
     *
     * @method _onMessage
     *
     * @param  {Event}   event
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_onMessage',
    value: function _onMessage(event) {
      var _this6 = this;

      this.options.encoder.decode(event.data, function (decodeError, packet) {
        if (decodeError) {
          if (process.env.NODE_ENV !== 'production') {
            Debug('packet dropped, decode error %o', decodeError);
          }
          return;
        }
        _this6._handleMessage(packet);
      });
    }

    /**
     * Handles the message packet based upon it's type
     *
     * @method _handleMessage
     *
     * @param  {Object}       packet
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_handleMessage',
    value: function _handleMessage(packet) {
      if (wsp_browser.isOpenPacket(packet)) {
        if (process.env.NODE_ENV !== 'production') {
          Debug('open packet');
        }
        this._handleOpen(packet);
        return;
      }

      if (wsp_browser.isJoinAckPacket(packet)) {
        if (process.env.NODE_ENV !== 'production') {
          Debug('join ack packet');
        }
        this._handleJoinAck(packet);
        return;
      }

      if (wsp_browser.isJoinErrorPacket(packet)) {
        if (process.env.NODE_ENV !== 'production') {
          Debug('join error packet');
        }
        this._handleJoinError(packet);
        return;
      }

      if (wsp_browser.isLeaveAckPacket(packet)) {
        if (process.env.NODE_ENV !== 'production') {
          Debug('leave ack packet');
        }
        this._handleLeaveAck(packet);
        return;
      }

      if (wsp_browser.isLeaveErrorPacket(packet)) {
        if (process.env.NODE_ENV !== 'production') {
          Debug('leave error packet');
        }
        this._handleLeaveError(packet);
        return;
      }

      if (wsp_browser.isLeavePacket(packet)) {
        if (process.env.NODE_ENV !== 'production') {
          Debug('leave packet');
        }
        this._handleServerLeave(packet);
        return;
      }

      if (wsp_browser.isEventPacket(packet)) {
        if (process.env.NODE_ENV !== 'production') {
          Debug('event packet');
        }
        this._handleEvent(packet);
        return;
      }

      if (wsp_browser.isPongPacket(packet)) {
        if (process.env.NODE_ENV !== 'production') {
          Debug('pong packet');
        }
        return;
      }

      if (process.env.NODE_ENV !== 'production') {
        Debug('invalid packet type %d', packet.t);
      }
    }

    /**
     * Emits the open emit and send subscription packets
     * for pre-existing subscriptions
     *
     * @method _handleOpen
     *
     * @param  {Object}    packet
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_handleOpen',
    value: function _handleOpen(packet) {
      var _this7 = this;

      this._connectionState = 'open';
      this.emit('open', packet.d);

      /**
       * Setup a timer to ping the server, telling
       * client is awake
       */
      this._pingTimer = setInterval(function () {
        _this7.sendPacket(wsp_browser.pingPacket());
      }, packet.d.clientInterval);

      /**
       * Sending packets to make pending subscriptions
       */
      if (process.env.NODE_ENV !== 'production') {
        Debug('processing pre connection subscriptions %o', Object.keys(this.subscriptions));
      }

      this._subscriptionsIterator(function (subscription) {
        _this7._sendSubscriptionPacket(subscription.topic);
      });
    }

    /**
     * Handles the join acknowledgement for a subscription
     *
     * @method _handleJoinAck
     *
     * @param  {Object}       packet
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_handleJoinAck',
    value: function _handleJoinAck(packet) {
      this._ensureSubscription(packet, function (socket) {
        return socket.joinAck();
      });
    }

    /**
     * Handles the join error for a subscription
     *
     * @method _handleJoinError
     *
     * @param  {Object}         packet
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_handleJoinError',
    value: function _handleJoinError(packet) {
      this._ensureSubscription(packet, function (socket, packet) {
        return socket.joinError(packet.d);
      });
    }

    /**
     * Acknowledges the subscription leave
     *
     * @method _handleLeaveAck
     *
     * @param  {Object}        packet
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_handleLeaveAck',
    value: function _handleLeaveAck(packet) {
      this._ensureSubscription(packet, function (socket) {
        return socket.leaveAck();
      });
    }

    /**
     * Handles leave error for a subscription
     *
     * @method _handleLeaveError
     *
     * @param  {Object}          packet
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_handleLeaveError',
    value: function _handleLeaveError(packet) {
      this._ensureSubscription(packet, function (socket, packet) {
        return socket.leaveError(packet.d);
      });
    }

    /**
     * Handles when server initiates the subscription leave
     *
     * @method _handleServerLeave
     *
     * @param  {Object}           packet
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_handleServerLeave',
    value: function _handleServerLeave(packet) {
      this._ensureSubscription(packet, function (socket, packet) {
        return socket.leaveAck();
      });
    }

    /**
     * Handles the event packet for a subscription
     *
     * @method _handleEvent
     *
     * @param  {Object}     packet
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_handleEvent',
    value: function _handleEvent(packet) {
      this._ensureSubscription(packet, function (socket, packet) {
        return socket.serverEvent(packet.d);
      });
    }

    /**
     * Sends the subscription packet for a given topic
     *
     * @method sendSubscriptionPacket
     *
     * @param  {String}               topic
     *
     * @return {void}
     *
     * @private
     */

  }, {
    key: '_sendSubscriptionPacket',
    value: function _sendSubscriptionPacket(topic) {
      if (process.env.NODE_ENV !== 'production') {
        Debug('initiating subscription for %s topic with server', topic);
      }
      this.sendPacket(wsp_browser.joinPacket(topic));
    }

    /**
     * Instantiate the websocket connection
     *
     * @method connect
     *
     * @return {void}
     */

  }, {
    key: 'connect',
    value: function connect() {
      var _this8 = this;

      var query = queryString_3(_extends({}, this.options.query, this._extendedQuery));
      var url = query ? this._url + '?' + query : this._url;

      if (process.env.NODE_ENV !== 'production') {
        Debug('creating socket connection on %s url', url);
      }

      this.ws = new window.WebSocket(url);
      this.ws.onclose = function (event) {
        return _this8._onClose(event);
      };
      this.ws.onerror = function (event) {
        return _this8._onError(event);
      };
      this.ws.onopen = function (event) {
        return _this8._onOpen(event);
      };
      this.ws.onmessage = function (event) {
        return _this8._onMessage(event);
      };

      return this;
    }

    /**
     * Writes the payload on the open connection
     *
     * @method write
     *
     * @param  {String} payload
     *
     * @return {void}
     */

  }, {
    key: 'write',
    value: function write(payload) {
      if (this.ws.readyState !== window.WebSocket.OPEN) {
        if (process.env.NODE_ENV !== 'production') {
          Debug('connection is not in open state, current state %s', this.ws.readyState);
        }
        return;
      }

      this.ws.send(payload);
    }

    /**
     * Sends a packet by encoding it first
     *
     * @method _sendPacket
     *
     * @param  {Object}    packet
     *
     * @return {void}
     */

  }, {
    key: 'sendPacket',
    value: function sendPacket(packet) {
      this._packetsQueue.push(packet);
      this._processQueue();
    }

    /**
     * Returns the subscription instance for a given topic
     *
     * @method getSubscription
     *
     * @param  {String}        topic
     *
     * @return {Socket}
     */

  }, {
    key: 'getSubscription',
    value: function getSubscription(topic) {
      return this.subscriptions[topic];
    }

    /**
     * Returns a boolean telling, whether connection has
     * a subscription for a given topic or not
     *
     * @method hasSubcription
     *
     * @param  {String}       topic
     *
     * @return {Boolean}
     */

  }, {
    key: 'hasSubcription',
    value: function hasSubcription(topic) {
      return !!this.getSubscription(topic);
    }

    /**
     * Create a new subscription with the server
     *
     * @method subscribe
     *
     * @param  {String}  topic
     *
     * @return {Socket}
     */

  }, {
    key: 'subscribe',
    value: function subscribe(topic) {
      if (!topic || typeof topic !== 'string') {
        throw new Error('subscribe method expects topic to be a valid string');
      }

      if (this.subscriptions[topic]) {
        throw new Error('Cannot subscribe to same topic twice. Instead use getSubscription');
      }

      var socket = new Socket(topic, this);
      socket.on('close', this.removeSubscription);

      /**
       * Storing reference to the socket
       */
      this.subscriptions[topic] = socket;

      /**
       * Sending join request to the server, the subscription will
       * be considered ready, once server acknowledges it
       */
      if (this._connectionState === 'open') {
        this._sendSubscriptionPacket(topic);
      }

      return socket;
    }

    /**
     * Sends event for a given topic
     *
     * @method sendEvent
     *
     * @param  {String}  topic
     * @param  {String}  event
     * @param  {Mixed}  data
     *
     * @return {void}
     *
     * @throws {Error} If topic or event are not passed
     * @throws {Error} If there is no active subscription for the given topic
     */

  }, {
    key: 'sendEvent',
    value: function sendEvent(topic, event, data) {
      if (!topic || !event) {
        throw new Error('topic and event name is required to call sendEvent method');
      }

      /**
       * Make sure there is an active subscription for the topic. Though server will
       * bounce the message, there is no point in hammering it
       */
      var subscription = this.getSubscription(topic);
      if (!subscription) {
        throw new Error('There is no active subscription for ' + topic + ' topic');
      }

      /**
       * If subscription state is not open, then we should not publish
       * messages.
       *
       * The reason we have this check on connection and not socket,
       * is coz we don't want anyone to use the connection object
       * and send packets, even when subscription is closed.
       */
      if (subscription.state !== 'open') {
        throw new Error('Cannot emit since subscription socket is in ' + this.state + ' state');
      }

      if (process.env.NODE_ENV !== 'production') {
        Debug('sending event on %s topic', topic);
      }

      this.sendPacket(wsp_browser.eventPacket(topic, event, data));
    }

    /**
     * Use JWT token to authenticate the user
     *
     * @method withJwtToken
     *
     * @param {String} token
     *
     * @chainable
     */

  }, {
    key: 'withJwtToken',
    value: function withJwtToken(token) {
      this._extendedQuery.token = token;
      return this;
    }

    /**
     * Use basic auth credentials to login the user
     *
     * @method withBasicAuth
     *
     * @param  {String}  username
     * @param  {String}  password
     *
     * @chainable
     */

  }, {
    key: 'withBasicAuth',
    value: function withBasicAuth(username, password) {
      this._extendedQuery.basic = window.btoa(username + ':' + password);
      return this;
    }

    /**
     * Use personal API token to authenticate the user
     *
     * @method withApiToken
     *
     * @param {String} token
     *
     * @return {String}
     */

  }, {
    key: 'withApiToken',
    value: function withApiToken(token) {
      this._extendedQuery.token = token;
      return this;
    }

    /**
     * Forcefully close the connection
     *
     * @method close
     *
     * @return {void}
     */

  }, {
    key: 'close',
    value: function close() {
      this._connectionState = 'terminated';
      this.ws.close();
    }
  }, {
    key: 'shouldReconnect',
    get: function get$$1() {
      return this._connectionState !== 'terminated' && this.options.reconnection && this.options.reconnectionAttempts > this._reconnectionAttempts;
    }
  }]);
  return Connection;
}(emittery);

function index (url, options) {
  return new Connection(url, options);
}

export default index;
