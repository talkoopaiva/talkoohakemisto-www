define(['jquery', 'underscore', 'backbone', 'app'], function($, _, Backbone, app) {
  "use strict";

  return Backbone.Model.extend({
    // url: function() {
    //   return app.api + "voluntary_works/" + this.id;
    // },
    urlRoot: app.api + "voluntary_works",
    parse: function(data) {
      if (data.hasOwnProperty('voluntary_works')) {
        console.log('fetched', data.voluntary_works[0]);
        return data.voluntary_works[0];
      } else {
        return data;
      }
    },
    defaults: {

    }

  });

});
