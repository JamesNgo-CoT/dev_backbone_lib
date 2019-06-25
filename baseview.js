/* exported BaseView */
class BaseView extends Backbone.View {
  preinitialize(options = {}) {
    this.authModel = options.authModel || this.authModel;

    this.afterRenderOnce = null;

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

    if (this.afterRenderOnce) {
      const afterRenderOnce = this.afterRenderOnce;
      this.afterRenderOnce = null;
      return afterRenderOnce();
    }
  }
}
