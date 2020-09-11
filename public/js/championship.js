window.onload = () => { 
      let items = document.getElementsByClassName('tournir__menu_item');
      lastElem = items[0];
      for (let i = 0; i < items.length; i++) {
        items[i].addEventListener('click', function() {
          lastElem.classList.remove('active');
          items[i].classList.add('active');

          let tabOld = document.getElementById(lastElem.dataset.tab);
          let tabNew = document.getElementById(items[i].dataset.tab);
          tabOld.classList.remove('active');
          tabNew.classList.add('active');
          
          lastElem = items[i];
        });
      }

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

          $('#tour_title').html(data.data.current_tour.league_title);

          let item_name_tour = `<div class="tour__block_subtitle">
                      <p>${data.data.current_tour.title}</p>
                      <div>
                        <span>Прогноз</span>
                        <span class="ml-5 pr-1">Получено очков</span>
                      </div>
                    </div>`;
          $('#tour_now').append(item_name_tour);

          for(let key in current_tour_games = data.data.current_tour.games){

            let time = parseInt(current_tour_games[key].date);
            console.log(current_tour_games[key].date );
            let date = new Date(time *1000);
            // console.log(current_tour_games[key]);
            let item = `<div class="tournir__block_item" id="${current_tour_games[key].id}">
                    <div class="tournir__item_date">
                      <p class="tournir__date_text">${date.getDate()}.${date.getMonth()}.${date.getFullYear()}</p>
                    </div>
                    <div class="tournir__item_comand">
                      <div class="tournir__item_team">
                        <p class="comand__name text-truncate">${ current_tour_games[key].team1_title}</p>
                        <img src="${current_tour_games[key].team1_logo}" style="width: 22px; height: 28px;" alt="" class="ml-2">
                        <div class="tournir__item_count lead__num mr-2 ml-2">${current_tour_games[key].score.split(':')[0]}</div>
                        <div class="tournir__item_count lead__num">${current_tour_games[key].score.split(':')[1]}</div>
                        <img src="${current_tour_games[key].team2_logo}" style="width: 22px; height: 28px;" alt="" class="ml-2 mr-2">
                        <p class="comand__name text-truncate">${current_tour_games[key].team2_title}</p>
                      </div>
                      <div class="block_prog border__around">
                        <input class="input_prog" type="number" min="0" name="num1"/>
                        <input class="input_prog" type="number" min="0" name="num2"/>
                        <button class="ball__btn">
                          <img src="/img/main/f.png" alt="">
                        </button>
                      </div>
                      <div class="tournir__item_point">
                        <div class="no_point"></div>
                      </div>
                    </div>
                  </div>`;

            $('#tour_now').append(item);

          }

          let item_name_tour_past = `<div class="tour__block_subtitle">
                        <p>${data.data.past_tour.title}</p>
                        <div>
                          <span>Прогноз</span>
                          <span class="ml-5 pr-1">Получено очков</span>
                        </div>
                      </div>`;
          $('#tour_now').append(item_name_tour_past);

          for(let key in current_tour_games = data.data.past_tour.games){
            let time = parseInt(current_tour_games[key].timestamp)
            let date = new Date(time);
            // console.log(current_tour_games[key]);
            let item = `<div class="tournir__block_item" id="${current_tour_games[key].id}">
                    <div class="tournir__item_date">
                      <p class="tournir__date_text">${date.getDate()}.${date.getMonth()}.${date.getFullYear()}</p>
                    </div>
                    <div class="tournir__item_comand">
                      <div class="tournir__item_team">
                        <p class="comand__name text-truncate">${ current_tour_games[key].team1_title}</p>
                        <img src="${current_tour_games[key].team1_logo}" style="width: 22px; height: 28px;" alt="" class="ml-2">
                        <div class="tournir__item_count lead__num mr-2 ml-2">${current_tour_games[key].score.split(':')[0]}</div>
                        <div class="tournir__item_count lead__num">${current_tour_games[key].score.split(':')[1]}</div>
                        <img src="${current_tour_games[key].team2_logo}" style="width: 22px; height: 28px;" alt="" class="ml-2 mr-2">
                        <p class="comand__name text-truncate">${current_tour_games[key].team2_title}</p>
                      </div>
                      <div class="block_prog border__around">
                        <input class="input_prog" type="number" min="0" name="num1"/>
                        <input class="input_prog" type="number" min="0" name="num2"/>
                        <button class="ball__btn">
                          <img src="/img/main/f.png" alt="">
                        </button>
                      </div>
                      <div class="tournir__item_point">
                        <div class="no_point"></div>
                      </div>
                    </div>
                  </div>`;

            $('#tour_now').append(item);

          }
        }
      });

      $.ajax({
        url: `/football/league/${id}`,
        cache: false,
        dataType: "text",
        // beforeSend: function(){
      //        $('#tournir_'+id).css('display', 'block');
      //       },
        success: function(data){
          // $('#tournir_'+id).css('display', 'none');
          data = JSON.parse(data);
          console.log(data);
          var i = 1;
          let lead_back;
          for(let key in data.data){
            if (i <= 3){
              lead_back = 'lead__num';
            } else {
              lead_back = '';
            }
            let item = `<tr>
                    <td class="lead__num_default ${lead_back}">${i}</td>
                    <td class="team__name text-truncate"><img class="lead_img" src="${data.data[key].logo}" alt="" /> ${key}</td>
                    <td>${data.data[key].games}</td>
                    <td>${data.data[key].winner}</td>
                    <td class="dis-no">${data.data[key].draw}</td>
                    <td class="dis-no">${data.data[key].losing}</td>
                    <td class="dis-no">${data.data[key].goals_scored}</td>
                    <td class="dis-no">${data.data[key].goals_conceded}</td>
                    <td class="dis-no">0</td>
                    <td class="dis-no">0</td>
                  </tr>`;
            $('.tournir__table > tbody').append(item);

          i++;
          }
        }
      });

    // console.log(id);
    $.ajax({
      url: `/football/league/${id}/futureGames`,
      cache: false,
      dataType: "text",
      beforeSend: function(){
           $('#table_match').css('display', 'block');
          },
      success: function(data){
        $('#table_match').css('display', 'none');
        data = JSON.parse(data);
        console.log(data);

        for(var key in data.data){
          let d = new Date(parseInt(data.data[key].date));
          timeStampCon = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
          let item = `<div class="tournir__block_item" id="${data.data[key].id}">
                        <div class="tournir__item_date">
                          <p class="tournir__date_text">${timeStampCon}</p>
                        </div>
                        <div class="tournir__item_comand">
                          <div class="tournir__item_team">
                            <p class="comand__name text-truncate">${data.data[key].team1_title}</p>
                            <img src="${data.data[key].team1_logo}" style="width: 22px; height: 28px;" alt="" class="ml-2">
                            <div class="tournir__item_count lead__num mr-2 ml-2">-</div>
                            <div class="tournir__item_count lead__num">-</div>
                            <img src="${data.data[key].team2_logo}" alt="" style="width: 22px; height: 28px;" class="ml-2 mr-2">
                            <p class="comand__name text-truncate">${data.data[key].team2_title}</p>
                          </div>
                          <div class="block_prog">
                            <input class="input_prog" type="text" min="0" name="num1"/>
                            <input class="input_prog" type="text" min="0" name="num2"/>
                            <button class="ball__btn">
                              <img src="/img/main/f.png" alt="">
                            </button>
                          </div>
                        </div>
                      </div>`;
          $('#table').append(item);
        }
      }
    });

    $.ajax({
      url: `/football/league/${id}/liveGames`,
      cache: false,
      dataType: "text",
      beforeSend: function(){
           $('#result_match').css('display', 'block');
          },
      success: function(data){
        $('#result_match').css('display', 'none');
        data = JSON.parse(data);
        console.log(data);

        if(data.data.length > 0 ){
          for(var key in data.data){
            let d = new Date(parseInt(data.data[key].date));
            timeStampCon = d.getDate() + '.' + d.getMonth() + '.' + d.getFullYear();
            let item = `<div class="tournir__block_item" id="${data.data[key].id}">
                          <div class="tournir__item_date">
                            <p class="tournir__date_text">${timeStampCon}</p>
                          </div>
                          <div class="tournir__item_comand">
                            <div class="tournir__item_team">
                              <p class="comand__name text-truncate">${data.data[key].team1_title}</p>
                              <img src="${data.data[key].team1_logo}" style="width: 22px; height: 28px;" alt="" class="ml-2">
                              <div class="tournir__item_count lead__num mr-2 ml-2">-</div>
                              <div class="tournir__item_count lead__num">-</div>
                              <img src="${data.data[key].team2_logo}" alt="" style="width: 22px; height: 28px;" class="ml-2 mr-2">
                              <p class="comand__name text-truncate">${data.data[key].team2_title}</p>
                            </div>
                            <div class="block_prog">
                              <input class="input_prog" type="text" min="0" name="num1"/>
                              <input class="input_prog" type="text" min="0" name="num2"/>
                              <button class="ball__btn">
                                <img src="/img/main/f.png" alt="">
                              </button>
                            </div>
                          </div>
                        </div>`;
            $('#result').append(item);
          }
        }
      }
    });

    $('#tour_now').on('click', '.tournir__block_item', function(e){
        console.log($(this)[0].id);
      if (!$('.input_prog').is(':focus') && !$('.ball__btn').is(':focus')){
        window.location='/football/game?id=' + $(this)[0].id;
      } else {
        return;
      }

    });

    $('#table').on('click', '.tournir__block_item', function(e){
        console.log($(this)[0].id);
      if (!$('.input_prog').is(':focus') && !$('.ball__btn').is(':focus')){
        window.location='/football/game?id=' + $(this)[0].id;
      } else {
        return;
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

    $('#tour_now').on('click', '.ball__btn', function(e){

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

    $('#table').on('click', '.ball__btn', function(e){

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