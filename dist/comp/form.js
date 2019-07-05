"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

/* global $ _ CotForm BaseView AlertModel AlertView */

/* exported FormView */
var FormView =
/*#__PURE__*/
function (_BaseView) {
  _inherits(FormView, _BaseView);

  function FormView() {
    _classCallCheck(this, FormView);

    return _possibleConstructorReturn(this, _getPrototypeOf(FormView).apply(this, arguments));
  }

  _createClass(FormView, [{
    key: "preinitialize",
    value: function preinitialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // New property-factory override
      this.formDefinition = options.formDefinition || this.formDefinition;
      this.rootPath = options.rootPath || this.rootPath;
      this.success = options.success || this.success; // New properties

      this.cotForm = null;
      this.form = null;
      this.formValidator = null;

      _get(_getPrototypeOf(FormView.prototype), "preinitialize", this).call(this, options);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      while (this.el.firstChild) {
        this.removeChild(this.el.firstChild);
      }

      var formDefinition = _.result(this, 'formDefinition');

      formDefinition.id = _.result(formDefinition, 'id') || FormView.uniqueId;
      formDefinition.rootPath = _.result(formDefinition, 'rootPath') || _.result(this, 'rootPath');
      formDefinition.useBinding = true;

      formDefinition.success = formDefinition.success || function (event) {
        event.preventDefault();

        _this.success();

        return false;
      };

      this.cotForm = new CotForm(formDefinition);
      this.cotForm.setModel(this.model);
      this.cotForm.setView(this);
      return Promise.resolve().then(function () {
        return _this.cotForm.render({
          target: _this.el
        });
      }).then(function () {
        _this.form = _this.el.querySelector('form');
        _this.formValidator = $(_this.form).data('formValidation');
        return _get(_getPrototypeOf(FormView.prototype), "render", _this).call(_this, _this);
      });
    }
  }, {
    key: "success",
    value: function success() {
      this.trigger('success');
    }
  }, {
    key: "showAlert",
    value: function showAlert(message, sectionIndex) {
      var parentNode = this.form;

      if (sectionIndex != null) {
        parentNode = parentNode.querySelectorAll('.panel-body')[sectionIndex];
      }

      var model = new AlertModel({
        message: message
      });
      var alertView = new AlertView({
        model: model
      });
      parentNode.insertBefore(alertView.el, parentNode.firstChild);
      alertView.render();
    }
  }], [{
    key: "uniqueId",
    get: function get() {
      if (FormView._uniqueId == null) {
        FormView._uniqueId = 0;
      }

      return "FormView_".concat(FormView._uniqueId++);
    }
  }]);

  return FormView;
}(BaseView);