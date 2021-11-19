$(document).ready(function(){

    var url = 'http://www.clipthatoff.com/static/audio/'

    $("#keyword").keyup(function(){

        if ($(this).val().length >= 3){
            $("#search_button").prop('disabled', false).css('color','white').css('background-color','green');
        }

        if ($(this).val().length < 3){
            $("#search_button").prop('disabled', true).css('color','white').css('background-color','red');
        }


    });



    //Process data if enter is pressed within search term input field
    $('#keyword').keypress(function(event) {
    // enter has keyCode = 13, change it if you want to use another button
    if (event.keyCode == 13) {
        if ($("#keyword").val().length < 3) {
            alert('Search must be at least 3 letters')
            } else {

                submitData()

            }
         }
     });



    $("#search_button").click(function(){

        submitData()

    })



function submitData(){


        $("#swoperesults").empty();
        var keyword = $("#keyword").val()
        $.ajax({
            data : {
                keyword: keyword

            },
            type: 'POST',
            url: '/swopeprocess'
        })
        .done(function(data){

        var results_length = data.keyword.length;
        for (var i=0; i < results_length; i++){
            var filename = data.keyword[i].filename
            var full_url = url + filename
            $("#swopeobject").clone().appendTo($("#swoperesults")).attr('id','testing'+i).css('display','flex');

            var thelink = $('<a>',{
                text: filename,
                title: 'some title',
                href: full_url
            }).appendTo('#swoperesults');


        }

    })




}






});