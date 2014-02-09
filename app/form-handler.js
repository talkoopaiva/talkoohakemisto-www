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

    for (var i = 1; i <= 7; i++) {
        $("#form-name")
    }
}