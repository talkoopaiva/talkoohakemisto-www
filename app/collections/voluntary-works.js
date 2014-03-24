define(['jquery', 'underscore', 'backbone', 'app', 'models/voluntary-work'], function($, _, Backbone, app, VoluntaryWorkModel) {
  "use strict";

  return Backbone.Collection.extend(
    {
      model: VoluntaryWorkModel,
      comparator: function(item) {
        // To sort in reverse order, latest on top
        return _.isNaN(item.id) ? (- new Date().getTime() ) : (- item.id);
      }
    },
    {
      type: "voluntary_works"
    }
  );


});
