define(['module', 'underscore', 'backbone', 'jquery', 'app', 'hbs!../templates/form', 'models/voluntary-work'],
        function(module, _, Backbone, $, app, template, VoluntaryWork) {
  module.exports = Backbone.Layout.extend({
    template: template,

    events: {
      "submit #voluntary-work-form": "handleForm",
      "click .vw-type": "selectImage",
      "click .form-control": "hideErrors",
      "change .form-control": "hideErrors"
    },

    initialize: function() {
      if (!this.model) {
        this.model = new VoluntaryWork();
      }
      // On validation error, point the errors
      this.model.on('invalid', function(model, errors) {
        this.showErrors.call(this, errors);
      }, this);
    },

    serialize: function() {
      // TODO: prepare data for form rendering
      return this.model ? this.model.toJSON() : {};
    },

    showErrors: function(errors) {
      _.each(errors, function (error) {
        // Find field in question
        this.$el.find('[name="' + error.name + '"]')
          // Highlight corresponding
          .closest('.form-group').toggleClass('has-error', true)
          // Add error msg
          .find('.help-block').text(error.message);
      }, this);
    },

    hideErrors: function (e) {
      // Find field in question, or select all the field
      var fieldgroup = e ? $(e.currentTarget).closest('.form-group') : $('.form-group');
      fieldgroup.removeClass('has-error')
        .find('.help-block').text('');
    },

    selectImage: function(element) {
      $('.vw-type').removeClass('selected').css("background-color", "white");
      $(element.target).toggleClass('selected', true).css("background-color", "#0e76bc");
    },

    handleForm: function(e) {
      if (e) {
        e.preventDefault();
      }

      // Prevent double submissions
      if (this.model.isRequest) {
        return;
      }

      // Get form fields in the form of attr[name] = value
      var attr = _.reduce($("#voluntary-work-form").serializeArray(), function(result, field) {
        result[field.name] = field.value;
        return result;
      }, {});

      // Hide possible errors from previous submission
      this.hideErrors();

      // Set attributes and validate - if not, cancel
      if (!this.model.set(attr, {validate: true})) {
        return;
      };

      app.trigger('voluntary-work-submission', [model, attr]);
    }

  });
});
