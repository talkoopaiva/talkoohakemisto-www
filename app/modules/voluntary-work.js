define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");

  var generateTypeIconUrl = function(name) {
    return app.imgRoot + 'icons/' + name.toLowerCase().replace("ö", "o").replace("ä", "a") + '.png';
  };

  var VoluntaryWorkModel = Backbone.Model.extend({
    defaults: {
      name: ''
    },
  });

  var VoluntaryWork = {

    Views: {
      // HERE GO ALL THE CHANGING VIEW COMPONENTS OF THE UI

      Form: Backbone.View.extend({
        initialize: function() { },

        tagName: "div",
        className: "voluntary-work-form container",

        render: function() {
          var data = this.model;
          _.each(data.types, function(v,k) {
            data.types[k].iconUrl = generateTypeIconUrl(v.name);
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

        template: require("ldsh!../templates/voluntary-work-form")
      }),

      Item: Backbone.View.extend({
        initialize: function(el) {
          //console.log(el);
        },

        tagName: "li",
        className: "voluntaryWorkItem row",

        render: function() {
          var data = this.model.toJSON();
          var typeId = data.links.type;
          var municipalityId = data.links.municipality;

          data.municipality = this.model.collection.getLinkedItem('municipalities', municipalityId);
          data.type = this.model.collection.getLinkedItem('types', typeId);

          data.iconUrl = generateTypeIconUrl(data.type.name);

          this.$el.html( this.template( data ) );
          return this;
        },

        template: require("ldsh!../templates/voluntary-work-item")
      }),

      List: Backbone.View.extend({
        //template: require("ldsh!../templates/voluntary-work-list"),

        serialize: function() {
          return { users: this.collection };
        },

        beforeRender: function() { },
        afterRender: function() { },
        initialize: function() {
          // Listen for events and refetch if something changed
          var view = this;
          this.update(function() {
            // TODO: this should be fixed!
            view.collection.on('itemAdded', function() {
              view.update.call(view);
            });
            view.show();
          });
        },
        update: function(after) {
          var view = this;
          console.log('updating (fetching)');
          this.collection.fetch({
            success: function(items) {
              view.render();
              if (after) {
                after();
              }
            }
          });
        },
        addOne: function(item) {
          var itemView = new VoluntaryWork.Views.Item({model: item}).render();
          $('ul.itemList').append(itemView.$el);
        },
        render: function() {
          var $itemList = $('ul.itemList').empty();
          this.collection.forEach(this.addOne);
          // Scroll window to the top once list updated
          window.scrollTo(0);
        },
        show: function() {
          $('#voluntaryWorkDetails').hide();
          $('#voluntaryWorkList').show();
        },
        hide: function() {
          $('#voluntaryWorkList').hide();
        }

      }),

      Details: Backbone.View.extend({
        initialize: function() {},

        template: require("ldsh!../templates/voluntary-work-details")
      })

    },

    Model: VoluntaryWorkModel,

    Collection: Backbone.Collection.extend({
      model: VoluntaryWorkModel,
      url: function() {
        return app.api + "voluntary_works";
      },
      parse: function(data) {
        this.addLinkedItems(data.linked);
        return data.voluntary_works;
      },
      addLinkedItems: function(data) {
        // See if linkedItems metadata already exists, otherwise init
        if (!this.hasOwnProperty('linkedItems')) {
          this.linkedItems = {};
        }

        var linkedItems = this.linkedItems;
        _.each(data, function(val, key) {
          // See if linked items with this key already exists, otherwise create
          if (!linkedItems.hasOwnProperty(key)) {
            linkedItems[key] = {};
          }
          // Iterate over linked items and add them to metadata
          _.each(val, function(item) {
            linkedItems[key][item.id] = item;
          });
        });
        // Update stored linked items
        this.linkedItems = linkedItems;
      },
      getLinkedItem: function(key, id) {
        return this.linkedItems[key][id];
      }
    })

  };

  module.exports = VoluntaryWork;

});