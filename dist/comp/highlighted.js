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

/* exported HighlightedModel */
var HighlightedModel =
/*#__PURE__*/
function (_BaseModel) {
  _inherits(HighlightedModel, _BaseModel);

  function HighlightedModel() {
    _classCallCheck(this, HighlightedModel);

    return _possibleConstructorReturn(this, _getPrototypeOf(HighlightedModel).apply(this, arguments));
  }

  _createClass(HighlightedModel, [{
    key: "defaults",
    value: function defaults() {
      return {
        content: '<p>HTML CONTENT</p>'
      };
    }
  }]);

  return HighlightedModel;
}(BaseModel);
/* exported HighlightedView */


var HighlightedView =
/*#__PURE__*/
function (_BaseView) {
  _inherits(HighlightedView, _BaseView);

  function HighlightedView() {
    _classCallCheck(this, HighlightedView);

    return _possibleConstructorReturn(this, _getPrototypeOf(HighlightedView).apply(this, arguments));
  }

  _createClass(HighlightedView, [{
    key: "initialize",
    value: function initialize(options) {
      var _this = this;

      this.listenTo(options.model, 'change', function () {
        _this.render();
      });

      _get(_getPrototypeOf(HighlightedView.prototype), "initialize", this).call(this, options);
    }
  }, {
    key: "render",
    value: function render() {
      this.el.innerHTML = this.model.get('content');

      _get(_getPrototypeOf(HighlightedView.prototype), "render", this).call(this);
    }
  }]);

  return HighlightedView;
}(BaseView);