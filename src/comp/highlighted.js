/* global BaseModel BaseView */

/* exported HighlightedModel */
class HighlightedModel extends BaseModel {
  defaults() {
    return {
      content: '<p>HTML CONTENT</p>'
    };
  }
}

/* exported HighlightedView */
class HighlightedView extends BaseView {
  initialize(options) {
    this.listenTo(options.model, 'change', () => {
      this.render();
    });

    super.initialize(options);
  }

  render() {
    while (this.el.firstChild) {
      this.removeChild(this.el.firstChild);
    }

    const content = this.model.get('content');
    if (content instanceof HTMLElement) {
      this.el.appendChild(content);
    } else {
      this.el.innerHTML = this.model.get('content');
    }

    super.render();
  }
}
