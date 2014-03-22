define(['jquery', 'underscore', 'backbone', 'app'], function($, _, Backbone, app) {
  "use strict";

  return Backbone.Collection.extend(
    { // Instance properties
      //collectionName: "types",
      model: Backbone.Model.extend({
        initialize: function(){

        }
      })
    },
    { // Class properties
      type: "types"
    }
  );
});
