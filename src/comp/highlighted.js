/* global BaseModel BaseView */

/* exported HighlightedModel */
class HighlightedModel extends BaseModel {
  defaults() {
    return {
      content: 'HIGHLIGHTED CONTENT'
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
    if (typeof content === 'string') {
      this.el.innerHTML = content;
    } else {
      this.el.appendChild(content);
    }

    return super.render();
  }
}
