import Ember from 'ember';
import DS from 'ember-data';

function buildKey(typeKey, id) {
  return [typeKey, id].join(':');
}

function stringStartsWith(string, pattern) {
  return string.lastIndexOf(pattern) === 0;
}

export default DS.Adapter.extend({
  generateIdForRecord: function(store) {
    return Math.floor((Math.random() * 1000000) + 1);;
  },

  find: function(store, type, id) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var key = buildKey(type.typeKey, id);
      var record = sessionStorage.getItem(key);
      if (!Ember.isEmpty(record)) {
        resolve(record);
      } else {
        reject();
      }
    });
  },

  findAll: function(store, type) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var records = [];
      for (var i = 0; i < sessionStorage.length; i++) {
        var key = sessionStorage.key(i);
        if (stringStartsWith(key, type.typeKey)) {
          records.push(sessionStorage.getItem(key));
        }
      }
      resolve(records);
    });
  },

  createRecord: function(store, type, record) {
    var data = this.serialize(record, { includeId: true });

    return new Ember.RSVP.Promise(function(resolve, reject) {
      var key = buildKey(type.typeKey, record.id);
      sessionStorage.setItem(key, data);
      resolve(record);
    });
  },

  updateRecord: function(store, type, record) {
    var data = this.serialize(record, { includeId: true });

    return new Ember.RSVP.Promise(function(resolve, reject) {
      var key = buildKey(type.typeKey, record.id);
      sessionStorage.setItem(key, data);
      resolve(record);
    });
  },

  deleteRecord: function(store, type, record) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var key = buildKey(type.typeKey, record.id);
      sessionStorage.removeItem(key);
      resolve(record);
    });
  }
});
