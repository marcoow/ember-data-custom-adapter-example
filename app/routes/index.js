import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    window.__store__ = this.get('store');
  }
});
