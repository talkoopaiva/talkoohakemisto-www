define(['jquery', 'underscore', 'backbone', 'app'], function($, _, Backbone, app) {
  "use strict";

  return Backbone.Collection.extend(
    { // Instance properties
      model: Backbone.Model.extend({
        initialize: function(){

        }
      }),

      comparator: 'name'
    },
    { // Class properties
      type: "municipalities"
    }
  );
});
