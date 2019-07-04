"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* global _ Backbone */

/* exported BaseRouter */
var BaseRouter =
/*#__PURE__*/
function (_Backbone$Router) {
  _inherits(BaseRouter, _Backbone$Router);

  function BaseRouter() {
    _classCallCheck(this, BaseRouter);

    return _possibleConstructorReturn(this, _getPrototypeOf(BaseRouter).apply(this, arguments));
  }

  _createClass(BaseRouter, [{
    key: "preinitialize",
    value: function preinitialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // New property-factory override
      this.defaultFragment = options.defaultFragment || this.defaultFragment; // New property

      this.lastFragment = null;
      this.cleanupFunction = null;

      _get(_getPrototypeOf(BaseRouter.prototype), "preinitialize", this).call(this, options);
    }
  }, {
    key: "routes",
    value: function routes() {
      var _ref;

      return _ref = {}, _defineProperty(_ref, 'home', function home() {}), _defineProperty(_ref, '*default', 'routeDefault'), _ref;
    }
  }, {
    key: "route",
    value: function route(_route, name, callback) {
      var oldCallback;

      if (typeof callback === 'function') {
        oldCallback = callback;
      } else if (typeof name === 'function') {
        oldCallback = name;
      } else if (typeof name === 'string' && typeof this[name] === 'function') {
        oldCallback = this[name];
      }

      if (typeof oldCallback === 'function' && oldCallback !== this.routeDefault) {
        var newCallback = function newCallback() {
          var _oldCallback;

          this.lastFragment = Backbone.history.getFragment();

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return (_oldCallback = oldCallback).call.apply(_oldCallback, [this].concat(args));
        };

        if (typeof callback === 'function') {
          callback = newCallback;
        } else if (typeof name === 'function') {
          name = newCallback;
        } else if (typeof name === 'string' && typeof this[name] === 'function') {
          this[name] = newCallback;
        }
      }

      return _get(_getPrototypeOf(BaseRouter.prototype), "route", this).call(this, _route, name, callback);
    }
  }, {
    key: "execute",
    value: function execute(callback, args, name) {
      var _this = this;

      var cleanupFunctionReturnValue;

      if (typeof this.cleanupFunction === 'function') {
        cleanupFunctionReturnValue = this.cleanupFunction.call(this);

        if (cleanupFunctionReturnValue !== false) {
          this.cleanupFunction = null;
        }
      }

      if (typeof callback === 'function' && cleanupFunctionReturnValue !== false) {
        Promise.resolve().then(function () {
          return callback.call.apply(callback, [_this].concat(_toConsumableArray(args)));
        }).then(function (cleanupFunction) {
          if (typeof cleanupFunction === 'function') {
            _this.cleanupFunction = cleanupFunction;
          }
        });
      }

      if (cleanupFunctionReturnValue === false) {
        this.routeDefault();
      }
    }
  }, {
    key: "defaultFragment",
    value: function defaultFragment() {
      return 'home';
    }
  }, {
    key: "routeDefault",
    value: function routeDefault() {
      if (typeof this.lastFragment === 'string') {
        this.navigate(this.lastFragment, {
          trigger: false,
          replace: true
        });
      } else {
        var defaultFragment = _.result(this, 'defaultFragment');

        if (typeof defaultFragment === 'string') {
          this.navigate(defaultFragment, {
            trigger: true
          });
        }
      }
    }
  }]);

  return BaseRouter;
}(Backbone.Router);