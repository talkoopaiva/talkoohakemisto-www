define(['jquery', 'underscore', 'Handlebars'], function ( $, _, Handlebars ) {

  var selectTmpl = _.template('<select <%= attributes %>><%= options %></select>');
  var optionTmpl = _.template('<option value="<%= id %>"<%= selected %>><%= name %></option>');

  /**
   * Create select list with a possible selection
   * @param  {String} selected name -attribute of the option that is selected
   * @param  {Object (map)} options has to at least include options.hash.name
   *                        and options.data[name][{name:...,id:...}]
   *                        (name has to be the same in the 'data' as in the 'hash'!)
   * @return {String}          HTML representing the select list
   */
  function createSelectList(items, options) {

    if (!items) {
      return '';
    }

    // see if selected property is directly given in options
    var selected = _.result(options, 'selected');

    // If not, iterate through passed hash
    if (!selected) {
      // Get variable name from hash
      var entity = _.chain(options).result('hash').result('selected').value();
      if (entity) {
        // entity may be for ex. municipality.id, so we need to traverse context to get to the value
        selected = _.reduce(entity.split('.'), function(res, key) {
          return _.result(res, key);
        }, this);
      }
    }

    var optionsStr = '';
    if (!selected) {
      optionsStr += optionTmpl({id:"", selected:"", name: "-- Valitse: --"});
    }
    _.each(items, function(item) {
      item.selected = item.id == selected ? ' selected="selected"' : '';
      optionsStr += optionTmpl(item);
    });

    // Set hash as attributes for the select
    var attributeStr = _.map(options.hash, function(value, key) {
      return key + '="' + value + '"';
    }).join(" ");

    return selectTmpl({"attributes": attributeStr, "options": optionsStr});
  }

  Handlebars.registerHelper('select', function() {
    var str = createSelectList.apply(this, arguments);
    // Don't escape the resulting html
    return new Handlebars.SafeString(str);
  });

  return createSelectList;
});
