window.onload = () => { 


  var tmp = document.location.search;
  var id = tmp.split('=')[1];

  console.log(id);

  $.ajax({
        url: `/football/league/${id}/actualTour`,
        cache: false,
        dataType: "text",
        beforeSend: function(){
          $('#tournir_now').css('display', 'block');
        },
        success: function(data){
          $('#tournir_now').css('display', 'none');
          data = JSON.parse(data);
          console.log(data);

          $('.icons__title').html(data.data[0].league_title)
          for(var key in data.data){
            for(var keys in data.data[key].games){
              let d = new Date(data.data[key].games[keys].date *1000);
              timeStampCon = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
              let item = `<div class="tournir__block_item" id="${data.data[key].games[keys].id}">
                            <div class="tournir__item_date">
                              <p class="tournir__date_text">${timeStampCon}</p>
                            </div>
                            <div class="tournir__item_comand">
                              <div class="tournir__item_team">
                                <p class="comand__name text-truncate">${data.data[key].games[keys].team1_title}</p>
                                <img src="${data.data[key].games[keys].team1_logo}" style="width: 22px; height: 28px;" alt="" class="ml-2">
                                <div class="tournir__item_count lead__num mr-2 ml-2">-</div>
                                <div class="tournir__item_count lead__num">-</div>
                                <img src="${data.data[key].games[keys].team2_logo}" style="width: 22px; height: 28px;" alt="" class="ml-2 mr-2">
                                <p class="comand__name text-truncate">${data.data[key].games[keys].team2_title}</p>
                              </div>
                              <div class="block_prog border__around">
                                <input class="input_prog" type="text" min="0" name=""/>
                                <input class="input_prog" type="text" min="0" name=""/>
                                <button class="ball__btn">
                                  <img src="/img/main/f.png" alt="">
                                </button>
                              </div>
                              <div class="tournir__item_point">
                                <div class="no_point"></div>
                              </div>
                            </div>
                          </div>`; 
              $('#result').prepend(item);
            }
            let subtitle = `<p class="tour__block_subtitle">${data.data[key].title}</p>`;
            $('#result').prepend(subtitle);
          }
        }
      });


  $('#result').on('click', '.tournir__block_item', function(e){
        console.log($(this)[0].id);
      if (!$('.input_prog').is(':focus') && !$('.ball__btn').is(':focus')){
        window.location='/football/game?id=' + $(this)[0].id;
      } else {
        return;
      }

    });

  $('#result').on('click', '.ball__btn', function(e){

      let id    = $(this).closest('.tournir__block_item').attr('id');
      let num_1   = $(this).parent().find('input[name="num1"]').val();
      let num_2   = $(this).parent().find('input[name="num2"]').val();

      console.log(id);
      console.log(num_1);
      console.log(num_2);

      if( num_1 == ''){
        alert('Вы ввели не точный прогноз');
        return;
      }

      if( num_2 == ''){
        alert('Вы ввели не точный прогноз');
        return;
      }

      if(!localStorage.getItem('token')){
        alert('Вы должны авторизоваться');
        $('#regModal').modal('show');
        return;
      }

      var token = { 'token' : localStorage.getItem('token')};

      $.ajax({
        url: `/bet/set/football/${id}/${num_1}:${num_2}`,
        type:"POST",
        cache: false,
        processData: false,
        contentType: false,
        data: JSON.stringify(token),
        // beforeSend: function(){
      //        $('#tournir_'+id).css('display', 'block');
      //       },
        success: function(data){
          // $('#tournir_'+id).css('display', 'none');
          data = JSON.parse(data);
          console.log(data);
          alert(data.data);
          location.reload();
        }
      });
    });
};