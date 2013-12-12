$(document).ready(function() {
    
    $("form.set_nickname_form").submit(function(e) { 
        if ($("#nickname_Nickname").val().length < 3) {
            alert("Enter a nickname of at least 3 characters");
            e.preventDefault();
        }
    
    });

});