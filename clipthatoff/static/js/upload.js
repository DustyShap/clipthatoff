$(document).ready(function(){

    $("#upload_button").click(function(){

         $("#search_container").css('display','none');
         $("#password_window").css('display','flex');
         $(".search_result").remove()
         $("#password").focus();
         $(this).addClass('button_chose');

    });


    $("#password_cancel_button").click(function(){
        $("#password_window").css('display','none');
        $("#results_container").show();
        $("#password").val('');

    })

    $("#password_button").click(function(){
      $.ajax({
          type: "POST",
          url: "/upload_login",
          data: {
            upload_password: $("#password").val()
          }
         })

      .done(function(data){
          if (data.password_correct){
              $("#password_window").css('display','none');
              $("#search_container").css('display','none');
              $("#upload_window").css('display', 'flex');
              $("#upload_button").hide();
              $("#results_container").hide();
              $("#chooser_wrap").hide();
              $(".header_image").attr('src', "../static/img/soundboards.jpg");
              $("#password").val('');
              $("#speaker").hide();

          } else {
              console.log('Wrong PW Attempt');
              alert('Wrong Password');
              $("#password").val('');
          }
      });



    })

      $("#upload_speaker_chooser").change(function(event){
        if ($("#upload_speaker_chooser option:selected").val() == 'other'){
          $("#speaker").show()
        } else {
          $("#speaker").hide()
          $("#speaker").val($("#upload_speaker_chooser option:selected").val())
        }
      })

    $("#upload_submit").click(function(e){

        var form_data = new FormData($("#upload_form")[0]);
        $('#audio').val('');
        $("#speaker").val('');
        $("#tags").val('');
        $("#transcription").val('');


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
            if (data.warning){

            } else {

                $("#chooser_wrap").show();
                $("#upload_window").css('display', 'none');
                $("#upload_button").hide();
                console.log(data.file + ' uploaded');
                $("#upload_button").show();

            };

        });

        e.preventDefault();


    })

    $("#upload_cancel").click(function(){

        $("#upload_window").css('display', 'none');
        $("#chooser_wrap").show();
        $("#password_window").css('display','none');
        $("#results_container").show();
        $("#password").val('');
        $("#upload_button").show();
        $('#audio').val('');
        $("#speaker").val('');
        $("#tags").val('');
        $("#transcription").val('');
    })


});
