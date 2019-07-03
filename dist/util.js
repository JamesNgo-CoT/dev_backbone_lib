"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* global $ */
////////////////////////////////////////////////////////////////////////////////

/* exported toQueryString */
function toQueryString(queryObject) {
  if (Array.isArray(queryObject)) {
    var array = [];

    for (var index = 0, length = queryObject.length; index < length; index++) {
      array.push(encodeURIComponent(toQueryString(queryObject[index])));
    }

    return array.join(',');
  }

  if (_typeof(queryObject) === 'object' && queryObject !== null) {
    var _array = [];

    for (var key in queryObject) {
      if (Object.prototype.hasOwnProperty.call(queryObject, key)) {
        _array.push("".concat(key, "=").concat(encodeURIComponent(toQueryString(queryObject[key]))));
      }
    }

    return _array.join('&');
  }

  var prefix = '';

  switch (_typeof(queryObject)) {
    case 'undefined':
      prefix = 'u';
      break;

    case 'boolean':
      prefix = 'b';
      break;

    case 'number':
      prefix = 'n';
      break;

    case 'function':
      prefix = 'f';
      break;

    case 'object':
      prefix = 'o';
      break;

    default:
      prefix = 's';
  }

  return "".concat(prefix).concat(String(queryObject));
}
/* exported toQueryObject */


function toQueryObject(queryString) {
  if (typeof queryString !== 'string') {
    return queryString;
  }

  if (queryString.indexOf(',') !== -1) {
    var array = queryString.split(',');

    for (var index = 0, length = array.length; index < length; index++) {
      array[index] = toQueryObject(decodeURIComponent(array[index]));
    }

    return array;
  }

  if (queryString.indexOf('=') !== -1) {
    var object = {};

    var _array2 = queryString.split('&');

    for (var _index = 0, _length = _array2.length; _index < _length; _index++) {
      var pair = _array2[_index].split('=');

      object[pair[0]] = toQueryObject(decodeURIComponent(pair[1]));
    }

    return object;
  }

  var prefix = queryString.charAt(0);
  var value = queryString.slice(1);

  switch (prefix) {
    case 'u':
      return undefined;

    case 'b':
      return Boolean(value);

    case 'n':
      return Number(value);

    case 'f':
      return new Function("return ".concat(value))();

    case 'o':
      return null;

    default:
      return value;
  }
} ////////////////////////////////////////////////////////////////////////////////

/* exported escapeODataValue */


function escapeODataValue(str) {
  return str.replace(/'/g, "''").replace(/%/g, "%25").replace(/\+/g, "%2B").replace(/\//g, "%2F").replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/&/g, "%26").replace(/\[/g, "%5B").replace(/\]/g, "%5D").replace(/\s/g, "%20");
} ////////////////////////////////////////////////////////////////////////////////

/* exported swapView */


function swapView(element, newView, oldView) {
  element.style.height = getComputedStyle(element).height;
  element.style.overflow = 'hidden';

  if (oldView) {
    oldView.remove();
  }

  element.appendChild(newView.el);
  newView.render();
  element.style.removeProperty('overflow');
  element.style.removeProperty('height');
  return newView;
}
/* exported ajax */


function ajax(options) {
  return new Promise(function (resolve, reject) {
    $.ajax(options).then(function (data, textStatus, jqXHR) {
      resolve(data);
    }, function (jqXHR, textStatus, errorThrown) {
      reject(errorThrown);
    });
  });
} ////////////////////////////////////////////////////////////////////////////////

/* exported adjustArgs */


var adjustArgs = function adjustArgs() {
  var returnValue = [];

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var signature = args.pop();
  var argIndex = 0;

  for (var index = 0, length = signature.length; index < length; index++) {
    if (args[argIndex] == null) {
      argIndex = argIndex + 1;
    } else if (signature[index] === 'array' && Array.isArray(args[argIndex])) {
      returnValue[index] = args[argIndex];
      argIndex = argIndex + 1;
    } else if (_typeof(args[argIndex]) === signature[index]) {
      returnValue[index] = args[argIndex];
      argIndex = argIndex + 1;
    }
  }

  return returnValue;
};