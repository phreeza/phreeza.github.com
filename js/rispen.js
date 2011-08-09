$(function() {
  $("#timer").createTimer({
    time_in_seconds: 2, // hack for editing the post-pomodoro screen. TODO revert to 25*60,
  tick:function(timer, time_in_seconds, formatted_time)
  {
    $("#progress").progressbar("option","value",$("#timer").data('countdown.duration')/15000.);
  }
  ,
  autostart: false,
  buzzer: function(){ $("#after-task").slideDown('fast'); }
  });

  $("#startstop").click(function() {
    if ($("#timer").data('countdown.state') == 'running')
  {
    $("#timer").resetTimer();
    $("#description").removeAttr("disabled")
    $("#progress").removeClass('active');
  }
    else if ($("#description").val() == '')
  {
    $("#description").addClass('yuno');
    $("#description").attr({placeholder: '(yಠ,ಠ)y  Y U NO ENTER TASK-DESCRIPTION?',});
  }
    else
  {
    $("#timer").startTimer($("#timer").data('countdown.settings'));
    $("#description").removeClass('yuno');
    $("#description").attr({placeholder: 'enter task',});
    $("#description").attr({disabled: 'disabled',});
    $("#progress").addClass('active');
    $("#progress").progressbar({"value":0});
    addTask($("#description").val(),true);
  }
  });

  $('#newtask').click(function() {
    $("#after-task").slideUp('fast');
    $("#timer").resetTimer();
    $("#description").removeAttr("disabled");
    $("#description").val('')
    $("#progress").removeClass('active');
  });

  $('#description').click( //TODO this should only happen in initial configuration, and not be called afterwards.

      function()
      {
	$('#rispen-head').slideUp('fast');
	$('#task-wrapper').animate({
	  width: '800',
	}, 100);
	$('#description').animate({
	  marginLeft: '0',
	  width: '625'
	}, 100);
	$('h2.logo').fadeIn('slow');
      });

  function addTask(task,slide)
  {
    var newli = document.createElement('li');
    var now = new Date();
    var isonow = ISODateString(now);
    var taskid = $("#history").children().size();
    newli.id="task" + taskid;
    newli.innerHTML = "<p>"+task+"<span><abbr class=\"timeago\" title=\""+isonow+"\">"+isonow+"</abbr></span></p>";
    if (slide) newli.style.display="none";
    $("#history").prepend(newli);
    $("abbr.timeago").timeago();
    if (slide) $("#task"+taskid).slideDown("slow");

  }

  function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'}

});
