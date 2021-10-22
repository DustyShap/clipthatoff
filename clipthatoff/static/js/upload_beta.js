$(document).ready(function(){




    $("#upload_button").click(function(){

        $("#main_grid").hide();
        $("#pw_window").css('display','flex');
        $(this).hide();
        $("#form").hide();
        $("#results_container").empty();
        $("#instructions").hide();


    });

    $("#pw_cancel").click(function(){
        $("#pw_window").css('display','none');
        $("#main_grid").css('display','flex');
        $("#pwd").val("");
        $("#upload_button").show();
        $("#form").show();




    });

    $("#pw_submit").click(function(){

        if ($("#pwd").val() === 'thinkaboutit'){

            $("#pw_window").css('display','none');
            $("#upload_window").css('display','flex');


        } else {
            alert('Incorrect Password')
        }


    });

    $("#upload_cancel").click(function(){

        $("#main_grid").css('display','flex');
        $("#upload_window").css('display','none');
        $("#upload_button").show();
        $("#form").show();

    });






     $("#upload_form").on('submit', function(event){




        var form_data = new FormData($("#upload_form")[0]);

        $.ajax({
            type: "POST",
            url: "/upload",
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: false,

           })

        .done(function(data){



        })

        .fail(function(xhr, status, errorThrown){

            alert('Not a sound file!');

        }
        event.preventDefault();
        $("#main_grid").css('display','flex');
        $("#upload_window").css('display','none');
        $("#upload_button").show();
        $("#bttn").prop('disabled', true).css('color','red');



    })


});

























