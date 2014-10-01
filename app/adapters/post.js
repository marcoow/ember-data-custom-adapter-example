import Ember from 'ember';
import Application from './application';

export default Application.extend({
  findHasMany: function(store, record, url, relationship) {
    if (relationship.key === 'comments') {
      var _this = this;
      return new Ember.RSVP.Promise(function(resolve) {
        var serializer = store.serializerFor(relationship.type.typeKey);
        _this.findAll(store, relationship.type).then(function(comments) {
          comments = comments.map(function(comment) {
            return serializer.extractSingle(store, relationship.type, comment);
          }).filter(function(comment) {
            return comment.post === record.get('id');
          });
          resolve(comments);
        });
      });
    }
  }
});
