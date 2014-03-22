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

      this.views = {

      };

      app.on({
        "voluntary-work-submission": function(model, attributes) {

          if (model.isNew()) {
            // Create a new item and navigate back to list view as submission is done
            this.voluntaryWorks.create(model, {wait: true}).then(this.list);

          } else if (this.model.hasChanged()) {
            // Save if any changes have been made and go back to list view
            model.save(this.model.changedAttributes, {patch: true, wait: true}).then(this.list);

          } else {
            // No changes to save -> navigate directly
            this.list();
          }
        }
      }, this);

      // TODO: remove this - this is only for debugging purposes
      var router = this;
      _.extend(window, {
        app: app,
        router: router,
        models: {
          VoluntaryWork: VoluntaryWork
        },
        collections: {
          VoluntaryWorks: VoluntaryWorks,
          Municipalities: Municipalities,
          Types: WorkTypes
        }
      });
    },

    list: function() {
      if (app.voluntaryWorks.length === 0) {
        app.voluntaryWorks.fetch();
      }
      require(['views/list'], function(ListView) {
        var view = new ListView({collection: app.voluntaryWorks});

        app.mainView.setView("", view);
        view.render();
      });
    },

    view: function(id) {
      // Fetch voluntaryWorks as suggestions for others
      if (app.voluntaryWorks.length === 0) {
        app.voluntaryWorks.fetch();
      }
      this.getItem(id);
      require(['views/details'], function(DetailsView) {
        var view = new DetailsView({suggestions: app.voluntaryWorks, model: item});

        app.mainView.setView("", view);
        view.render();
      });
    },

    form: function(id, token) {
      var item;
      if (id) {
        item = this.getItem(id);
      }

      require(['views/form'], function(FormView) {
        var view, params;
        if (item) {
          params = {model: item};
          if (token) {
            params.token = token;
          }
        }
        view = new FormView(params);
        app.mainView.setView("", view);
        view.render();
      });
    },


    // HELPER FUNCTIONS
    getItem: function(id) {
      var item = app.voluntaryWorks.get(id);
      if (!item) {
        item = new VoluntaryWork({id: id});
        // TODO: error handling if item with given id doesn't exist for some reason
        item.fetch();
      }
      return item;
    }

  });

  return VoluntaryWorkRouter;
});
