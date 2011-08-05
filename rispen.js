$(function() {
  $("#timer").createTimer({
    time_in_seconds: 25*60,
  tick:function(timer, time_in_seconds, formatted_time)
  {
    $("#progress").attr("value",$("#timer").data('countdown.duration'));
  }
  ,
  autostart: false});

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
    newli.innerHTML = "<p>"+$("#description").val()+"<span>Time</span></p>";
	  $("#description").attr({disabled: 'disabled',});
	  $("#progress").addClass('active');
    $("#history").prepend(newli);
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
