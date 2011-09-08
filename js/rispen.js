$(function() {
  $("#timer").createTimer({
    time_in_seconds: 5, // hack for editing the post-pomodoro screen. TODO revert to 25*60,
  tick:function(timer, time_in_seconds, formatted_time)
  {
    $("#progress").progressbar("option","value",time_in_seconds*100/5);//also change this 5 back to 25*60
  }
  ,
  autostart: false,
    buzzer: function(){
      $("#final").slideDown('fast'); 
      $("#description").removeClass('active');
      $("#progress").fadeOut('fast');
      $("#startstop").css('display', 'none');
      var taskid = $("#history").children().size()-1;
      $("#task"+taskid).removeClass("running");
    }
  });

  $("#startstop").click(function() {
    if ($("#timer").data('countdown.state') == 'running')
  {
    $("#timer").resetTimer();
    $("#progress").fadeOut('fast');
  }
    else if ($("#description").val() == '')
  {
    $("#description").attr({placeholder: 'You need to type in a task-description.',});
  }
    else
  {
    $("#timer").startTimer($("#timer").data('countdown.settings'));
    $("#startstop div").animate({
      marginTop: '-25px'
    }, 100);
    $("#description").attr({placeholder: 'enter task',});
    $("#description").attr({disabled: 'disabled',});
    $("#description").addClass('active');
    $("#progress").progressbar({"value":100});
    addTask($("#description").val(),ISODateString(new Date()),true,0);
    $("#progress").fadeIn('fast');
  }
  });
  
// Display of Stop Task 
  
  $("#startstop").hover(function() {
    if ($("#timer").data('countdown.state') == 'running')
  {
    $("#startstop div").animate({
      marginTop: '-50px'
    }, 100);
  }
  },function() {
    if ($("#timer").data('countdown.state') == 'running')
  {
    $("#startstop div").animate({
      marginTop: '-25px'
    }, 100);
  }
  }
  
  );
  

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
          $("#rename").click();
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
  $('#resumen,#description').keyup(function(){
    var text = $(this).val();
    var textlength = text.length;
    if(textlength > 140){$(this).val(text.substr(0,140));}
  });


  $('#history li').hover(
      function() 
      {
        $(this).children('div').children('.hoverNavigation').stop();
        $(this).children('div').children('.hoverNavigation').animate({width: '48px'},100);
      },
      function() 
      {
        $(this).children('div').children('.hoverNavigation').stop();
        $(this).children('div').children('.hoverNavigation').animate({width: '0px'},100);
      }
      );

  $("#rename").click(function(){
    $.getJSON("http://rispennl.appspot.com/rename",
      {newname:$("#identifier").val(),oldname:oldname});
    window.location.href = "http://rispennl.appspot.com/"+$('#identifier').val();
  })

  // Progress-Bar

  $( "#progress" ).progressbar({
    value: 100
  });

  // Radio Buttons

  $( "#radio" ).buttonset();

  function addTask(task,date,isnew,id)
  {
    task = strip_html(task);
    var newli = document.createElement('li');
    var taskid = $("#history").children().size();
    newli.id="task" + taskid;
    newli.innerHTML = "<div><a href=\"#\" class=\"expand\"><span>Expand</span></a>"+task+"<span class=\"delete\">×</span><abbr class=\"timeago\" title=\""+date+"Z\">"+date+"Z</abbr><div class=\"expandables\"><p class=\"summary\">epic win</p><p class=\"rating\">+1</p></div></div>";
    if (isnew) newli.style.display="none";
    $("#history").prepend(newli);
    $("abbr.timeago").timeago();
    if (isnew) 
    {
      $("#task"+taskid).slideDown("slow");
      $("#task"+taskid).addClass("running");
      $.getJSON("http://rispennl.appspot.com/save",
          {content:task,author:$("#identifier").val(),item_type:"pomodoro"},
          function(data){
            //assign delete button
            $("#task"+taskid+" div").children(".delete").click(
              function()
              {
                $.post("http://rispennl.appspot.com/delete",{id:data.id});
                $("#task"+taskid).slideUp("slow");
              }
              );
            //assign feedback sending function
            $("#newtask").unbind("click.sendfeedback");
            $("#newtask").bind("click.sendfeedback", function()
              {
              $.getJSON("http://rispennl.appspot.com/complete",{id:data.id,feedback_text:strip_html($("#resumen").val()),feedback_rating:1});
              });
          
          }
          );
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
    $("#task"+taskid+" .expand").click(function() {
    $(this).parent().children('.expandables').slideToggle('fast');
});
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
              function(task_list){
                task_list.reverse();
                for (p in task_list)
                {
                  addTask(task_list[p].content,task_list[p].date,false,task_list[p].id);
                }
              });
  }

  function strip_html(html)
  {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent||tmp.innerText;
  }
 
  if (window.location.protocol == "http:"){
    $("#identifier").val(window.location.pathname.split('/')[1]);
    var oldname = $("#identifier").val();
    repopTasks(oldname);
  }
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
