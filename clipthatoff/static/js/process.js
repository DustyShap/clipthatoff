var personalityData = {
  'Mike Lee': {
    cssClass: 'mikelee',
    src: "../static/img/mikelee.jpg",
    imageId: 'mike lee',
  },
  'Doug Vaughn': {
    cssClass: 'doug',
    src: "../static/img/vaughn.jpg",
    imageId: 'doug',
  },
  'The Plow Boy': {
    cssClass: 'plowboy',
    src: "../static/img/plowboy.jpg",
    imageId: 'plowboy',
  },
  'Larry Nickel': {
    cssClass: 'larry',
    src: "../static/img/larry.jpg",
    imageId: 'larry',
  },
  'Tim McKernan': {
    cssClass: 'tim',
    src: "../static/img/tmck.jpg",
    imageId: 'tim',
  },
  'Charlie Marlow': {
    cssClass: 'charlie',
    src: "../static/img/soundboards.jpg",
    imageId: 'charlie',
  },
  "Jimmy 'The Cat' Hayes": {
    cssClass: 'cat',
    src: "../static/img/soundboards.jpg",
    imageId: 'cat',
  },
  'Jay Jr': {
    cssClass: 'jayjr',
    src: "../static/img/soundboards.jpg",
    imageId: 'jay jr',
  },
  'Iggy': {
    cssClass: 'iggy',
    src: "../static/img/soundboards.jpg",
    imageId: 'iggy',
  },
  '@ProdJoe': {
    cssClass: 'prodjoe',
    src: "../static/img/soundboards.jpg",
    imageId: 'prodjoe',
  },
  'Timberfake': {
    cssClass: 'timberfake',
    src: "../static/img/soundboards.jpg",
    imageId: 'timberfake',
  },
}

$(document).ready(function(){
    var $results = $("#results_container")
    var $result_object = $("#result_object")
    

    //Display header based on who's audio is selected
    $(".chooser_button").click(function(){
        $("#no_results").hide()
        $(".header_image").removeAttr('id');
        $(".chooser_button").removeClass().addClass('chooser_button');
        var buttonText = $(this).text();

        if ( buttonText in personalityData ) {
            var personality = personalityData[buttonText];
            addClass($(this), personality.cssClass);
            removeSearch()
            $(".header_image").attr('src', personality.src);
            $(".header_image").attr('id', personality.imageId);
            submitData();
        } else if ($(this).text() == 'Search All Drops'){
            $(this).addClass('button_chose');
            $(".header_image").attr('src', "../static/img/soundboards.jpg");
            $(".header_image").attr('id','search_drops');
            $("#search_container").show().css('display','flex');
            $("#search_term").focus();
            $("#upload_window").hide()
            $("#password_window").hide()
            $("#results_container").show();
        }  else if ($(this).text() === 'Last 50 Added'){
            $(this).addClass('button_chose');
            removeSearch()
            submitLastFifty();
        }
    });


    //Process data if a speaker's name is clicked
    $('#submit_button').on('click', function(event) {
        $("#no_results").hide()
        $(".header_image").attr('id','search_drops');
        if ($(".header_image").attr('id')){
            submitSearchData(event)
            $("#no_results").hide()
        }
    });


    //Process data if enter is pressed within search term input field
    $('#search_term').keypress(function(event) {
    // enter has keyCode = 13, change it if you want to use another button
    if (event.keyCode == 13) {
        if ($("#search_term").val().length < 3) {
            alert('Search must be at least 3 letters')
            } else {
                $("#no_results").hide()
                $(".header_image").attr('id','search_drops');
                submitSearchData(event)
            }
         }
     });
});
