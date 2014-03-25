define(['jquery', 'underscore', 'app', 'Handlebars'], function ( $, _, app, Handlebars ) {

  function mapaddress() {
    var parts = [];
    if (this.street_address) {
      parts.push(this.street_address);
    }
    if (_.chain(this.municipality).result('name').value()) {
      parts.push(this.municipality.name);
    }
    return encodeURIComponent(parts.join(', '));
  }

  Handlebars.registerHelper('mapaddress', mapaddress);

  return mapaddress;

});
