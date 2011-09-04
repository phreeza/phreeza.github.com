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
    $("#description").attr({placeholder: 'You need to type in a task-description.',});
  }
    else
  {
    $("#timer").startTimer($("#timer").data('countdown.settings'));
    $("#description").attr({placeholder: 'enter task',});
    $("#description").attr({disabled: 'disabled',});
    $('#startstop').delay(200).animate({
      backgroundPosition: '33px'
    }, 150);
    $("#progress").addClass('active');
    $("#progress").progressbar({"value":0});
    addTask($("#description").val(),ISODateString(new Date()),true,0);
  }
  });

  $('#newtask').click(function() {
    $('#startstop').delay(200).animate({
      backgroundPosition: '0px'
    }, 150);
    $("#after-task").slideUp('fast');
    $("#timer").resetTimer();
    $("#description").removeAttr("disabled");
    $("#description").val('')
    $("#progress").removeClass('active');
  });

  $('#shortbreak').click(function() {
    $("#description").val('Short Break')
    $('#startstop').delay(200).animate({
      backgroundPosition: '0px'
    }, 150);
    $("#after-task").slideUp('fast');
    $("#timer").resetTimer($.extend($("#timer").data('countdown.settings'),{time_in_seconds:5*60}));
    $("#timer").startTimer($("#timer").data('countdown.settings'));
    addTask($("#description").val(),ISODateString(new Date()),true,0);
  });
  
  $('#longbreak').click(function() {
    $("#description").val('Long Break')
    $('#startstop').delay(200).animate({
      backgroundPosition: '0px'
    }, 150);
    $("#after-task").slideUp('fast');
    $("#timer").resetTimer($.extend($("#timer").data('countdown.settings'),{time_in_seconds:25*60}));
    $("#timer").startTimer($("#timer").data('countdown.settings'));
    addTask($("#description").val(),ISODateString(new Date()),true,0);
  });


  $('#description').click( //TODO this should only happen in initial configuration, and not be called afterwards.

      function()
      {
	$('#rispen-head').slideUp('fast');
	$('#description').delay(200).animate({
	  width: '580'
	}, 150);
	$('h2.logo').delay(400).fadeIn('fast')
      });

  $('#identifier').keypress(
      function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) {
          //plain reload for now. TODO repopulate dynamically
          window.location.href = "http://rispennl.appspot.com/"+$('#identifier').val();
        }
      }
      );
  $('#description').keypress(
      function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) {
          $('#startstop').click();
        }
      }
      );

  function addTask(task,date,isnew,id)
  {
    var newli = document.createElement('li');
    var taskid = $("#history").children().size();
    newli.id="task" + taskid;
    newli.innerHTML = "<p>"+task+"<abbr class=\"timeago\" title=\""+date+"Z\">"+date+"Z</abbr><button class=\"delete\">Delete</button></p>";
    if (isnew) newli.style.display="none";
    $("#history").prepend(newli);
    $("abbr.timeago").timeago();
    if (isnew) 
    {
        $("#task"+taskid).slideDown("slow");
        $.post("http://rispennl.appspot.com/save",{content:task,author:$("#identifier").val(),item_type:"pomodoro"});
    }
    else
    {
        $("#task"+taskid+" p").children(".delete").click(
            function()
            {
              $.post("http://rispennl.appspot.com/delete",{id:id});
              $("#task"+taskid).slideUp("slow");
            }
            );
    }
  }

  function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())
  }

  function repopTasks(user){
      $.getJSON("http://rispennl.appspot.com/json",
              {author:user},
              function(data){
                data.reverse();
                for (p in data)
                    {
                        addTask(data[p].content,data[p].date,false,data[p].id);
                    }
              })
  }

  if (window.location.protocol == "http:"){
    $("#identifier").val(window.location.pathname.split('/')[1]);}
  repopTasks($("#identifier").val())
});

$(document).ready(function() {

	$('a[href*=#]').bind("click", function(event) {
		event.preventDefault();
		var ziel = $(this).attr("href");

		$('html,body').animate({
			scrollTop: $(ziel).offset().top
		}, 500 , function (){location.hash = ziel;});
});
return false;
});
