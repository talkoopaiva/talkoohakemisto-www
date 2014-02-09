var app = require("app");

var selectedImage = 0;

function selectImage(number) {
    for (var i = 1; i <= 7; i++) {
        $("#form-type-"+i).css("background-color", "white");
    }
    $("#form-type-"+number).css("background-color", "red");

    selectedImage = number;
}


function handleForm() {


    //form-type-
    console.log($("#form-name").val());
    console.log($("#form-description").val());
    console.log($("#form-municipality").val());
    console.log($("#form-address").val());
    console.log($("#form-realname").val());
    console.log($("#form-email").val());

    var name = $("#form-name").val();

    var VoluntaryWorkModel = Backbone.Model.extend({
      defaults: {

      }
    });

    var VoluntaryWorkCollection = Backbone.Collection.extend({
      model: VoluntaryWorkModel,
      url: app.api + 'voluntary_works'
    });

    var vwcol = new VoluntaryWorkCollection();

    var ok = vwcol.create({voluntary_works: [{
        "name": $("#form-name").val(),
        "description": $("#form-description").val(),
        "links": {
          "municipality": parseInt($("#form-municipality").val()),
          "type": selectedImage
        },
        "contact_email": $("#form-email").val(),
        "street_address": $("#form-address").val(),
        "organizer": $("#form-realname").val()
    }]});

    console.log(ok);

}

