//This file acts as the holder of all of the scripts/functions used in other files

var $results = $("#results_container")
var $result_object = $("#result_object")
// var url = '../static/audio/'
var s3_url='https://tmadrops.s3.us-west-2.amazonaws.com/'



//Function to query the DB for the last 50 added drops
function submitLastFifty(event) {
  $("#password_window").hide()
  $("#upload_window").hide()
  $("#results_container").empty();
  var chosen = 'last_fifty'
  $.ajax({
      data: {
        tags: null,
        chosen: chosen
      },
      type: 'POST',
      url: '/process'
    })
    .done(function(data) {
      processData(data)
    });
};


function submitUrlSearch(search_term){
  $("#password_window").hide()
  $("#upload_window").hide()
  $("#search_container").show().css('display', 'flex');
  $("#search_term").val(search_term);
  $("#results_container").empty();
  $("#instructions").hide();
  $("#length_display").attr('display', 'none');
  window.history.pushState("Clip That Off", "Clip That Off", "/");
  $.ajax({
      data: {
        tags: search_term,
        chosen: 'search_drops',
      },
      type: 'POST',
      url: '/process'
    })
    .done(function(data) {
      processData(data);
    });
};


//Function that takes a searched value and queries the DB for associated tags
function submitSearchData(event) {

  $("#password_window").hide()
  $("#upload_window").hide()
  var chosen = $(".header_image").attr('id');
  // if the search drop button was clicked, the id of the header is search_drops
  $("#search_container").show().css('display', 'flex');
  $("#results_container").empty();
  $("#instructions").hide();
  $("#length_display").attr('display', 'none');

  $.ajax({
      data: {
        tags: $('#search_term').val(),
        chosen: chosen
      },
      type: 'POST',
      url: '/process'
    })
    .done(function(data) {
      processData(data);
      postSearchServer($('#search_term').val())
    });
};


//Function to submit Data to process endpoint when a name is clicked
function submitData() {
  $("#upload_window").hide()
  $("#password_window").hide()
  var chosen = $(".header_image").attr('id');
  $("#results_container").empty();
  $("#instructions").hide();
  $("#length_display").attr('display', 'none');


  $.ajax({
      data: {
        tags: $('#search_term').val(),
        chosen: chosen
      },
      type: 'POST',
      url: '/process'
    })

    .done(function(data) {
      processData(data);
    });
}


//This function takes data returned from the server (which is drops returned from a query)
//and adds the information to a result object which is appended into the result container
function processData(data) {
  var search_method = data.search_method;
  var results_length = data.drops.length;
  if (results_length < 1) {
    $("#results_container").empty();
    $("#no_results").css('display','flex');
  }
  for (var i = 0; i < results_length; i++) {
    $results.show();
    var filename = data.drops[i].filename;
    var speaker = data.drops[i].speaker;
    var transcription = data.drops[i].transcription;
    var full_url = s3_url + filename;
    $result_object.clone().appendTo($("#results_container")).attr('id', 'result' + i).addClass("search_result");
    $("#result" + i).attr('draggable', 'True');
    $("#result" + i + " #speaker").text(speaker).css('color', 'red');
    if (search_method == 'name') {
      $("#result" + i + " #speaker").text(speaker).css('color', 'red').css('display', 'none');
    }
    $("#result" + i + " #transcription").text(transcription).css('color', 'black');
    $("#result" + i + " #src").attr('src', full_url);
    $("#result" + i + " #wav").attr('src', full_url);
  }
  $('.fa-play-circle').on('click', clickplay);
  $('.fa-pause-circle').on('click', clickpause);
  $(".link_button").on('click', clicklink);
  $('.search_result').hover(function() {
    $(this).children()[2].className = 'gripper_container gripper_hover'
  }, function() {
    $(this).children()[2].className = 'gripper_container';
  });
}


//CLICK FUNCTIONS


//Play audio contained within individual cell
$(".cell").click(function() {

  if ($(this).find('audio').length) {
    var audio = $(this.children)[2];
    var filename = $(this).children()[2].getAttribute('src').slice(16);
    var element = 'cell';
    audio.play();
    postServer(filename, true)

  }
});

//Function to handle play in a result object
function clickplay(e) {
  $(this).parent().children()[2].play();
  var filename = $(this).parent()[0].children[2].children[0].getAttribute('src').slice(16)
  postServer(filename, false)
}

function postServer(filename, cell_clicked){
  console.log(filename.slice(28))
  console.log(cell_clicked)
    $.ajax({
      data: {
        filename: filename.slice(28),
        cell_clicked: cell_clicked
      },
      type: 'POST',
      url: '/click_stat'
    })
}

function postSearchServer(search_string){
    $.ajax({
        data:{
          search_string:search_string
        },
        type: 'POST',
        url: '/search_stat'
    })
}

//Function to handle pause in a result object
function clickpause(e) {
  $(this).parent().children()[2].pause();
}

//Function to handle generating a link in a result object
function clicklink(e) {
  var filename = $(this).parent().parent()[0].children[2].children[0].getAttribute('src').slice(44);
  full = s3_url + filename;
  var a = $(this).parent()[0];
  a.setAttribute('href', full);
}

//Function to add the button_chose as well as the speaker name as classes
function addClass($element, classtoAdd) {
  $element.addClass(classtoAdd).addClass('button_chose')
}

//Function to remove the search bar
function removeSearch() {
  $("#search_container").css('display', 'none');
}




//Search term input validation
$("#search_term").keyup(function() {

  if ($(this).val().length >= 3) {
    $("#submit_button").prop('disabled', false).css('color', 'white').css('background-color', 'green');
  }

  if ($(this).val().length < 3) {
    $("#submit_button").prop('disabled', true).css('color', 'white').css('background-color', 'red');
  }
});
