import Ember from 'ember';
import Application from './application';

function loadPost(store, comment) {
  var postModel = store.modelFor('post');
  var commentModel = store.modelFor('comment');
  var adapter = store.adapterFor(postModel.typeKey);
  var serializer = store.serializerFor(commentModel.typeKey);
  comment = serializer.extractSingle(store, commentModel, comment);
  return adapter.find('post', postModel, comment.post).then(function(post) {
    var serializer = store.serializerFor(postModel.typeKey);
    store.push('post', serializer.extractSingle(store, postModel, post));
  });
}

export default Application.extend({
  find: function(store, type, id) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      _this._super(store, type, id).then(function(comment) {
        loadPost(store, comment).then(function() {
          resolve(comment);
        });
      });
    });
  },

  findAll: function(store, type) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      _this._super(store, type).then(function(comments) {
        var promises = comments.map(function(comment) {
          return loadPost(store, comment);
        });
        Ember.RSVP.all(promises).then(function() {
          resolve(comments);
        });
      });
    });
  }
});
