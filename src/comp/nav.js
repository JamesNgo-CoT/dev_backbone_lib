/* global _ */
/* global BaseModel BaseCollection BaseView */

/* exported NavItemModel */
class NavItemModel extends BaseModel {
  defaults() {
    return {
      title: 'Untitled',
      fragment: '',
      isActive: false,
      isVisible: true
    };
  }
}

/* exported NavItemView */
class NavItemView extends BaseView {
  preinitialize(options) {
    options.tagName = options.tagName || 'li';
    options.attributes = options.attributes || { role: 'presentation' };

    super.preinitialize(options);
  }

  initialize(options) {
    this.listenTo(options.model, 'change', () => {
      this.render();
    });

    super.initialize(options);
  }

  render() {
    this.el.innerHTML = `<a href="#${this.model.escape('fragment')}">${this.model.escape('title')}</a>`;

    if (this.model.get('isActive')) {
      this.el.classList.add('active');
    } else {
      this.el.classList.remove('active');
    }

    if (this.model.get('isVisible')) {
      this.el.classList.remove('hide');
    } else {
      this.el.classList.add('hide');
    }

    super.render();
  }
}

/* exported AuthyNavItemView */
class AuthyNavItemView extends NavItemView {
  initialize(options) {
    const authModel = _.result(this, 'authModel');
    this.listenTo(authModel, 'change', () => {
      this.render();
    });

    return super.initialize(options);
  }

  render() {
    super.render();

    const authModel = _.result(this, 'authModel');
    if (authModel.isLoggedIn()) {
      this.el.classList.remove('hide');
    } else {
      this.el.classList.add('hide');
    }
  }
}

/* exported NavCollection */
class NavCollection extends BaseCollection {
  model(attributes, options) {
    return new NavItemModel(attributes, options);
  }

  setActive(index) {
    this.each((model, modelIndex) => {
      if (index === modelIndex) {
        model.set('isActive', true);
      } else {
        model.set('isActive', false);
      }
    });
  }
}

/* exported NavView */
class NavView extends BaseView {
  preinitialize(options = {}) {
    this.attributes = options.attributes || { role: 'navigation' };

    this.navItemView = options.navItemView || this.navItemView;

    this.navItems = [];

    super.preinitialize(options);
  }

  initialize(options) {
    this.listenTo(options.collection, 'update', () => {
      this.render();
    });

    super.initialize(options);
  }

  removeNavItems() {
    this.navItems.forEach(navItem => navItem.remove());
    this.navItems = [];
  }

  remove() {
    this.removeNavItems();
    super.remove();
  }

  render() {
    this.removeNavItems();
    while (this.el.firstChild) {
      this.removeChild(this.el.firstChild);
    }

    const wrapper = this.el.appendChild(document.createElement('ul'));
    wrapper.classList.add('nav', 'nav-tabs');

    this.collection.each(model => {
      const navItemView = typeof this.navItemView === 'function'
        ? this.navItemView({ model }) : new this.navItemView({ model });
      wrapper.appendChild(navItemView.el);
      navItemView.render();
      this.navItems.push(navItemView);
    });

    super.render();
  }

  navItemView(options) {
    return new NavItemView(options);
  }
}
