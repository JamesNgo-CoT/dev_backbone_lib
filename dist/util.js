"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* global $ */

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
}
/* exported escapeODataValue */


function escapeODataValue(str) {
  return str.replace(/'/g, "''").replace(/%/g, "%25").replace(/\+/g, "%2B").replace(/\//g, "%2F").replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/&/g, "%26").replace(/\[/g, "%5B").replace(/\]/g, "%5D").replace(/\s/g, "%20");
}
/* exported swapView */


function swapView(element, oldView, newView) {
  element.style.height = getComputedStyle(element).height;
  element.style.overflow = 'hidden';

  if (oldView) {
    oldView.remove();
  }

  Promise.resolve().then(function () {
    if (newView) {
      element.appendChild(newView.el);
      return newView.render();
    }
  }).then(function () {
    element.style.removeProperty('overflow');
    element.style.removeProperty('height');
  });
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
}
/* exported el */


function el(tag, attrs, childEls, cbk) {
  // Create element.
  var element = document.createElement(tag); // Set attributes

  element._attrs = attrs;

  element.attr = function (name) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (this._attrs == null) {
      this._attrs = {};
    }

    if (this._attrs[name] !== value) {
      if (value === null) {
        delete this._attrs[name];
      } else {
        this._attrs[name] = value;
      }
    }

    if (typeof value === 'function') {
      value = value.call(this);
    }

    if (value === null) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value);
    }

    return this;
  };

  element.attrs = function (attrs) {
    if (this._attrs !== attrs) {
      this._attrs = attrs;
    }

    if (attrs != null) {
      for (var name in attrs) {
        var value = attrs[name];
        this.attr(name, value);
      }
    }

    return this;
  }; // Create children elements.


  element._childEls = childEls;

  element.childEls = function (childEls) {
    var _this = this;

    if (this._childEls !== childEls) {
      this._childEls = childEls;
    }

    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }

    if (childEls !== null) {
      var fromFunction = false;

      if (typeof childEls === 'function') {
        childEls = childEls.call(this);
        fromFunction = true;
      }

      if (!Array.isArray(childEls)) {
        childEls = [childEls];
      }

      childEls.forEach(function (child) {
        var fromFunction2 = false;

        if (typeof child === 'function') {
          child = child.call(_this);
          fromFunction2 = true;
        }

        if (child instanceof HTMLElement) {
          _this.appendChild(child);

          if (!fromFunction && !fromFunction2 && child.render != null) {
            child.render();
          }
        } else {
          _this.appendChild(document.createTextNode(String(child)));
        }
      });
    }

    return this;
  };

  element._cbk = cbk;

  element.cbk = function (cbk) {
    if (this._cbk !== cbk) {
      this._cbk = cbk;
    }

    if (cbk != null) {
      cbk.call(this, this);
    }

    return this;
  };

  element.render = function () {
    this.attrs(this._attrs);
    this.childEls(this._childEls);
    this.cbk(this._cbk);
    return this;
  };

  return element.render();
}

['a', 'abbr', 'address', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'comment', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'].forEach(function (tag) {
  return el[tag] = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return el.apply(void 0, [tag].concat(args));
  };
});