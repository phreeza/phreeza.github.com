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
  }
    else
  {
    $("#timer").startTimer($("#timer").data('countdown.settings'));
    var newli = document.createElement('li');
    newli.innerHTML = "<p>"+$("#description").val()+"<span>Time</span></p>";
	  $("#description").attr({
      disabled: 'disabled',
    });
    $("#history").prepend(newli);
  }
  });
});
