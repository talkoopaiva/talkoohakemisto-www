define(['jquery', 'underscore', 'backbone', 'app'], function($, _, Backbone, app) {
  "use strict";

  return Backbone.Model.extend({
    // url: function() {
    //   return app.api + "voluntary_works/" + this.id;
    // },
    urlRoot: app.api + "voluntary_works",

    links: {
      "type": "types",
      "municipality": "municipalities"
    },

    parse: function(data) {
      if (data.hasOwnProperty('voluntary_works')) {
        console.log('fetched', data.voluntary_works[0]);
        return data.voluntary_works[0];
      } else {
        return data;
      }
    },

    validate: function(attrs) {
      var errors = [];

      if (!attrs.type) {
       errors.push({name: 'type', message: 'Valitse talkootyyppi'});
      }

      if (!attrs.name) {
        errors.push({name: 'name', message: 'Kirjoita talkoiden nimi'});
      }

      if (!attrs.description) {
        errors.push({name: 'description', message: 'Kirjoita selite'});
      }

      if (!attrs.municipality) {
        errors.push({name: 'municipality', message: 'Valitse kunta'});
      }

      //if (!attrs.address) {
      //  errors.push({name: 'address', message: 'Kirjoita osoite'});
      //}

      if (!attrs.organizer) {
        errors.push({name: 'organizer', message: 'Kirjoita nimesi'});
      }

      if (!attrs.contact_email) {
        errors.push({name: 'contact_email', message: 'Kirjoita sähköpostiosoitteesi'});
      }

      // Make sure hashtag has the hash prepended
      if (attrs.hashtag && attrs.hashtag[0] !== '#') {
        attrs.hashtag = '#' + attrs.hashtag;
      }

      return errors.length > 0 ? errors : false;
    },

  });

});
