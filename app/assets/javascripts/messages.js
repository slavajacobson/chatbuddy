$(document).ready(function() {



    $("#new_message").submit(function(e) {
        

        if ($("#new_message input[type='submit']").is(":disabled")) {
           e.preventDefault();
           return false; 
        }
       else if ($("#message_message").val() === "") {
           
           
           alert("Enter a message before sending");
           e.preventDefault();
           return false;
       }
    });
    

    
    $("#new_message").bind('ajax:beforeSend', function() {
        $("#message_message").prop("disabled", true);
        
    
    });
    $("#new_message").bind('ajax:complete', function() {
        $("#message_message").prop("disabled", false);
        $("#message_message").val('');
    
    });

    
    adjustChatSize();
    $(window).resize(function() {
        adjustChatSize();
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });
    
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
    
    //chat tab is active by default
    $("#chat_tab").addClass("active");
    
    $("#draw_tab").click(function(){
        $("#drawing").show();
        $("#messages").hide();
        $("#draw_tab").addClass("active");
        $("#chat_tab").removeClass("active");
        $("#draw_tab").removeClass("activity");
    });
    $("#chat_tab").click(function(){
        $("#drawing").hide();
        
        $("#chat_tab").addClass("active");
        $("#draw_tab").removeClass("active");
        $("#chat_tab").removeClass("activity");
        $("#messages").show();
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        
    });
});

function clearCanvas() {
    // Get a reference to the canvas object
	var canvas = document.getElementById('canvas-2');
	// Create an empty project and a view for the canvas:
	paper.setup(canvas);
	paper.view.draw();
}
function adjustChatSize() {
    var bodyheight = $(window).height() - ($("#message_input").height() + $("#header").height() + 5);
    $("#chat_container").height(bodyheight);
    
    $("#canvas-2").attr("width", $("#messages").width());
    $("#canvas-2").attr("height", $("#messages").height());

}
    
// Enable pusher logging - don't include this in production
Pusher.log = function(message) {
  if (window.console && window.console.log) {
    //window.console.log(message);
  }
};



var pusher = new Pusher('6649b5dc3a0eb9686e09', {
    encrypted: true,
    authEndpoint: '/auth_pusher'
    });
var channel = pusher.subscribe('presence-room1');

channel.bind('new_message', function(data) {
    var message = data.message;
    var time = data.time;
    var nickname = data.nickname;
    
    
    $("#messages").append("<li><span class='nickname'>" + nickname +  "</span> <div class='message_wrapper'><span class='message_tip'></span><span class='message'><span class='time'>" + time + "</span>" + message + "</span></div></li>");

    $("#messages").animate({ scrollTop: $('#messages')[0].scrollHeight}, 1000);
  
    if (!$("#messages").is(":visible")) {
        $("#chat_tab").addClass("activity");
        
    }
    if (!page_active) {
        messages_counter+=1;
        $(document).attr("title", messages_counter + " new messages!"); 
    }
    else {
        messages_counter = 0;
        $(document).attr("title", "ChatBuddy"); 
    }
});


channel.bind('clear_canvas', function(data) {
    clearCanvas();
    $.gritter.add({
        // (string | mandatory) the heading of the notification
        title: 'Whiteboard erased',
        // (string | mandatory) the text inside the notification
        text: data.nickname + ' just cleared the whiteboard.'
    });

});

channel.bind('pusher:subscription_succeeded', function(members) {

  $("#users").empty();
  members.each(function(member) {

    //console.log(member);
    add_member(member);
  });
})
channel.bind('pusher:subscription_error', function(status) {
    window.location.replace("http://"+location.hostname);
});
channel.bind('pusher:member_added', function(member){
  //console.log(member);
    add_member(member);
});

function add_member(member) {
    $("#users").append("<li class='" + member.id + "'>" + member.info.nickname + "<div class='member_color' style='background-color:#" + member.info.color + "'></div>" + "</li>");
}
channel.bind('pusher:member_removed', function(member){
    $("#users ." + member.id).remove();
    $("#messages").append("<li><span class='time'>" + "***" + "</span> <span class='nickname'>Server:</span> <span class='message'>" + member.info.nickname + " left</span></li>");
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
});
  
  
$(window).on("blur focus", function(e) {
    var prevType = $(this).data("prevType");

    if (prevType != e.type) {   //  reduce double fire issues
        switch (e.type) {
            case "blur":
                page_active = false;
                break;
            case "focus":
                page_active = true;
                console.log("active tab")
                $(document).attr("title", "ChatBuddy"); 
                break;
        }
    }

    $(this).data("prevType", e.type);
});

var page_active = true;
messages_counter = 0;



