import Ember from 'ember';
import DS from 'ember-data';

function parseIfJson(objectOrJson) {
  return Ember.typeOf(objectOrJson) === 'string' ? JSON.parse(objectOrJson) : objectOrJson;
}

export default DS.JSONSerializer.extend({
  serialize: function(record, options) {
    return JSON.stringify(this._super(record, options));
  },

  extractSingle: function(store, type, payload, id, requestType) {
    payload = parseIfJson(payload);
    return this._super(store, type, payload, id, requestType);
  },

  extractArray: function(store, type, arrayPayload, id, requestType) {
    arrayPayload = Ember.A(arrayPayload).map(parseIfJson);
    return this._super(store, type, arrayPayload, id, requestType);
  }
});
