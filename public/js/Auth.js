$(document).ready(function(){

    $('input[name="loginEmail"]').change( function(){
        $('input[name="loginEmail"]').css('border','none');
        $('input[name="loginPassword"]').css('border','none');
        $('.error_msg').empty();
    });

    $('input[name="loginPassword"]').on('change', function(){
        $('input[name="loginEmail"]').css('border','none');
        $('input[name="loginPassword"]').css('border','none');
        $('.error_msg').empty();
    });

    $('.modal__login_btn').on('click', function(e){
        e.preventDefault();

        var fdlogin = new FormData();

        console.log($('input[name="loginEmail"]').val());
        console.log($('input[name="loginPassword"]').val());

        fdlogin.append('username', $('input[name="loginEmail"]').val());
        fdlogin.append('password', $('input[name="loginPassword"]').val());

        $.ajax({
            url: '/api/login',
            type:"POST",
            data: fdlogin,
            processData: false,
            contentType: false,
            success: function(data){
                var data = JSON.parse(data);
                console.log(data);
                if ( data.error){
                    $('input[name="loginEmail"]').css('border','1px solid red');
                    $('input[name="loginPassword"]').css('border','1px solid red');
                    $('.error_msg').empty();
                    $('.error_msg').append(data.error.message);
                } else {
                    localStorage.setItem('username', $('input[name="loginEmail"]').val());
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('experies', data.data.experies);
                    location.reload();                    
                }
            },
            error: function(){
                console.log('sdf');
                $('input[name="loginEmail"]').css('border','1px solid red');
                $('input[name="loginPassword"]').css('border','1px solid red');
                $('.error_msg').empty();
                $('.error_msg').append('Неверный логин и/или пароль!');
            }
        });
    });

    $('.modal_btn_login').on('click', function(e){
        e.preventDefault();

        var fdlogin = new FormData();

        fdlogin.append('username', $('input[name="loginEmail_page"]').val());
        fdlogin.append('password', $('input[name="loginPassword_page"]').val());

        $('input[name="loginEmail_page"]').change( function(){
            $('input[name="loginEmail_page"]').css('border','none');
            $('input[name="loginPassword_page"]').css('border','none');
            $('.error_msg_page').empty();
        });

        $('input[name="loginPassword_page"]').on('change', function(){
            $('input[name="loginEmail_page"]').css('border','none');
            $('input[name="loginPassword_page"]').css('border','none');
            $('.error_msg_page').empty();
        });

        $.ajax({
            url: '/api/login',
            type:"POST",
            data: fdlogin,
            processData: false,
            contentType: false,
            success: function(data){
                var data = JSON.parse(data);
                console.log(data);
                if ( data.error){
                    $('input[name="loginEmail_page"]').css('border','1px solid red');
                    $('input[name="loginPassword_page"]').css('border','1px solid red');
                    $('.error_msg_page').empty();
                    $('.error_msg_page').append(data.error.message);
                } else {
                    localStorage.setItem('username', $('input[name="loginEmail_page"]').val());
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('experies', data.data.experies);
                    location.reload();                       
                }                       
            },
            error: function(data){
                var data = data;
                console.log(data);
                $('input[name="loginEmail_page"]').css('border','1px solid red');
                $('input[name="loginPassword_page"]').css('border','1px solid red');
                $('.error_msg_page').empty();
                $('.error_msg_page').append('Неверный логин и/или пароль!');
            }
        });
    })

    $('.modal__reg_btn').on('click', function(e){
        e.preventDefault();
        if( $('input[name="password"]').val() != $('input[name="repPassword"]').val()){
            alert('Разные пароли');
            return;
        }

        var postMass = {
            "username" : $('input[name="username"]').val(),
            "password" : $('input[name="password"]').val(),
            "phone" : $('input[name="tel"]').val(),
            "name" : $('input[name="nameSername"]').val().split(' ')[0],
            "surname" : $('input[name="nameSername"]').val().split(' ')[1],
            "email" : $('input[name="email"]').val(),
        };

        console.log(postMass);

        $.ajax({
            url: '/api/registration',
            type:"POST",
            data: JSON.stringify(postMass),
            processData: false,
            contentType: false,
            success: function(data){
                var data = JSON.parse(data);
                console.log(data);
                $('#loginModal').modal('hide');
            },
            error: function(data){
                var data = JSON.parse(data);
                console.log(data);
            }
        });
    });

    let timerIdReauth = setTimeout(function ticki() {
        if(localStorage.getItem('token')){
            let d1 = new Date().toLocaleDateString();
            let d2 = new Date().toLocaleTimeString();
            let d3 = d1 + ' ' + d2;
            console.log(d1 + ' '+ d2);
            console.log(localStorage.getItem('experies'));

            if (d3 > localStorage.getItem('experies')){
                reauth();
                console.log(d1 + ' '+ d2);
                console.log(localStorage.getItem('experies'));
            }
        }
        timerIdReauth = setTimeout(ticki, 900000);
    }, 900000);

});


function logout(){
    var token_t = localStorage.getItem('token');

    $.post( "/api/logout", {'token': token_t}, function( data ) {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      localStorage.removeItem('experies');
      location.reload(); 
    });
 }

 function reauth(){
    var token_t = localStorage.getItem('token');
    var token = { 'token' : localStorage.getItem('token')};

    $.post( "/api/reauth", {'token': token_t}, function( data ) {
      var data = JSON.parse(data);
      console.log(data);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('experies', data.data.experies);
      // location.reload(); 
    });
 }