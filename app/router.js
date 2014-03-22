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
      "view/:id": "form"
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
      if (app.voluntaryWorks.length == 0) {
        app.voluntaryWorks.fetch();
      }
      require(['views/list'], function(ListView) {
        var listView = new ListView({collection: app.voluntaryWorks});

        app.mainView.setView("", listView);
        listView.render();
      });
    }

    // list: function() {

    //   // Empty existing itemlist
    //   //$('ul.itemList').html('');
    //   if (!this.views.voluntaryWorkList) {
    //     this.views.voluntaryWorkList = new VoluntaryWork.Views.List({collection: this.voluntaryWorks});
    //     //console.log('list route created');
    //   } else {
    //     this.views.voluntaryWorkList.show();
    //     //console.log('list route displayed');
    //   }
    // },

    // form: function(id) {
    //   // If "id" is not present, new item creation is triggered

    //   console.log('form route triggered');
    //   var collection = this.voluntaryWorks;

    //   $('#voluntaryWorkDetails').empty();

    //   var router = this;
    //   var constructs = {
    //     collection: router.voluntaryWorks,
    //     linkedItems: {
    //       types: router.types,
    //       municipalities: router.municipalities
    //     }
    //   };

    //   var dependencies = [];

    //   // If id -> then it's edit, so we have to fetch model
    //   if (id) {
    //     // TODO: first look in the collection
    //     constructs.model = new VoluntaryWork.Model({id: id});
    //     dependencies.push(constructs.model.fetch());
    //   }

    //   if (this.municipalities.length < 1) {
    //     dependencies.push(this.municipalities.fetch());
    //   }

    //   if (this.types.length < 1) {
    //     dependencies.push(this.types.fetch());
    //   }

    //   $.when.apply(this, dependencies).done(function() {
    //     var itemView = new VoluntaryWork.Views.Form(constructs).render();

    //     // TODO: DOM manipulation should be done in View instead of router
    //     $('#voluntaryWorkDetails').html(itemView.$el);
    //   });

    //   $('#voluntaryWorkList').hide();
    //   $('#voluntaryWorkDetails').show();

    // }

  });

  return VoluntaryWorkRouter;
});
