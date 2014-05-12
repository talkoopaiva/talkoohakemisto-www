define(['module', 'underscore', 'backbone', 'jquery', 'app', 'views/listitem', 'hbars!templates/list'],
        function(module, _, Backbone, $, app, ItemView, template) {
  module.exports = Backbone.Layout.extend({
    template: template,
    addView: function(model) {
      // Insert a nested View into this View.
      var view = this.insertView("#talkoot", new ItemView({ model: model }));
    },

    beforeRender: function() {
      this.collection.each(function(model) {
        this.addView(model);
      }, this);
    },

    afterRender: function() {
      this.listenTo(this.collection, "add", this.addView);
      window.vw = this.collection;
      //require(['async!//maps.google.com/maps/api/js?sensor=true'], function() {

      // FIXME: this is ugly but somehow after building to production gmaps is not loaded yet - i.e. async doesnt work!
      setTimeout(function() {
          require(['gmaps'], function() {

              col = window.vw;
              map = new GMaps({
                div: '#map',
                  lat: 63,
                  lng: 24,
                  zoom: 5
              });
              col.each(function(model) {
                a = model.attributes;
                  if(!!a.lng && !!a.lat) {
                    map.addMarker({
                      icon: "app/img/icons/" + a.type.name.toLowerCase() + "-marker.png",
                      lat: a.lat,
                      lng: a.lng,
                      title: a.name,

                        infoWindow: {
                          content: '<h3><a href="view/'+ a.id +'">'+ a.name+'</a></h3>' +
                          '<div class="talkoot-type">'+ a.type.name +'</div>' +
                          '<div class="talkoot-desc">'+ a.goal + '</div>' +
                          '<div class="talkoot-meta">' +
                            '<i class="glyphicon glyphicon-map-marker"></i> '+ a.location + '<br>' +
                            '<div class="hidden-xs"><i class="glyphicon glyphicon-user"></i> '+ a.organization +'</div>'+
                          '</div>'
                        }

                    });
                  }
              }, this);

          });
        }, 30);
      //});
    }
  });
});
