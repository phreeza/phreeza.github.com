$(function() {
  $("#timer").createTimer({
    time_in_seconds: 5, // hack for editing the post-pomodoro screen. TODO revert to 25*60,
  tick:function(timer, time_in_seconds, formatted_time)
  {
    $("#progress").progressbar("option","value",$("#timer").data('countdown.duration')/15000.);
  }
  ,
  autostart: false,
    buzzer: function(){
      $("#final").slideDown('fast'); 
      $("#description").removeClass('active');
      $("#progress").fadeOut('fast');
      $("#startstop").css('display', 'none');
    }
  });

  $("#startstop").click(function() {
    if ($("#timer").data('countdown.state') == 'running')
  {
    $("#timer").resetTimer();
    $("#description").removeAttr("disabled")
    $("#progress").fadeOut('fast');
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
    $("#description").addClass('active');
    $("#progress").progressbar({"value":0});
    addTask($("#description").val(),ISODateString(new Date()),true,0);
    $("#progress").fadeIn('fast');
  }
  });

  $('#newtask').click(function() {
    $('#startstop').delay(200).animate({
      backgroundPosition: '0px'
    }, 150);
    $("#final").slideUp('fast');
    $("#timer").resetTimer();
    $("#description").removeAttr("disabled");
    $("#description").val('')
    $("#progress").fadeOut('fast');
  });

  $('#shortbreak').click(function() {
    $("#description").val('Short Break')
    $('#startstop').delay(200).animate({
      backgroundPosition: '0px'
    }, 150);
    $("#final").slideUp('fast');
    $("#timer").resetTimer($.extend($("#timer").data('countdown.settings'),{time_in_seconds:5*60}));
    $("#timer").startTimer($("#timer").data('countdown.settings'));
    addTask($("#description").val(),ISODateString(new Date()),true,0);
  });
  
  $('#longbreak').click(function() {
    $("#description").val('Long Break')
    $('#startstop').delay(200).animate({
      backgroundPosition: '0px'
    }, 150);
    $("#final").slideUp('fast');
    $("#timer").resetTimer($.extend($("#timer").data('countdown.settings'),{time_in_seconds:25*60}));
    $("#timer").startTimer($("#timer").data('countdown.settings'));
    addTask($("#description").val(),ISODateString(new Date()),true,0);
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
  $('#resumen').keyup(function(){
    var text = $('#resumen').val();
    var textlength = text.length;
    if(textlength > 140){$('#resumen').val(text.substr(0,140));}
  });

  function addTask(task,date,isnew,id)
  {
    task = strip_html(task);
    var newli = document.createElement('li');
    var taskid = $("#history").children().size();
    newli.id="task" + taskid;
    newli.innerHTML = "<div><button class=\"delete small\">Delete</button>"+task+"<abbr class=\"timeago\" title=\""+date+"Z\">"+date+"Z</abbr></div>";
    if (isnew) newli.style.display="none";
    $("#history").prepend(newli);
    $("abbr.timeago").timeago();
    if (isnew) 
    {
        $("#task"+taskid).slideDown("slow");
        $("#task"+taskid).addClass("running");
        $.post("http://rispennl.appspot.com/save",{content:task,author:$("#identifier").val(),item_type:"pomodoro"});
    }
    else
    {
        $("#task"+taskid+" div").children(".delete").click(
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

  function strip_html(html)
  {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent||tmp.innerText;
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

// jQuery Magic

$(function() {

  $('#history li').hover(function() {
    $(this).children('div').children('.hoverNavigation').animate({width: 200px}),1000,
    );
});

// jQuery UI

// Progress-Bar

  $(function() {
    $( "#progress" ).progressbar({
      value: 100
    });
  });

// Radio Buttons

  $(function() {
    $( "#radio" ).buttonset();
  });
	