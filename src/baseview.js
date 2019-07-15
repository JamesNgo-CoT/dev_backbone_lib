/* global Backbone */

/* exported BaseView */
class BaseView extends Backbone.View {
  preinitialize(options = {}) {

    super.preinitialize(options);
  }

  render() {
    let linkButton = this.el.querySelector('a.btn:not([role="button"])');
    while (linkButton) {
      linkButton.setAttribute('role', 'button');
      linkButton.addEventListener('keydown', function (event) {
        if (event.which === 32) {
          event.preventDefault();
          event.target.click();
        }
      });
      linkButton = this.el.querySelector('a.btn:not([role="button"])');
    }

    return Promise.resolve();
  }
}
