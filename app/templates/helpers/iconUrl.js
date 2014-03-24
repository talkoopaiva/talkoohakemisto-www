define(['jquery', 'underscore', 'app', 'Handlebars'], function ( $, _, app, Handlebars ) {

  function iconUrl(name) {
    name = name || 'kunnostus';
    return app.imgRoot + 'icons/' + name.toLowerCase().replace("ö", "o").replace("ä", "a") + '.png';
  }

  Handlebars.registerHelper('iconUrl', iconUrl);

  return iconUrl;

});
