import Application from './application';

export default Application.extend({
  normalize: function(type, hash) {
    hash.links = { comments: true };
    return this._super(type, hash);
  }
});
