"use strict";

/* global ajax */
if (window.cot_app) {
  var originalRender = window.cot_app.prototype.render;

  window.cot_app.prototype.render = function () {
    this.titleElement = document.createElement('span');
    this.titleElement.setAttribute('tabindex', '-1');
    document.querySelector('#app-header h1').appendChild(this.titleElement);
    return originalRender.call(this);
  };

  window.cot_app.prototype.setTitle = function (title, subTitle) {
    if (this.titleElement == null) {
      return;
    }

    this.titleElement.innerHTML = title;
    var documentTitles = [this.name];

    if (documentTitles.indexOf(title) === -1) {
      documentTitles.unshift(title);
    }

    if (subTitle != null) {
      documentTitles.unshift(subTitle);
    }

    document.title = documentTitles.filter(function (title) {
      return title;
    }).join(' - ');
  };
} ////////////////////////////////////////////////////////////////////////////////


if (window.cot_form) {
  var originalAddformfield = window.cot_form.prototype.addformfield;

  window.cot_form.prototype.addformfield = function (fieldDefinition, fieldContainer) {
    originalAddformfield.call(this, fieldDefinition, fieldContainer);

    if (fieldDefinition['readOnly'] === true) {
      switch (fieldDefinition['type']) {
        case 'email':
        case 'number':
        case 'password':
        case 'text':
          fieldContainer.querySelector("[type=\"".concat(fieldDefinition['type'], "\"]")).setAttribute('readonly', '');
          break;

        case 'phone':
          fieldContainer.querySelector('[type="tel"]').setAttribute('readonly', '');
          break;

        case 'textarea':
          fieldContainer.querySelector('textarea').setAttribute('readonly', '');
          break;
      }
    }
  };

  var originalValidatorOptions = window.cot_form.prototype.validatorOptions;

  window.cot_form.prototype.validatorOptions = function (fieldDefinition) {
    var returnValue = originalValidatorOptions.call(this, fieldDefinition);

    if (fieldDefinition['excluded'] != null) {
      returnValue['excluded'] = fieldDefinition['excluded'];
    }

    return returnValue;
  };
} ////////////////////////////////////////////////////////////////////////////////


