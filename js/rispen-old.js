$(function() {
  $("#timer").createTimer({
    time_in_seconds: 25, // hack for editing the post-pomodoro screen. TODO revert to 25*60,
  tick:function(timer, time_in_seconds, formatted_time)
  {
    $("#progressBar").css({
      width: (100.-time_in_seconds*100./(25.))+"%"});
    document.title = formatted_time + " - Rispen";

  }
  ,
  autostart: false,
  buzzer: function(){
    $('#actionContainer').css({ height: "auto" });
    $('#afterTask').show("drop", { direction: "up" }, 200);
    $("#task").removeClass('active');
    $("#startStop").css('display', 'none');
    var taskid = $("#history").children().size()-1;
  }
  });

  $("#startStop").click(function() {
    if ($("#timer").data('countdown.state') == 'running')
  {
    $("#timer").resetTimer();
    $('#action').effect("shake", { times:2 }, 80);
    var taskid = $("#history").children().size()-1;
  }
    else if (trim($("#task").val()) == '')
  {
    $("#task").val('');
    $("#task").attr({placeholder: 'You need to type in a task description.',});
  }
    else
  {
    $("#timer").startTimer($("#timer").data('countdown.settings'));
    $("#startStop div").animate({
      marginTop: '-36px'
    }, 100);
    $('#welcome').slideUp(80);
    $('#historyContainer').show("drop", { direction: "up" }, 200);
    $("#task").attr({placeholder: 'What do you want to do?',});
    $("#task").attr({disabled: 'disabled',});
    addTask($("#task").val(),ISODateString(new Date()),true,0);
  }
  });

  // Display of Stop Task 
  
  $("#startStop").hover(function() {
    if ($("#timer").data('countdown.state') == 'running')
  {
    $("#startStop div").animate({
      marginTop: '-72px'
    }, 100);
  }
  },function() {
    if ($("#timer").data('countdown.state') == 'running')
  {
    $("#startStop div").animate({
      marginTop: '-36px'
    }, 100);
  }
  }

  );


  $('#newtask').click(function() {
    $('#startstop').delay(200).animate({
      backgroundPosition: '0px'
    }, 150);
    $("#summary").slideUp('fast');
    $("#timer").resetTimer();
    $("#task").removeAttr("disabled");
    $("#task").val('')
  });

  $('#shortbreak').click(function() {
    $("#task").val('Short Break')
    $('#startstop').delay(200).animate({
      backgroundPosition: '0px'
    }, 150);
  $("#summary").slideUp('fast');
  $("#timer").resetTimer($.extend($("#timer").data('countdown.settings'),{time_in_seconds:5*60}));
  $("#timer").startTimer($("#timer").data('countdown.settings'));
  addBreak("shortBreak",ISODateString(new Date()),true,0);
  });

  $('#longbreak').click(function() {
    $("#task").val('Long Break')
    $('#startstop').delay(200).animate({
      backgroundPosition: '0px'
    }, 150);
  $("#summary").slideUp('fast');
  $("#timer").resetTimer($.extend($("#timer").data('countdown.settings'),{time_in_seconds:25*60}));
  $("#timer").startTimer($("#timer").data('countdown.settings'));
  addBreak("longBreak",ISODateString(new Date()),true,0);
  });

  $('#identifier').keypress(
      function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) {
          $("#rename").click();
        }
      }
      );

  $('#task').keypress(
      function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) {
          $('#startStop').click();
        }
      }
      );
  $('#resumen,#task').keyup(function(){
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


  // Radio Buttons

  $( "#radio" ).buttonset();

  function addBreak(type,date,isnew,id)
  {
    var newli = document.createElement('li');
    var taskid = $("#history").children().size();
    if (type == "longBreak") var task = "Long Break"
      if (type == "shortBreak") var task = "Short Break"
        newli.innerHTML = "<div>"+task+"<span class=\"delete\">×</span><abbr class=\"timeago\" title=\""+date+"Z\">"+date+"Z</abbr></div>";
    newli.id="task" + taskid;
    newli.addClass(type);
    if (isnew) newli.style.display="none";
    $("#history").prepend(newli);
    $("abbr.timeago").timeago();
    if (isnew) 
    {
      $("#task"+taskid).slideDown("slow");
      //$("#task"+taskid).addClass("running");
      $.getJSON("http://rispennl.appspot.com/save",
          {content:task,author:$("#identifier").val(),item_type:type},
          function(data){
            //assign delete button
            $("#task"+taskid+" div").children(".delete").click(
              function()
              {
                $.post("http://rispennl.appspot.com/delete",{id:data.id});
                $("#task"+taskid).slideUp("slow");
              }
              );
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

  }

  function addTask(task,date,isnew,id,fb_text,fb_rating)
  {
    fb_rating = typeof(fb_rating) != 'undefined' ? fb_rating : "";
    fb_text = typeof(fb_text) != 'undefined' ? fb_text : "";
    fb_text = fb_text != 'undefined' ? fb_text : "";
    task = strip_html(task);
    var newli = document.createElement('li');
    var taskid = $("#history").children().size();
    newli.id="task" + taskid;
    newli.innerHTML = "<h2><span class=\"expand\">▼</span>"+task+"</h2><abbr class=\"timeago\" title=\""+date+"Z\">"+date+"Z</abbr><div class=\"taskInfo\"><p class=\"summary\"></p><div class=\"taskOptions\"><span class=\"geoLocation\">Coworking Space Garage Bilk</span><span class=\"delete\">Delete ×</span></div></div>";
    if (isnew) newli.style.display="none";

    $("#history").prepend(newli);
    $("abbr.timeago").timeago();
    if (isnew) 
    {
      $("#task"+taskid).addClass("task");
      $("#task"+taskid).addClass("neutral");
      //$("#task"+taskid).slideDown("slow");
      $("#task"+taskid).hide();
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
            $("#sendTask").unbind("click.sendfeedback");
            $("#sendTask").bind("click.sendfeedback", function()
              {
                $("#task"+taskid+" .summary").html($("#summaryTextarea").val());
                $("#task"+taskid).removeClass("neutral");
                fb_rating = 2;
                if ($('#progressBar').hasClass("positive"))
                {
                  $("#task"+taskid).removeClass("neutral");
                  $("#task"+taskid).addClass("positive");
                  fb_rating = 3;
                }
                else if ($('#progressBar').hasClass("negative"))
                {
                  $("#task"+taskid).removeClass("neutral");
                  $("#task"+taskid).addClass("negative");
                  fb_rating = 1;
                }
                else //assume neutral. ($('#progressBar').hasClass("neutral"))
                {
                  $("#task"+taskid).removeClass("neutral");
                  $("#task"+taskid).addClass("neutral");
                  fb_rating = 2;
                }

                $.getJSON("http://rispennl.appspot.com/complete",{id:data.id,feedback_text:strip_html($("#summaryTextarea").val()),feedback_rating:fb_rating});

                finishTaskAnimate(taskid);
              });

          }
      );
    }
    else
    {
      rating_classes = new Array("","negative","neutral","positive");
      $("#task"+taskid).addClass("task");
      $("#task"+taskid).addClass(rating_classes[fb_rating]);
      $("#task"+taskid+" .summary").html(fb_text);
      $("#task"+taskid+" div").children(".delete").click(
          function()
          {
            $.post("http://rispennl.appspot.com/delete",{id:id});
            $(this).parent('div').parent('div').parent('li').hide("drop", { direction: "left" }, 200);
          }
          );
    }
    $("#task"+taskid+" .expand").click(function() {
      //$(this).parent().children('.expandables').slideToggle('fast');
      $(this).parent('h2').parent('li').children('.taskInfo').slideToggle('fast');
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
      addTask(
        task_list[p].content,
        task_list[p].date,
        false,
        task_list[p].id,
        task_list[p].feedback_text,
        task_list[p].feedback_rating);
    }
        });
  }

  function finishTaskAnimate(taskid) {

    // This is only necessary for demonstration-purposes
    $('#task'+taskid).children('.taskInfo').css({
      display: "none",
    });

    $('#form').animate({ 
      backgroundColor: "rgb(50,50,50)",
    }, 100);
    $('#form input').animate({ 
      backgroundColor: "rgb(50,50,50)",
      color: "#fff",
    }, 100);
    $('#form textarea').animate({ 
      backgroundColor: "rgb(50,50,50)",
      color: "#fff",
    }, 100);
    $('#actionContainer').animate({ 
      height: "86px",
    }, 100);
    $('#afterTask').slideUp("fast");
    $('#action').delay(250).hide("drop", { direction: "down" }, 300);
    $('#task'+taskid).delay(300).show("bounce", { times:2 }, 300);
    $('#form').delay(350).animate({ 
      backgroundColor: "rgb(200,200,200)",
    }, 100);
    $('#form input').delay(350).animate({ 
      backgroundColor: "rgb(255,255,255)",
      color: "rgb(50,50,50)"
    }, 100);
    $('#form textarea').delay(350).animate({ 
      backgroundColor: "rgb(255,255,255)",
      color: "rgb(50,50,50)"
    }, 100);
    $('#startStop').delay(380).fadeIn("fast");
    $('#progressBar').delay(380).animate({
      width: "0",
    }, 10 );
    $('#action').delay(400).show("drop", { direction: "down" }, 200);
    $("#task").removeAttr('disabled');
    $("#task").val('');
    $("#startStop div").animate({
      marginTop: '0px'
    }, 100);
    //$("#startStop").unbind('mouseenter mouseleave');
    $("#timer").data('countdown.state','done');
  }

  function strip_html(html)
  {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent||tmp.innerText;
  }

  function trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g,"");
  }

  if (window.location.protocol == "http:"){
    $("#identifier").val(window.location.pathname.split('/')[1]);
    var oldname = $("#identifier").val();
    repopTasks(oldname);
  }
  else {
    $("#identifier").val("localuser");
    repopTasks("localuser");
  }
});

/*$(document).ready(function() {

  $('a[href*=#]').bind("click", function(event) {
    event.preventDefault();
    var ziel = $(this).attr("href");

    $('html,body').animate({
      scrollTop: $(ziel).offset().top
    }, 500 , function (){location.hash = ziel;});
  });
  return false;
});*/
