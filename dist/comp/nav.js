"use strict";

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* global _ */

/* global BaseModel BaseCollection BaseView */

/* exported NavItemModel */
var NavItemModel =
/*#__PURE__*/
function (_BaseModel) {
  _inherits(NavItemModel, _BaseModel);

  function NavItemModel() {
    _classCallCheck(this, NavItemModel);

    return _possibleConstructorReturn(this, _getPrototypeOf(NavItemModel).apply(this, arguments));
  }

  _createClass(NavItemModel, [{
    key: "defaults",
    value: function defaults() {
      return {
        title: 'Untitled',
        fragment: '',
        isActive: false,
        isVisible: true,
        requiresLogin: false
      };
    }
  }]);

  return NavItemModel;
}(BaseModel);
/* exported NavItemView */


var NavItemView =
/*#__PURE__*/
function (_BaseView) {
  _inherits(NavItemView, _BaseView);

  function NavItemView() {
    _classCallCheck(this, NavItemView);

    return _possibleConstructorReturn(this, _getPrototypeOf(NavItemView).apply(this, arguments));
  }

  _createClass(NavItemView, [{
    key: "initialize",
    value: function initialize(options) {
      var _this = this;

      this.listenTo(options.model, 'change', function () {
        _this.render();
      });

      _get(_getPrototypeOf(NavItemView.prototype), "initialize", this).call(this, options);
    }
  }, {
    key: "tagName",
    value: function tagName() {
      return 'li';
    }
  }, {
    key: "attributes",
    value: function attributes() {
      return {
        role: 'presentation'
      };
    }
  }, {
    key: "render",
    value: function render() {
      this.el.innerHTML = "<a href=\"#".concat(this.model.escape('fragment'), "\">").concat(this.model.escape('title'), "</a>");

      if (this.model.get('isActive')) {
        this.el.classList.add('active');
      } else {
        this.el.classList.remove('active');
      }

      if (this.model.get('isVisible')) {
        this.el.classList.remove('hide');
      } else {
        this.el.classList.add('hide');
      }

      _get(_getPrototypeOf(NavItemView.prototype), "render", this).call(this);
    }
  }]);

  return NavItemView;
}(BaseView);
/* exported AuthyNavItemView */


var AuthyNavItemView =
/*#__PURE__*/
function (_NavItemView) {
  _inherits(AuthyNavItemView, _NavItemView);

  function AuthyNavItemView() {
    _classCallCheck(this, AuthyNavItemView);

    return _possibleConstructorReturn(this, _getPrototypeOf(AuthyNavItemView).apply(this, arguments));
  }

  _createClass(AuthyNavItemView, [{
    key: "initialize",
    value: function initialize(options) {
      var _this2 = this;

      var authModel = _.result(this, 'authModel');

      this.listenTo(authModel, 'change', function () {
        _this2.render();
      });
      return _get(_getPrototypeOf(AuthyNavItemView.prototype), "initialize", this).call(this, options);
    }
  }, {
    key: "render",
    value: function render() {
      _get(_getPrototypeOf(AuthyNavItemView.prototype), "render", this).call(this);

      var authModel = _.result(this, 'authModel');

      if (authModel.isLoggedIn()) {
        this.el.classList.remove('hide');
      } else {
        this.el.classList.add('hide');
      }
    }
  }]);

  return AuthyNavItemView;
}(NavItemView);
/* exported NavCollection */


var NavCollection =
/*#__PURE__*/
function (_BaseCollection) {
  _inherits(NavCollection, _BaseCollection);

  function NavCollection() {
    _classCallCheck(this, NavCollection);

    return _possibleConstructorReturn(this, _getPrototypeOf(NavCollection).apply(this, arguments));
  }

  _createClass(NavCollection, [{
    key: "model",
    value: function model(attributes, options) {
      return new NavItemModel(attributes, options);
    }
  }, {
    key: "setActive",
    value: function setActive(index) {
      this.each(function (model, modelIndex) {
        if (index === modelIndex) {
          model.set('isActive', true);
        } else {
          model.set('isActive', false);
        }
      });
    }
  }]);

  return NavCollection;
}(BaseCollection);
/* exported NavView */


var NavView =
/*#__PURE__*/
function (_BaseView2) {
  _inherits(NavView, _BaseView2);

  function NavView() {
    _classCallCheck(this, NavView);

    return _possibleConstructorReturn(this, _getPrototypeOf(NavView).apply(this, arguments));
  }

  _createClass(NavView, [{
    key: "preinitialize",
    value: function preinitialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // New property-factory override
      this.navItemView = options.navItemView || this.navItemView; // New property

      this.navItems = [];

      _get(_getPrototypeOf(NavView.prototype), "preinitialize", this).call(this, options);
    }
  }, {
    key: "initialize",
    value: function initialize(options) {
      var _this3 = this;

      this.listenTo(options.collection, 'update', function () {
        _this3.render();
      });

      _get(_getPrototypeOf(NavView.prototype), "initialize", this).call(this, options);
    }
  }, {
    key: "attributes",
    value: function attributes() {
      return {
        role: 'navigation'
      };
    }
  }, {
    key: "removeNavItems",
    value: function removeNavItems() {
      this.navItems.forEach(function (navItem) {
        return navItem.remove();
      });
      this.navItems = [];
    }
  }, {
    key: "remove",
    value: function remove() {
      this.removeNavItems();

      _get(_getPrototypeOf(NavView.prototype), "remove", this).call(this);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      this.removeNavItems();

      while (this.el.firstChild) {
        this.removeChild(this.el.firstChild);
      }

      var wrapper = this.el.appendChild(document.createElement('ul'));
      wrapper.classList.add('nav', 'nav-tabs');

      var authModel = _.result(this, 'authModel');

      this.collection.each(function (model) {
        var navItemView;

        if (model.get('requiresLogin')) {
          if (authModel) {
            navItemView = new AuthyNavItemView({
              model: model,
              authModel: authModel
            });
          }
        } else {
          navItemView = new NavItemView({
            model: model
          });
        }

        if (navItemView) {
          wrapper.appendChild(navItemView.el);
          navItemView.render();

          _this4.navItems.push(navItemView);
        }
      });

      _get(_getPrototypeOf(NavView.prototype), "render", this).call(this);
    }
  }]);

  return NavView;
}(BaseView);