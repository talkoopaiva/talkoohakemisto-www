define([
    'jquery', 'underscore', 'backbone', 'layoutmanager', 'app',
    'models/voluntary-work',
    'collections/voluntary-works', 'collections/worktypes', 'collections/municipalities'
  ], function(
    $, _, Backbone, Layout, app,
    VoluntaryWork,
    VoluntaryWorks, WorkTypes, Municipalities
  ) {
  "use strict";

  var VoluntaryWorkRouter = Backbone.Router.extend({
    routes: {
      "": "list",
      "list": "list",

      "form": "form",
      "new": "form",
      "edit/:id": "form",
      "edit/:id/:token": "form",

      "view/:id": "view"
    },

    initialize: function() {

      app.voluntaryWorks = new VoluntaryWorks();
      app.types = new WorkTypes();
      app.municipalities = new Municipalities();

      // Init main view to which everything else gets attached
      app.mainView = new Backbone.View({
        el: "#main"
      });

      this.on('route', function(name, args) {
        window.scrollTo(0,0);
      });

      var router = this;

      app.on({
        "voluntary-work-submission": function(model, attributes) {

          var success = function() {
            router.navigate('/', true);
          };

          if (model.isNew()) {
            // Create a new item and navigate back to list view as submission is done
            app.voluntaryWorks.create(model, {
              wait: true,
              success: success,
              error: function() {
                // FIXME: error handling in case submission didn't go through
                console.log('Error in sending data to server', arguments);
              }
            });

          } else if (model.hasChanged()) {
            // Save if any changes have been made and go back to list view
            model.save(_.extend({"token": model.get('token')}, model.changedAttributes()), {patch: true, wait: true}).then(success).fail(function() {
              // FIXME: error handling in case submission didn't go through
              console.log('Error in sending data to server', arguments);
            });

          } else {
            // No changes to save -> navigate directly to list view
            success();
          }
        }
      }, this);

      // TODO: remove all below - this is only for debugging purposes
      // _.extend(window, {
      //   app: app,
      //   router: router,
      //   models: {
      //     VoluntaryWork: VoluntaryWork
      //   },
      //   collections: {
      //     VoluntaryWorks: VoluntaryWorks,
      //     Municipalities: Municipalities,
      //     Types: WorkTypes
      //   }
      // });
    },

    list: function() {
      // For some reason it may not delete the previous views
      app.mainView.removeView("");
      require(['views/list'], function(ListView) {
        var view = new ListView({collection: app.voluntaryWorks});

        app.mainView.setView("", view);

        app.voluntaryWorks.fetched().then(function() {
          view.render();
        }).fail(function(xhr, message, error) {
          // FIXME: error handling
          console.log('Request failed', message, error);
        });
      });
    },

    view: function(id) {
      var item = this.getItem(id);
      require(['views/details'], function(DetailsView) {
        var view = new DetailsView({suggestions: app.voluntaryWorks, model: item});

        app.mainView.setView("", view);

        // render once item details are ready, load suggestions lazily
        item.fetched().then(function() {
          view.render();
        }).fail(function(xhr, message, error) {
          // FIXME: error handling
          console.log('Request failed', message, error);
        });
      });
    },

    form: function(id, token) {
      var item;
      if (id) {
        // Editing may only work on browsers with CORS support
        if (app.helpers.supportsCors === false) {
          alert('Tietojen muokkaus ei ole mahdollista vanhemmilla selaimilla.' +
                "\n" + 'Suosittelemme käyttämään Chrome selainta tietojen päivitykseen.');
          return router.navigate('list', true);
        }
        item = this.getItem(id);
      }

      require(['views/form'], function(FormView) {
        var view;
        var params = {types: app.types, municipalities: app.municipalities};

        if (item) {
          params.model = item;
          if (token) {
            // Persist token in the model
            params.model.set('token', token);
          } else if (!params.model.get('token')) {
            // If token doesn't exist in the model, warn and return back to list
            alert('Muokataksesi takoiden tietoja seuraa sähköpostiisi saapunutta muokkauslinkkiä.');
            return router.navigate('list', true);
          }
        }
        view = new FormView(params);
        app.mainView.setView("", view);

        // Render view only once all required collections / items are fetched
        $.when(app.types.fetched(), app.municipalities.fetched(), item && item.fetched()).then(function() {
          view.render();
        }).fail(function() {
          // FIXME: error handling
          console.log('edit view failed', arguments);
        });
      });
    },


    // HELPER FUNCTIONS
    getItem: function(id) {
      var item = app.voluntaryWorks.get(id);
      if (!item) {
        item = new VoluntaryWork({id: id});
      }
      return item;
    }

  });

  return VoluntaryWorkRouter;
});
