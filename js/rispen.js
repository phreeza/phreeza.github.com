// Continue without Registration
// ---

$('#noRegistration').click(function() {
  $(this).parent('.container').parent('.notification').addClass( "noRegistration", 50 );
});

// Tasks
// ---

// Moods

$('#mood').children('.positive').click(function() {
  $('#progressBar').animate({
    backgroundColor: "rgb(60,160,50)",
  }, 150 );
});
$('#mood').children('.neutral').click(function() {
  $('#progressBar').animate({
    backgroundColor: "rgb(255,120,0)",
  }, 150 );
});
$('#mood').children('.negative').click(function() {
  $('#progressBar').animate({
    backgroundColor: "rgb(190,10,30)",
  }, 150 );
});


$('#addMood').click(function() {
  $('#afterTask').show("drop", { direction: "up" }, 200);
});

// Finished

$('#finishedTask').click(function() {

  // This is only necessary for demonstration-purposes
  $('#task5').children('.taskInfo').css({
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
  $('#task5').delay(300).show("bounce", { times:2 }, 300);
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
});

// Expand

$('.expand').click(function() {
  $(this).parent('h2').parent('li').children('.taskInfo').slideToggle('fast');
});

// Delete

$('.delete').click(function() {
  $(this).parent('div').parent('div').parent('li').hide("drop", { direction: "left" }, 200);
});

// Debug

$('#pomodoro').click(function() {
  $('#task').animate({
    backgroundColor: "rgb(200,200,200)",
  }, 10 );

  $('#progressBar').animate({
    width: "560px",
  }, 2000 );
  $('#startStop').delay(2200).fadeOut("fast");
  $('#afterTask').delay(2200).show("drop", { direction: "up" }, 200);
  $('#actionContainer').delay(2200).animate({ 
    height: "225px",
  }, 100);
});