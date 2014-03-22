define(['jquery', 'underscore', 'backbone', 'app', 'models/voluntary-work'], function($, _, Backbone, app, VoluntaryWorkModel) {
  "use strict";

  return Backbone.Collection.extend(
    {
      model: VoluntaryWorkModel
    },
    {
      type: "voluntary_works"
    }
  );


});