if (window.CotForm) {
  var _originalRender = window.CotForm.prototype.render;

  window.CotForm.prototype.render = function () {
    var _this2 = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    function renderLoop(_ref) {
      var definition = _ref.definition,
          renderSection = _ref.renderSection,
          renderRow = _ref.renderRow,
          renderField = _ref.renderField;
      var renderPromises = [];
      var sections = definition.sections;
      sections.forEach(function (section) {
        renderPromises.push(renderSection({
          definition: definition,
          section: section
        }));
        var rows = section.rows;
        rows.forEach(function (row) {
          renderPromises.push(renderRow({
            definition: definition,
            section: section,
            row: row
          }));
          var fields = row.fields;

          if (fields) {
            fields.forEach(function (field) {
              renderPromises.push(renderField({
                definition: definition,
                section: section,
                row: row,
                field: field
              }));
            });
          }

          var grid = row.grid;

          if (grid) {
            var _fields = grid.fields;

            _fields.forEach(function (field) {
              renderPromises.push(renderField({
                definition: definition,
                section: section,
                row: row,
                field: field,
                grid: grid
              }));
            });
          }

          var repeatControl = row.repeatControl;

          if (repeatControl) {
            var repeatControlRows = repeatControl.rows;
            repeatControlRows.forEach(function (repeatControlRow) {
              var fields = row.fields;
              fields.forEach(function (field) {
                renderPromises.push(renderField({
                  definition: definition,
                  section: section,
                  row: row,
                  field: field,
                  repeatControl: repeatControl,
                  repeatControlRow: repeatControlRow
                }));
              });
            });
          }
        });
      });
      return Promise.all(renderPromises);
    }

    function finalizeRenderer(renderer) {
      if (typeof renderer === 'function') {
        return renderer;
      } else if (typeof renderer === 'string') {
        if (renderer.indexOf('function(') === 0) {
          return Function("return ".concat(renderer))();
        } else if (typeof window[renderer] === 'function') {
          return window[renderer];
        }
      }
    }

    var cotForm = this;
    var model = cotForm.getModel();
    var view = cotForm.getView();
    var definition = this._definition;
    return Promise.resolve().then(function () {
      return renderLoop({
        definition: definition,
        renderSection: function renderSection(_ref2) {
          var definition = _ref2.definition,
              section = _ref2.section;
          var renderer = finalizeRenderer(section.preRender);

          if (renderer) {
            return renderer.call(this, {
              cotForm: cotForm,
              model: model,
              view: view,
              definition: definition,
              section: section
            });
          }
        },
        renderRow: function renderRow(_ref3) {
          var definition = _ref3.definition,
              section = _ref3.section,
              row = _ref3.row;
          var renderer = finalizeRenderer(row.preRender);

          if (renderer) {
            return renderer.call(this, {
              cotForm: cotForm,
              model: model,
              view: view,
              definition: definition,
              section: section,
              row: row
            });
          }
        },
        renderField: function renderField(_ref4) {
          var _this = this;

          var definition = _ref4.definition,
              section = _ref4.section,
              row = _ref4.row,
              field = _ref4.field,
              grid = _ref4.grid,
              repeatControl = _ref4.repeatControl,
              repeatControlRow = _ref4.repeatControlRow;
          return Promise.resolve().then(function () {
            if (typeof field.choices === 'string') {
              return ajax({
                url: field.choices
              }).then(function (data) {
                field.choices = data;
              });
            }
          }).then(function () {
            if (field.choices) {
              var value;

              if (field.value != null) {
                value = field.value;
              } else if (field.bindTo != null && model.has(field.bindTo)) {
                value = model.get(field.bindTo);
              }

              if (value != null) {
                var choices = field.choices.map(function (choice) {
                  return choice.value != null ? choice.value : choice.text;
                });

                if (choices.indexOf(value) === -1) {
                  field.choices.unshift({
                    text: value,
                    value: value
                  });
                }
              }
            }

            var renderer = finalizeRenderer(field.preRender);

            if (renderer) {
              return renderer.call(_this, {
                cotForm: cotForm,
                model: model,
                view: view,
                definition: definition,
                section: section,
                row: row,
                field: field,
                grid: grid,
                repeatControl: repeatControl,
                repeatControlRow: repeatControlRow
              });
            }
          });
        }
      });
    }).then(function () {
      return _originalRender.call.apply(_originalRender, [_this2].concat(args));
    }).then(function () {
      return renderLoop({
        definition: definition,
        renderSection: function renderSection(_ref5) {
          var definition = _ref5.definition,
              section = _ref5.section;
          var renderer = finalizeRenderer(section.postRender);

          if (renderer) {
            return renderer.call(this, {
              cotForm: cotForm,
              model: model,
              view: view,
              definition: definition,
              section: section
            });
          }
        },
        renderRow: function renderRow(_ref6) {
          var definition = _ref6.definition,
              section = _ref6.section,
              row = _ref6.row;
          var renderer = finalizeRenderer(row.postRender);

          if (renderer) {
            return renderer.call(this, {
              cotForm: cotForm,
              model: model,
              view: view,
              definition: definition,
              section: section,
              row: row
            });
          }
        },
        renderField: function renderField(_ref7) {
          var definition = _ref7.definition,
              section = _ref7.section,
              row = _ref7.row,
              field = _ref7.field,
              grid = _ref7.grid,
              repeatControl = _ref7.repeatControl,
              repeatControlRow = _ref7.repeatControlRow;
          var renderer = finalizeRenderer(field.postRender);

          if (renderer) {
            return renderer.call(this, {
              cotForm: cotForm,
              model: model,
              view: view,
              definition: definition,
              section: section,
              row: row,
              field: field,
              grid: grid,
              repeatControl: repeatControl,
              repeatControlRow: repeatControlRow
            });
          }
        }
      });
    });
  };

  window.CotForm.prototype.getModel = function () {
    return this._model;
  };

  window.CotForm.prototype.setView = function (view) {
    this._view = view;
  };

  window.CotForm.prototype.getView = function () {
    return this._view;
  };
}