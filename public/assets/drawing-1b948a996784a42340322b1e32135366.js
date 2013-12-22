var personal_color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);

channel.bind('client-draw', function(data) {


    
    
    if (!$("#canvas-2").is(":visible")) {
        $("#draw_tab").addClass("activity");
        
    }
    var canvas = document.getElementById('canvas-2');
    //paper.setup(canvas);

    var myPath = new paper.Path();
    myPath.strokeColor = '#' + data.color;
    
    
    data.points.forEach(function(entry) {
        myPath.add(new paper.Point(entry.x, entry.y));
    });
    

    myPath.simplify();
    
    paper.view.draw();
	

});


