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
    addTask($("#description").val(),ISODateString(new Date()),true);
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

  function addTask(task,date,isnew)
  {
    var newli = document.createElement('li');
    var taskid = $("#history").children().size();
    newli.id="task" + taskid;
    newli.innerHTML = "<p>"+task+"<span><abbr class=\"timeago\" title=\""+date+"\">"+date+"</abbr></span></p>";
    if (isnew) newli.style.display="none";
    $("#history").prepend(newli);
    $("abbr.timeago").timeago();
    if (isnew) 
    {
        $("#task"+taskid).slideDown("slow");
        $.post("http://rispennl.appspot.com/save",{content:task,author:$("#chiffre").val()});
    }
  }

  function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'
  }
  $.getJSON("http://rispennl.appspot.com/json",
      {author:$("#chiffre").val()}
      function(data){
	    console.log(data)
	for (p in data)
	  {
	    addTask(data[p].content,data[p].date,false);
	  }
      })
});
