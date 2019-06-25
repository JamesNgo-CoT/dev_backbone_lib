/* global CotForm BaseView AlertModel AlertView */

/* exported FormView */
class FormView extends BaseView {
  preinitialize(options = {}) {
    this.formDefinition = options.formDefinition || this.formDefinition;
    this.rootPath = options.rootPath || this.rootPath;
    this.success = options.success || this.success;

    this.cotForm = null;
    this.form = null;
    this.formValidator = null;

    super.preinitialize(options);
  }

  render() {
    while (this.el.firstChild) {
      this.removeChild(this.el.firstChild);
    }

    const formDefinition = _.result(this, 'formDefinition');

    formDefinition.rootPath = _.result(formDefinition, 'rootPath') || _.result(this, 'rootPath');
    formDefinition.useBinding = true;

    formDefinition.success = formDefinition.success || ((event) => {
      event.preventDefault();
      this.success();
      return false;
    });

    this.cotForm = new CotForm(formDefinition);
    this.cotForm.setModel(this.model);
    this.cotForm.setView(this);

    return Promise.resolve()
      .then(() => {
        return this.cotForm.render({ target: this.el });
      })
      .then(() => {
        this.form = this.el.querySelector('form');
        this.formValidator = $(this.form).data('formValidation');

        super.render(this);
      });
  }

  success() {
    this.trigger('success');
  }

  showAlert(message, sectionIndex) {
    let parentNode = this.form;

    if (sectionIndex != null) {
      parentNode = parentNode.querySelectorAll('.panel-body')[sectionIndex];
    }

    const model = new AlertModel({ message });
    const alertView = new AlertView({ model });
    parentNode.insertBefore(alertView.el, parentNode.firstChild);
    alertView.render();
  }
}
