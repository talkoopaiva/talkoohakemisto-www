define(['module', 'underscore', 'backbone', 'jquery', 'app', 'hbars!templates/form',
        'models/voluntary-work', 'templates/helpers/select'],
        function(module, _, Backbone, $, app, template, VoluntaryWork, getSelectList) {
  module.exports = Backbone.Layout.extend({
    template: template,

    events: {
      "submit #voluntary-work-form": "handleForm",
      "click .vw-type": "selectImage",
      "click .form-control": "hideErrors",
      "change .form-control": "hideErrors"
    },

    initialize: function(options) {
      if (!this.model) {
        this.model = new VoluntaryWork();
      }

      this.municipalities = options.municipalities;
      this.types = options.types;

      // On validation error, point the errors
      this.model.on('invalid', function(model, errors) {
        console.log('validation errors', errors);
        this.showErrors.call(this, errors);
      }, this);
    },

    afterRender: function() {
      var view = this;
      require(['async!//maps.googleapis.com/maps/api/js?sensor=false&libraries=places'], function() {
        require(['geocomplete'], function() {
          // FIXME: this is ugly but somehow after building to production gmaps is not loaded yet - i.e. async doesnt work!
          setTimeout(function() {
            $('input[name="street_address"]').geocomplete({
              // map: "#previewMap",
              // markerOptions: {
              //   draggable: true
              // },
              // // all available types: https://developers.google.com/places/documentation/supported_types
              // types: []
              country: 'fi',
              componentRestrictions: {country: 'fi'}, // restrict to Finland
              blur: true // make choose automatically on blur
            }).bind("geocode:result geocode:multiple", function(e, res) {

              var location = {};
              _.forEach(res.address_components, function(v, k) {
                if (v.types[0] === 'locality') {
                  location.municipality = v.long_name;
                  return true;
                }
              });

              location.address = res.formatted_address;
              location.lat = res.geometry.location.k;
              location.lng = res.geometry.location.A;

              try {
                var municipalityId = view.municipalities.findWhere({name: location.municipality}).id;
                $('select[name="municipality"]').val(municipalityId);
              } catch(error) {
                console.log(error, "No municipality found with entered name");
              }

              view.addressSelected = location;

            });
          }, 3000);
        });
      });


    },

    serialize: function() {
      // Load existing model or leave fields empty
      var data = this.model ? this.model.toJSON() : {};
      // Attached types and municipalities to template data
      _.extend(data, {municipalities: this.municipalities.toJSON(), types: this.types.toJSON()});

      return data;
    },

    showErrors: function(errors) {
      _.each(errors, function (error) {
        // Find field in question
        this.$el.find('[name="' + error.name + '"]')
          // Highlight corresponding
          .closest('.form-group').toggleClass('has-error', true)
          // Add error msg
          .find('.help-block').text(error.message);
      }, this);
    },

    hideErrors: function (e) {
      // Find field in question, or select all the field
      var fieldgroup = e ? $(e.currentTarget).closest('.form-group') : $('.form-group');
      fieldgroup.removeClass('has-error')
        .find('.help-block').text('');
    },

    selectImage: function(element) {
      $('.vw-type').removeClass('selected').css("background-color", "white");
      $(element.target).toggleClass('selected', true).css("background-color", "#0e76bc");
    },

    handleForm: function(e) {
      if (e) {
        e.preventDefault();
      }

      // Prevent double submissions
      if (this.model.isRequest) {
        return;
      }

      // Get form fields in the form of attr[name] = value
      var attr = _.reduce($("#voluntary-work-form").serializeArray(), function(result, field) {
        result[field.name] = field.value;
        return result;
      }, {});

      // Add latitude and longitude
      // Make sure the address in the field is the one that was selected
      if (this.addressSelected && this.addressSelected.address == attr.street_address) {
        attr.lat = this.addressSelected.lat;
        attr.lng = this.addressSelected.lng;
      }

      // Hide possible errors from previous submission
      this.hideErrors();
      // Set attributes and validate - if not, cancel
      if (!this.model.set(attr, {validate: true})) {
        return;
      }

      // Trigger submission for app to handle
      app.trigger('voluntary-work-submission', this.model, attr);
    }

  });
});
