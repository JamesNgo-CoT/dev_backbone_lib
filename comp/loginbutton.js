/* global BaseView toQueryString */

/* exported LoginButtonView */
class LoginButtonView extends BaseView {
  preinitialize(options = {}) {
    this.loginFragment = options.loginFragment || this.loginFragment;

    super.preinitialize(options);
  }

  initialize(options) {
    this.listenTo(options.model, 'change', () => {
      this.render();
    });

    super.initialize(options);
  }

  events() {
    return {
      ['click button']() {
        this.afterRenderOnce = () => {
          this.el.querySelector('a').focus();
        };
        this.model.logout();
      }
    };
  }

  render() {
    if (this.model.isLoggedIn()) {
      const cotUser = this.model.get('cotUser');
      const name = cotUser ? [cotUser.lastName, cotUser.firstName].filter(str => str).join(', ') : this.model.get('userID');
      this.el.innerHTML = `<button type="button" class="btn btn-default">Logout: <strong>${name}</strong></button>`;
    } else {
      const fullLoginFragment = _.result(this, 'fullLoginFragment');
      this.el.innerHTML = `<a href="#${fullLoginFragment}" class="btn btn-default">Login</a>`;
    }

    super.render();
  }

  fullLoginFragment() {
    const loginFragment = _.result(this, 'loginFragment');
    const query = Backbone.History.started ? `?${toQueryString({ redirect: Backbone.history.getFragment() })}` : '';
    return `${loginFragment}${query}`;
  }
}
