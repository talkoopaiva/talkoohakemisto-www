/*
 * grunt-talkoo-server
 *
 * Copyright 2014 alizbazar
 * Licensed under the MIT license.
 */
"use strict";

module.exports = function(grunt) {

  grunt.registerTask("talkooserver", "Run development server.", function() {

    // Put this task into async mode, and never complete it.
    this.async();

    // Setting force to true, keeps Grunt from crashing while running the
    // server.
    grunt.option("force", true);



    return fortuneServer();
  });

};


function fortuneServer() {
  var fortune = require('fortune');

  /**
   * Example application. It implements an imageboard with boards & posts.
   * Note that this implementation does not include access control,
   * so it's more like a wiki but without the moderation.
   */
  fortune({
    name: 'talkoo',
    inMemoryOnly: false
  })

  .resource('voluntary_works', {
      "contact_email": String,
      "description": String,
      "municipality": "municipality",
      "type": "type",
      "name": String,
      "organizer": String,
      "street_address": String
  })

  .resource('type', {
    "name": String
  })

  .resource('municipality', {
    "name": String
  })

  .transform(

    // before storing in database
    function() {
      // TODO: "bump" feature
      this.timestamp = new Date();
      return this;
    },

    // after retrieving from database
    function() {
      this.timestamp = this.timestamp instanceof Date ?
        this.timestamp.getTime() : null;
      return this;
    }

  )

  /*!
   * Start the API
   */
  .listen(1337);
}
