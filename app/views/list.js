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
              a = [];
              col.each(function(model) {
                att = model.attributes;
                  if(!!att.lng && !!att.lat) {
                      var found = false;
                      for (var i = 0; i < a.length; i++) {
                          if (Math.abs(a[i][0].lat - att.lat) < 0.01 && Math.abs(a[i][0].lng - att.lng) < 0.01) {
                              a[i].push(att);
                              found = true;
                          }
                      }
                      if (!found) {
                          this.a.push(new Array(att));
                      }
                  }
              }, this);
              for (var i = 0; i < a.length; i++) {

                var content = '';
                if(a[i].length == 1) {
                    b = a[i][0];
                    content = '<h3><a href="view/' + b.id +'">' + b.name + '</a></h3>' +
                    '<div class="talkoot-type">' + b.type.name +'</div>' +
                    '<div class="talkoot-desc">' + b.goal + '</div>' +
                    '<div class="talkoot-meta">' +
                    '<i class="glyphicon glyphicon-map-marker"></i> ' + b.location + '<br>' +
                    '<div class="hidden-xs"><i class="glyphicon glyphicon-user"></i> ' + b.organization + '</div>' +
                    '</div>';
                } else {
                    for (var j = 0; j < a[i].length; j++) {
                       content += '<h3><a href="view/'+ a[i][j].id +'">'+ a[i][j].name+'</a></h3>';
                    }
                }
                map.addMarker({
                  icon: "app/img/icons/" + a[i][0].type.name.toLowerCase() + "-marker.png",
                  lat: a[i][0].lat,
                  lng: a[i][0].lng,
                  title: a[i][0].name,
                  infoWindow: {
                    content: content
                  }
                });
              }
          });
        }, 30);
      //});
    }
  });
});
