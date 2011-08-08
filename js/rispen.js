$(function() {
  $("#timer").createTimer({
    time_in_seconds: 25*60,
  tick:function(timer, time_in_seconds, formatted_time)
  {
    $("#progress").progressbar("option","value",$("#timer").data('countdown.duration')/1500000);
  }
  ,
  autostart: false,
  buzzer: function(){ $("#after-task").slideDown(); }
  });

  $("#startstop").click(function() {
    if ($("#timer").data('countdown.state') == 'running')
  {
    $("#timer").resetTimer();
    $("#description").removeAttr("disabled")
    $("#progress").attr({display: 'none',})
  }
    else
  {
    $("#timer").startTimer($("#timer").data('countdown.settings'));
    var newli = document.createElement('li');
    newli.style.display="none";
    newli.id="task";
    newli.innerHTML = "<p>"+$("#description").val()+"<span>Time</span></p>";
    $("#description").attr({disabled: 'disabled',});
    $("#progress").addClass('active');
    $("#progress").progressbar({"value":0});
    $("#history").prepend(newli);
    $("#task").slideDown("slow")

  }
  });

	$('#description').click(

function()
  {
    $('#rispen-head').slideUp('fast');
    $('#description').animate({
  	  marginLeft: '0',
    }, 100);
    $('h2.logo').animate({
  	  width: '125px',
  	  marginLeft: '0',
    }, 300);
  });

});
