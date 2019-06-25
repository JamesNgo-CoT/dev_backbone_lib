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
    this.el.innerHTML = this.model.get('content');

    super.render();
  }
}
