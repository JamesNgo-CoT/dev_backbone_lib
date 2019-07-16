/* global $ */

/* exported toQueryString */
function toQueryString(queryObject) {
  if (Array.isArray(queryObject)) {
    const array = [];
    for (let index = 0, length = queryObject.length; index < length; index++) {
      array.push(encodeURIComponent(toQueryString(queryObject[index])));
    }
    return array.join(',');
  }

  if (typeof queryObject === 'object' && queryObject !== null) {
    const array = [];
    for (const key in queryObject) {
      if (Object.prototype.hasOwnProperty.call(queryObject, key)) {
        array.push(`${key}=${encodeURIComponent(toQueryString(queryObject[key]))}`);
      }
    }
    return array.join('&');
  }

  let prefix = '';
  switch (typeof queryObject) {
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
  return `${prefix}${String(queryObject)}`;
}

/* exported toQueryObject */
function toQueryObject(queryString) {
  if (typeof queryString !== 'string') {
    return queryString;
  }

  if (queryString.indexOf(',') !== -1) {
    const array = queryString.split(',');
    for (let index = 0, length = array.length; index < length; index++) {
      array[index] = toQueryObject(decodeURIComponent(array[index]));
    }
    return array;
  }

  if (queryString.indexOf('=') !== -1) {
    const object = {};
    const array = queryString.split('&');
    for (let index = 0, length = array.length; index < length; index++) {
      const pair = array[index].split('=');
      object[pair[0]] = toQueryObject(decodeURIComponent(pair[1]));
    }
    return object;
  }

  const prefix = queryString.charAt(0);
  const value = queryString.slice(1);
  switch (prefix) {
    case 'u':
      return undefined;
    case 'b':
      return Boolean(value);
    case 'n':
      return Number(value);
    case 'f':
      return (new Function(`return ${value}`))();
    case 'o':
      return null;
    default:
      return value;
  }
}

/* exported escapeODataValue */
function escapeODataValue(str) {
  return str
    .replace(/'/g, "''")
    .replace(/%/g, "%25")
    .replace(/\+/g, "%2B")
    .replace(/\//g, "%2F")
    .replace(/\?/g, "%3F")
    .replace(/#/g, "%23")
    .replace(/&/g, "%26")
    .replace(/\[/g, "%5B")
    .replace(/\]/g, "%5D")
    .replace(/\s/g, "%20");
}

/* exported swapView */
function swapView(element, oldView, newView) {
  element.style.height = getComputedStyle(element).height;
  element.style.overflow = 'hidden';

  if (oldView) {
    oldView.remove();
  }

  Promise.resolve()
    .then(() => {
      if (newView) {
        element.appendChild(newView.el);
        return newView.render();
      }
    })
    .then(() => {
      element.style.removeProperty('overflow');
      element.style.removeProperty('height');
    });

  return newView;
}

/* exported ajax */
function ajax(options) {
  return new Promise((resolve, reject) => {
    $.ajax(options)
      .then((data, textStatus, jqXHR) => {
        resolve(data);
      }, (jqXHR, textStatus, errorThrown) => {
        reject(errorThrown);
      });
  });
}

/* exported el */
function el(tag, attrs, childEls, cbk) {

  // Create element.
  const element = document.createElement(tag);

  // Set attributes
  element._attrs = attrs;
  element.attr = function (name, value = '') {
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
  }
  element.attrs = function (attrs) {
    if (this._attrs !== attrs) {
      this._attrs = attrs
    }
    if (attrs != null) {
      for (const name in attrs) {
        const value = attrs[name];
        this.attr(name, value);
      }
    }
    return this;
  }

  // Create children elements.
  element._childEls = childEls;
  element.childEls = function (childEls) {
    if (this._childEls !== childEls) {
      this._childEls = childEls;
    }
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    if (childEls !== null) {
      let fromFunction = false;
      if (typeof childEls === 'function') {
        childEls = childEls.call(this);
        fromFunction = true;
      }
      if (!Array.isArray(childEls)) {
        childEls = [childEls];
      }
      const fragment = document.createDocumentFragment();
      childEls.forEach(child => {
        let fromFunction2 = false;
        if (typeof child === 'function') {
          child = child.call(this);
          fromFunction2 = true;
        }
        if (child instanceof HTMLElement) {
          fragment.appendChild(child);
          if (!fromFunction && !fromFunction2 && child.render != null) {
            child.render();
          }
        } else {
          fragment.appendChild(document.createTextNode(String(child)));
        }
      });
      this.appendChild(fragment);
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
  }

  return element.render();
}

['a', 'abbr', 'address', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
  'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'comment', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog',
  'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
  'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link',
  'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p',
  'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source',
  'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'time', 'title',
  'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'].forEach(tag => el[tag] = (...args) => el(tag, ...args));
