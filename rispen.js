$(function() {
  $("#timer_pomodoro").createTimer({
    time_in_seconds: 25*60,
  tick:function(timer, time_in_seconds, formatted_time)
  {
    $("#progress_pomodoro").attr("value",$("#timer_pomodoro").data('countdown.duration'));
  }
  ,
  autostart: false});

  $("#startstop").click(function() {
    if ($("#timer_pomodoro").data('countdown.state') == 'running')
  {
    $("#timer_pomodoro").resetTimer();
  }
    else
  {
    $("#timer_pomodoro").startTimer($("#timer_pomodoro").data('countdown.settings'));
    var newli = document.createElement('li');
    newli.innerHTML = $("#description").val();

    $("#history").append(newli);
  }
  });
});
