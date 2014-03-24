define(['jquery', 'underscore', 'Handlebars'], function ( $, _, Handlebars ) {

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

    // Set hash as attributes for the select
    var res = '<select ';
    res += _.map(options.hash, function(value, key) {
      return key + '="' + value + '"';
    }).join(" ");
    res += '>';

    // see if selected property is directly given in options
    var selected = _.result(options, 'selected');

    // If not, iterate through passed hash
    if (!selected) {
      // Get variable name from hash
      var entity = _.chain(options).result('hash').result('selected').value();
      if (entity) {
        // Get variable value from context
        selected = this[selected];
      }
    }

    if (!selected) {
      res += optionTmpl({id:"", selected:"", name: "-- Valitse: --"});
    }
    _.each(items, function(item) {
      item.selected = item.id == selected ? ' selected="selected"' : '';
      res += optionTmpl(item);
    });

    res += '</select>';

    return res;
  }

  Handlebars.registerHelper('select', createSelectList);
  return createSelectList;
});
