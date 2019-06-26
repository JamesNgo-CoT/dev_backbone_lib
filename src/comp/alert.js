/* global BaseModel BaseView */

/* exported AlertModel */
class AlertModel extends BaseModel {
  defaults() {
    return {
      message: '<p>MESSAGE</p>'
    }
  }
}

/* exported AlertView */
class AlertView extends BaseView {
  preinitialize(options = {}) {
    this.attributes = options.attributes || { role: 'alert' };

    super.preinitialize(options);
  }

  initialize(options) {
    this.listenTo(options.model, 'change', () => {
      this.render();
    });

    super.initialize(options);
  }

  className() {
    return 'alert-danger';
  }

  render() {
    while (this.el.firstChild) {
      this.removeChild(this.el.firstChild);
    }

    this.el.classList.add('alert', 'alert-dismissible');

    const messageElementButton = this.el.appendChild(document.createElement('button'));
    messageElementButton.classList.add('close');
    messageElementButton.setAttribute('type', 'button');
    messageElementButton.setAttribute('data-dismiss', 'alert');
    messageElementButton.setAttribute('aria-label', 'Close');

    const messageElementButtonTimes = messageElementButton.appendChild(document.createElement('span'));
    messageElementButtonTimes.setAttribute('aria-hidden', 'true');
    messageElementButtonTimes.innerHTML = '&times;';

    const innerMessageElement = this.el.appendChild(document.createElement('div'));
    const message = this.model.get('message');
    if (message instanceof HTMLElement) {
      innerMessageElement.appendChild(message);
    } else {
      innerMessageElement.innerHTML = message;
    }

    super.render();
  }

  close() {
    this.el.querySelector('button[data-dismiss="alert"]').click();
  }
}
