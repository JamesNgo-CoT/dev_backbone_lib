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

/* global BaseModel BaseView */

/* exported AlertModel */
var AlertModel =
/*#__PURE__*/
function (_BaseModel) {
  _inherits(AlertModel, _BaseModel);

  function AlertModel() {
    _classCallCheck(this, AlertModel);

    return _possibleConstructorReturn(this, _getPrototypeOf(AlertModel).apply(this, arguments));
  }

  _createClass(AlertModel, [{
    key: "defaults",
    value: function defaults() {
      return {
        message: '<p>MESSAGE</p>'
      };
    }
  }]);

  return AlertModel;
}(BaseModel);
/* exported AlertView */


var AlertView =
/*#__PURE__*/
function (_BaseView) {
  _inherits(AlertView, _BaseView);

  function AlertView() {
    _classCallCheck(this, AlertView);

    return _possibleConstructorReturn(this, _getPrototypeOf(AlertView).apply(this, arguments));
  }

  _createClass(AlertView, [{
    key: "preinitialize",
    value: function preinitialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.attributes = options.attributes || {
        role: 'alert'
      };

      _get(_getPrototypeOf(AlertView.prototype), "preinitialize", this).call(this, options);
    }
  }, {
    key: "initialize",
    value: function initialize(options) {
      var _this = this;

      this.listenTo(options.model, 'change', function () {
        _this.render();
      });

      _get(_getPrototypeOf(AlertView.prototype), "initialize", this).call(this, options);
    }
  }, {
    key: "className",
    value: function className() {
      return 'alert-danger';
    }
  }, {
    key: "render",
    value: function render() {
      while (this.el.firstChild) {
        this.removeChild(this.el.firstChild);
      }

      this.el.classList.add('alert', 'alert-dismissible');
      var messageElementButton = this.el.appendChild(document.createElement('button'));
      messageElementButton.classList.add('close');
      messageElementButton.setAttribute('type', 'button');
      messageElementButton.setAttribute('data-dismiss', 'alert');
      messageElementButton.setAttribute('aria-label', 'Close');
      var messageElementButtonTimes = messageElementButton.appendChild(document.createElement('span'));
      messageElementButtonTimes.setAttribute('aria-hidden', 'true');
      messageElementButtonTimes.innerHTML = '&times;';
      var innerMessageElement = this.el.appendChild(document.createElement('div'));
      innerMessageElement.innerHTML = this.model.get('message');

      _get(_getPrototypeOf(AlertView.prototype), "render", this).call(this);
    }
  }]);

  return AlertView;
}(BaseView);