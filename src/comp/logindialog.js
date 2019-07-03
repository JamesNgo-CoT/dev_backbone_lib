/* global DialogView LoginFormView */

/* exported LoginDialogView */
class LoginDialogView extends DialogView {
  static get singleton() {
    if (!LoginDialogView._singleton) {
      LoginDialogView._singleton = new LoginDialogView(LoginDialogView.singletonOptions);
      if (LoginDialogView.singletonParent) {
        LoginDialogView.singletonParent.appendChild(LoginDialogView._singleton.el);
        LoginDialogView._singleton.render();
      }
    }

    return LoginDialogView._singleton;
  }

  initialize(options) {}

  removeLoginFormView() {
    if (this.loginFormView) {
      this.loginFormView.remove();
    }

    this.loginFormView = null;
  }

  remove() {
    this.removeLoginFormView();
    super.remove();
  }

  render() {
    this.removeLoginFormView();

    super.render();

    this.dialog.classList.add('modal-md');

    this.headerTitleSpan.textContent = 'Login Dialog';

    this.loginFormView = new LoginFormView({ model: this.model });
    console.log(this.loginFormView.el);
    this.loginFormView.on('success', () => {
      this.close();
    });
    this.body.appendChild(this.loginFormView.el);
    const formViewRenderPromise = this.loginFormView.render();

    return formViewRenderPromise;
  }
}
