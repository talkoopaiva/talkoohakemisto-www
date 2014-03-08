define(function(require, exports, module) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");
  var VoluntaryWork = require("modules/voluntary-work");

  module.exports = Backbone.View.extend({
    initialize: function() { },

    tagName: "div",
    className: "voluntary-work-form container",

    render: function() {
      var data = this.model;
      _.each(data.types, function(v,k) {
        data.types[k].iconUrl = app.helpers.generateTypeIconUrl(v.name);
      });

      this.$el.html( this.template( data ) );
      return this;
    },

    events: {
      "click #save-voluntary-work": "handleForm",
      "click .vw-type": "selectImage",
      "click .form-control": "hideError",
      "change .form-control": "hideError"
    },

    showErrors: function(errors) {
        _.each(errors, function (error) {
            var errorElement = $('#div-' + error.name);
            errorElement.find('.form-control').addClass('error');
            errorElement.find('.help-inline').text(error.message);
        }, this);
    },

    hideErrors: function () {
        this.$('.form-control').removeClass('error');
        this.$('.help-inline').text('');
    },

    hideError: function (e) {
        $(e.currentTarget).parent().find('.form-control').removeClass('error');
        $(e.currentTarget).parent().find('.help-inline').text('');
    },

    selectImage: function(element) {
      $('.vw-type').removeClass('selected').css("background-color", "white");
      $(element.target).toggleClass('selected', true).css("background-color", "#0e76bc");
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

      if (!attrs.email) {
        errors.push({name: 'email', message: 'Kirjoita sähköpostiosoitteesi'});
      }

      return errors.length > 0 ? errors : false;
    },

    handleForm: function() {
      var VoluntaryWorkModel = Backbone.Model.extend({
        defaults: {

        }
      });

      var VoluntaryWorkCollection = Backbone.Collection.extend({
        model: VoluntaryWorkModel,
        url: app.api + 'voluntary_works'
      });

      var errors = this.validate({
        type: $('.vw-type.selected').data('type-id'),
        name: $("#form-name").val(),
        description: $("#form-description").val(),
        municipality: $("#form-municipality").val(),
        address: $("#form-address").val(),
        organizer: $("#form-organizer").val(),
        email: $("#form-email").val()
      });

      if (!errors) {
          this.hideErrors();
      } else {
          this.showErrors(errors);
          return;
      }

      $("#save-voluntary-work").attr('disabled', true);

      var vwcol = this.model.voluntaryWorks;

      var ok = vwcol.create({voluntary_works: [{
          "name": $("#form-name").val(),
          "description": $("#form-description").val(),
          "links": {
            "municipality": parseInt($("#form-municipality").val()),
            "type": $('.vw-type.selected').data('type-id')
          },
          "contact_email": $("#form-email").val(),
          "street_address": $("#form-address").val(),
          "organizer": $("#form-organizer").val()
      }]}, {
        wait: true,
        success: function() {
          vwcol.trigger('itemAdded');
        }
      });

      Backbone.history.navigate("list", true);

    },

    template: require("ldsh!templates/voluntary-work-form")
  });


});