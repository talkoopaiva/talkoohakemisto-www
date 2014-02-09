define(function(require, exports, module) {
  "use strict";

  var Module = require("modules/voluntary-work");

  // Specify top level modules so that they don't leak into other modules.
  QUnit.module("voluntary-work");

  // Test that the module exists.
  test("voluntary-work", 2, function() {
    ok(Module, "voluntary-work constructor exists.");
  });
});