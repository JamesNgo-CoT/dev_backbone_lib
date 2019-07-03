/* global BaseModel BaseView */

/* exported DialogModel */
class DialogModel extends BaseModel {
  defaults() {
    return {
      id: '',
      size: 'lg',
      heading: 'HEADING',
      body: 'BODY',
      footer: '<button class="btn btn-primary" data-dismiss="modal">Close</button>'
    }
  }
}

/* exported DialogView */
class DialogView extends BaseView {
  static get singleton() {
    if (!DialogView._singleton) {
      DialogView._singleton = new DialogView(DialogView.singletonOptions);
      if (DialogView.singletonParent) {
        DialogView.singletonParent.appendChild(DialogView._singleton.el);
        DialogView._singleton.render();
      }
    }

    return DialogView._singleton;
  }

  static get singletonParent() {
    return DialogView._singletonParent;
  }

  static set singletonParent(value) {
    DialogView._singletonParent = value;
  }

  static get singletonOptions() {
    return DialogView._singletonOptions;
  }

  static set singletonOptions(value) {
    DialogView._singletonOptions = value;
  }

  preinitialize(options = {}) {
    this.className = options.className || this.className;
    this.attributes = options.attributes || this.attributes;

    this.lastFocused = null;

    this.dialog = null;
    this.headerTitleSpan = null;
    this.body = null;
    this.footer = null;

    super.preinitialize(options);
  }

  initialize(options) {
    this.listenTo(options.model, 'change', () => {
      this.render();
    });

    super.initialize(options);
  }

  className() {
    return 'modal fade';
  }

  attributes() {
    return {
      tabindex: '-1',
      role: 'dialog',

      'aria-hidden': 'true',
      'aria-modal': 'true'
    };
  }

  events() {
    return {
      ['shown.bs.modal']() {
        // this.lastFocused = document.activeElement;
        // console.log(this.lastFocused)
        this.el.querySelector('.modal-title span[tabindex="-1"]').focus();
      },

      ['hidden.bs.modal']() {
        // console.log(this.lastFocused)
        // if (this.lastFocused) {
        //   this.lastFocused.focus();
        // }
        this.trigger('hidden.bs.modal');
      }
    }
  }

  render() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }

    this.el.setAttribute('aria-labelledby', `${this.id}_title`);

    this.dialog = this.el.appendChild(document.createElement('div'));
    this.dialog.classList.add('modal-dialog');
    if (this.model.has('size')) {
      this.dialog.classList.add(`modal-${this.model.get('size')}`);
    }
    this.dialog.setAttribute('role', 'document');

    const content = this.dialog.appendChild(document.createElement('div'))
    content.classList.add('modal-content');

    const header = content.appendChild(document.createElement('div'));
    header.classList.add('modal-header');

    const headerButton = header.appendChild(document.createElement('button'));
    headerButton.classList.add('close');
    headerButton.setAttribute('type', 'button');
    headerButton.setAttribute('aria-label', 'Close');
    headerButton.setAttribute('data-dismiss', 'modal');
    headerButton.innerHTML = '<span aria-hidden="true">&times;</span>';

    const headerTitle = header.appendChild(document.createElement('div'));
    headerTitle.classList.add('modal-title');
    headerTitle.setAttribute('id', `${this.id}_title`);
    headerTitle.setAttribute('role', 'heading');
    headerTitle.setAttribute('aria-level', '2');

    this.headerTitleSpan = headerTitle.appendChild(document.createElement('span'));
    this.headerTitleSpan.setAttribute('tabindex', '-1');

    const headingContent = this.model.get('heading');
    if (typeof headingContent === 'string') {
      this.headerTitleSpan.innerHTML = headingContent;
    } else if (headingContent instanceof HTMLElement) {
      this.headerTitleSpan.appendChild(headingContent);
    }

    this.body = content.appendChild(document.createElement('div'));
    this.body.classList.add('modal-body');

    const bodyContent = this.model.get('body');
    if (typeof bodyContent === 'string') {
      this.body.innerHTML = bodyContent;
    } else if (bodyContent instanceof HTMLElement) {
      this.body.appendChild(bodyContent);
    }

    this.footer = content.appendChild(document.createElement('div'));
    this.footer.classList.add('modal-footer');

    const footerContent = this.model.get('footer');
    if (typeof footerContent === 'string') {
      this.footer.innerHTML = footerContent;
    } else if (footerContent instanceof HTMLElement) {
      this.footer.appendChild(footerContent);
    }

    super.render();
  }

  open() {
    this.$el.modal('show');
  }

  close() {
    this.$el.modal('hide');
  }
}
