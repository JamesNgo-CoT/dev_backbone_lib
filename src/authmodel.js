/* global _ BaseModel */

/* exported AuthModel */
class AuthModel extends BaseModel {
  preinitialize(attributes, options = {}) {
    super.preinitialize(attributes, options);

    // Backbone property default value
    this.idAttribute = options.idAttribute || 'sid';

    // New property-factory override
    this.app = options.app || this.app;
  }

  initialize(attributes, options) {
    this.on(`change:${this.idAttribute}`, () => {
      if (!this.isNew()) {
        this.webStorageSave();
      } else {
        this.webStorageDestroy();
      }
    });

    this.webStorageFetch();
    if (!this.isNew()) {
      this.fetch()
        .catch(() => {
          this.clear();
        });
    }

    super.initialize(attributes, options);
  }

  parse(response, options) {
    this.clear({ silent: true });

    delete response['@odata.context'];
    delete response.pwd;

    return super.parse(response, options);
  }

  save(attributes = {}, options = {}) {
    const { app = _.result(this, 'app'), user = this.get('user'), pwd = this.get('pwd') } = attributes;
    this.clear({ silent: true });
    return super.save({ app, user, pwd }, options);
  }

  destroy(options = {}) {
    options.headers = options.headers || {};
    options.headers.Authorization = this.get('userID');
    return super.destroy(options)
      .finally(() => this.clear());
  }

  app() {
    return 'cotapp';
  }

  login(options) {
    return this.save(options);
  }

  logout() {
    return this.destroy();
  }

  isLoggedIn() {
    return !this.isNew();
  }

  authentication(options) {
    return new Promise((resolve, reject) => {
      if (!this.isLoggedIn()) {
        resolve(false);
      } else {
        this.fetch(options)
          .then(() => {
            resolve(this.isLoggedIn());
          }, (error) => {
            reject(error);
          });
      }
    });
  }
}
