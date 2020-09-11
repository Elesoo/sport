var createRoomVar = {
	'title': '',
	'members' : [],
	'leagues' : []
};

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

	var token = { 'token' : localStorage.getItem('token')};

	load_room();

	$.ajax({
		url: '/rooms/invitations/my',
		type:"POST",
		data: JSON.stringify(token),
		processData: false,
		contentType: false,
		success: function(data){
			var data = JSON.parse(data);
			console.log(data);
			if (data.data.length != 0){
				for(let key in data.data){
					var t = new Date(data.data[key].timestamp * 1000);
					var months = ['Янв','Фев','Март','Апр','Май','Июнь','Июль','Авг','Сен','Окт','Нояб','Дек'];
					var date = t.getDate();
					var month = months[t.getMonth()];
					let item = `<div class="invite__item">
									<div class="section">
										<p class="invite__date">${date}.${month}</p>
										<p class="invite__date">14:32</p>
									</div>
									<div class="section">
										<img src="/img/rooms/Ellipse 1.png" class="circle" alt="">
										<p class="invite__text">
											<span class="name">${data.data[key].nickname}</span> приглашает вас в комнату <span class="room__name">${data.data[key].title}</span>
										</p>
									</div>	
									<div class="section">
										<button class="invite__btn" onclick="accept(${data.data[key].id})">Принять</button>
										<button class="invite__btn" onclick="deny(${data.data[key].id})">Отклонить</button>
									</div>	
								</div>`;
					$('#claims').append(item);
				}
			} else {
					let item = `<p style="text-align:center;">У вас еще нет приглашений</p>`;
					$('#claims').append(item);
				}            
		},
		error: function(data){
			var data = JSON.parse(data);
			console.log(data);
		}
	});

	$("#send__invite").on('click', function (e) {
		if ($('#nicknameFind').val() == localStorage.getItem('username')){
			alert('Нельзя пригласить самого себя!');
			$('#nicknameFind').val('');
			return;
		}
	  	var userload = {'token' : localStorage.getItem('token'),
	  			 'user' : $('#nicknameFind').val()};
	    $.ajax({
			url: '/api/user/find',
			type:"POST",
			data: JSON.stringify(userload),
			processData: false,
			contentType: false,
			success: function(data){
				var data = JSON.parse(data);
				console.log(data)
				if( data.error){
					alert(data.error.message);
				} else {
					createRoomVar.members.push(data.data);
					let user = `<div class="member_item" data-iduser="${data.data}">
									<p class="memeber_name">${$("#nicknameFind").val()} </p>
									<button class="delete__member" onclick="delete_user(this)">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>`;
					$('#wait_invite').append(user);
				}
				$('#nicknameFind').val('');
			},
			error: function(data){
				var data = JSON.parse(data);
				console.log(data);
			}
		});
	});

	$('#createRoom_load').on('click', function(){
		createRoomVar.title = $('#nameRoom').val();

		if (createRoomVar.members.length == 0){
			alert('Добавьте участников в комнату');
			return;
		}

		if (createRoomVar.leagues == 0){
			alert('Выберите хотя бы один турнир');
			return;
		}

		if(createRoomVar.title == ''){
			alert('Введите название комнаты');
			return;
		}

		createRoomVar.token = localStorage.getItem('token');

		$.ajax({
			url: '/rooms/create',
			type:"POST",
			data: JSON.stringify(createRoomVar),
			processData: false,
			contentType: false,
			success: function(data){
				var data = JSON.parse(data);
				console.log(data); 
				location.reload();                
			},
			error: function(data){
				var data = JSON.parse(data);
				console.log(data);
			}
		});

	});

	$('#accordionExample').on('click', '.edit', function(){
		let id = $(this).closest('.room__item').attr('id');
		let name = $(this).closest('.room__item').data('name')
		console.log(id);
		$('.nameRoom_modal').html(name);
		$('.add_member').data('idRoom', id);
		$('.save__changes').data('idRoom', id);
		$.ajax({
			url: `/rooms/my/${id}/members`,
			type:"POST",
			data: JSON.stringify(token),
			processData: false,
			contentType: false,
			success: function(data){
				var data = JSON.parse(data);
				console.log(data.data); 
				$('.make__room_members').empty();
				if(data.data.length != 0 ){
					for(let key in data.data){
						let item = `<div class="member_item data-iduser="${data.data[key].id}>
										<p class="memeber_name">${data.data[key].username} </p>
										<button class="delete__member">
											<span aria-hidden="true">&times;</span>
										</button>
									</div>`;
						$('.members_current').append(item);
					}
				} else {
				}

			},
			error: function(data){
				var data = JSON.parse(data);
				console.log(data);
			}
		});
	});

	$('.add_member').on('click', async function(){
		if ($('#member__input_add').val() == localStorage.getItem('username')){
			alert('Нельзя пригласить самого себя!');
			$('#member__input_add').val('');
			return;	
		}
		var name_person = '';
	  	var userload = {'token' : localStorage.getItem('token'),
	  			 'user' : $('#member__input_add').val()};
		let promise = $.ajax({
				url: '/api/user/find',
				type:"POST",
				data: JSON.stringify(userload),
				processData: false,
				contentType: false,
				success: function(data){
					var data = JSON.parse(data);
					console.log(data)
					if( data.error){
						alert(data.error.message);
						$('#member__input_add').val('');
						return;
					} else {
						let user = `<div class="member_item" data-iduser="${data.data}">
										<p class="memeber_name">${$("#member__input_add").val()} </p>
									</div>`;
						name_person = $("#member__input_add").val();
						$('.members_add').append(user);
					}
					$('#member__input_add').val('');
				},
				error: function(data){
					var data = JSON.parse(data);
					console.log(data);
				}
			});
		let result = await promise;
		if(result){
			var data = JSON.parse(result);
			if( data.error){
				alert(data.error.message);
				$('#member__input_add').val('');
				return;
			} else {
				var data_add = {
					'token' : localStorage.getItem('token'),
	  			 	'user' : name_person
				}
				name_person = '';
				$.ajax({
					url: `/rooms/my/${$(this).data('idRoom')}/addMember`,
					type:"POST",
					data: JSON.stringify(data_add),
					processData: false,
					contentType: false,
					success: function(data){
						var data = JSON.parse(data);
						alert('Приглашение отправлено')
					},
					error: function(data){
						var data = JSON.parse(data);
						console.log(data);
					}
				});
			}
		}
	})

	$('.save__changes').on('click', function(){
		if($('#member__input_room').val() == ''){
			$('#exampleModal').modal('hide');
			return;
		} else {
			var data_add = {
				'token' : localStorage.getItem('token'),
  			 	'name' : $('#member__input_room').val()
			}
			$.ajax({
				url: `/rooms/my/${$(this).data('idRoom')}/rename`,
				type:"POST",
				data: JSON.stringify(data_add),
				processData: false,
				contentType: false,
				success: function(data){
					var data = JSON.parse(data);
					alert('Название изменено');
					$('#member__input_room').val('');
					location.reload();
				},
				error: function(data){
					var data = JSON.parse(data);
					console.log(data);
				}
			});
		}
	})

};

function load_room(){
	var token = { 'token' : localStorage.getItem('token')};
	$.ajax({
		url: '/rooms/my',
		type:"POST",
		data: JSON.stringify(token),
		processData: false,
		contentType: false,
		success: function(data){
			var data = JSON.parse(data);
			console.log(data.data); 
			if(data.data.length != 0 ){
				for(var key in data.data){
					var id = randomString(7);
					let item = `<div class="room__item" id="${data.data[key].id}" data-name="${data.data[key].name}">
									<div class="room_header" id="headingOne${id}">
										<div class="room__item_section">
											<button class="edit" data-toggle="modal" data-target="#exampleModal">
												<img src="/img/rooms/edit 2.png" alt="edit">
											</button>
											<p class="room__title">${data.data[key].name}</p>
										</div>
										<div class="room__item_section">
											<p class="members">${data.data[key].members_count} участника</p>
											<button class="show" type="button" data-load="false" onclick="load_info_room($(this))" data-toggle="collapse" data-target="#collapseOne${id}" aria-expanded="true" aria-controls="collapseOne${id}">
												<img src="/img/rooms/Group 490.png" alt="">
											</button>
										</div>
									</div>
									<div class="rooms__table_block collapse" id="collapseOne${id}" class="collapse show" aria-labelledby="headingOne${id}" data-parent="#accordionExample">
									</div>
								</div>`;
					$('#accordionExample').append(item);
				}
			} else {
				let item = `<p style="text-align:center">У вас еще нет комнат<p>`;
				$('#accordionExample').append(item);
			}

		},
		error: function(data){
			var data = JSON.parse(data);
			console.log(data);
		}
	});
}

function accept(id){
	var token = { 'token' : localStorage.getItem('token')};
	$.ajax({
		url: `/rooms/invitations/${id}/allow`,
		type:"POST",
		data: JSON.stringify(token),
		processData: false,
		contentType: false,
		success: function(data){
			var data = JSON.parse(data);
			console.log(data);
			location.reload();    
		},
		error: function(data){
			var data = JSON.parse(data);
			console.log(data);
		}
	});
}

function deny(id){
	var token = { 'token' : localStorage.getItem('token')};
	$.ajax({
		url: `/rooms/invitations/${id}/deny`,
		type:"POST",
		data: JSON.stringify(token),
		processData: false,
		contentType: false,
		success: function(data){
			var data = JSON.parse(data);
			console.log(data);
			location.reload();    
		},
		error: function(data){
			var data = JSON.parse(data);
			console.log(data);
		}
	});
}

function delete_user(elem){
	let id = $(elem).parent().data('iduser');
	console.log(elem);
	console.log($(elem).parent().data('iduser'));
	var index = createRoomVar.members.indexOf(id);
	if (index > -1) {
	  createRoomVar.members.splice(index, 1);
	}
	console.log(createRoomVar);
	$(elem).parent().remove();
}

function addLeague(data_load){

	var id = $(data_load).closest('.chooseRoom').data('idRoom');
	var type = $(data_load).closest('.chooseRoom').data('typeRoom');
	var idLeague = $(data_load).data('idleague');
	var typeLeague = $(data_load).data('typeleague');

	if ( id && type ){
		for( let key in createRoomVar.leagues ){
			console.log(createRoomVar.leagues[key].id)
			if ((createRoomVar.leagues[key].id == idLeague) && (createRoomVar.leagues[key].type == typeLeague)){
				alert('этот турнир уже выбран');
				return;
			}

			if (createRoomVar.leagues[key].id == id && createRoomVar.leagues[key].type == type ) {
			  createRoomVar.leagues.splice(key, 1);
			}
		}

		$(data_load).closest('.chooseRoom').find('.active_tour').removeClass('active_tour');
		$(data_load).addClass('active_tour');
		$(data_load).closest('.chooseRoom').data('idRoom', idLeague);
		$(data_load).closest('.chooseRoom').data('typeRoom', typeLeague);
		createRoomVar.leagues.push({'type': data_load.data('typeleague'), 'id' : data_load.data('idleague')});
	} else {
		for(let key in createRoomVar.leagues){
			console.log(idLeague)
			if ((createRoomVar.leagues[key].id == idLeague) && (createRoomVar.leagues[key].type == typeLeague)){
				alert('этот турнир уже выбран');
				return;
			}
		}
		$(data_load).closest('.chooseRoom').find('.active_tour').removeClass('active_tour');
		$(data_load).addClass('active_tour');
		$(data_load).closest('.chooseRoom').data('idRoom', data_load.data('idleague'));
		$(data_load).closest('.chooseRoom').data('typeRoom', data_load.data('typeleague'));
		createRoomVar.leagues.push({'type': data_load.data('typeleague'), 'id' : data_load.data('idleague')});
	}

	// console.log($(data_load).closest('.tab-content').data('chooseRoom'));
	// $(data_load).addClass('active_tour');
	// console.log(createRoomVar);
}


function loadFootball(data_load){
	console.log(data_load);
	console.log('#pills-tab-contry-'+data_load.data('idblock'));
	if(data_load.data('load') == false){
		$(`#pills-tab-contry-${data_load.data('idblock')} > .country__item`).each(function(e){
			var id = $(this).data('link');
			console.log(id);
			$.ajax({
				url: `football/getLeagues/${id}`,
				cache: false,
				dataType: "text",	
				beforeSend: function(){
					$('#tournir_'+id+ '-' +data_load.data('idblock')).css('display', 'block');
				},
				success: function(data){
					$('#tournir_'+id + '-' +data_load.data('idblock')).css('display', 'none');
					data = JSON.parse(data);
					console.log(data);
					for(var key in items = data.data){

						var t = new Date(items[key].date * 1000);
						var months = ['Янв','Фев','Март','Апр','Май','Июнь','Июль','Авг','Сен','Окт','Нояб','Дек'];
						var date = t.getDate();
						var month = months[t.getMonth()];

						let item = `<div class="tournir__card onhover" data-typeleague="football" data-idleague="${items[key].id}" onclick="addLeague($(this))">
						<div class="toutrnir__card_subtitle text-truncate">
						<img src="data:image/png;base64,${items[key].logo}" alt="" class="img-fluid">${items[key].title}
						</div>
						<div class="tournir__card_blocktext">
						<p class="blocktext__date">${date} ${month}</p>
						<!-- <p class="blocktext__time">12:45</p> -->
						</div>
						</div>`;
						$('#pills-'+id+ '-' +data_load.data('idblock')).append(item);
					}
				}
			});
		});

		$.ajax({
			url: "football/getLeagues/world",
			cache: false,
			dataType: "text",
			beforeSend: function(){
				$('#worldship_list_loader-' + data_load.data('idblock')).css('display', 'block');
			},
			success: function(data) {
				data = JSON.parse(data);
				console.log(data);
				$('#worldship_list_loader-' + data_load.data('idblock')).css('display', 'none');

				for(var key in items = data.data){

					var t = new Date(items[key].date * 1000);
					var months = ['Янв','Фев','Март','Апр','Май','Июнь','Июль','Авг','Сен','Окт','Нояб','Дек'];
					var date = t.getDate();
					var month = months[t.getMonth()];

					let item = `<div class="tournir__card onhover" data-typeleague="football" data-idleague="${items[key].id}" onclick="addLeague($(this))">
					<div class="toutrnir__card_subtitle text-truncate">
					<img src="data:image/png;base64,${items[key].logo}" alt="" class="img-fluid">${items[key].title}
					</div>
					<div class="tournir__card_blocktext">
					<p class="blocktext__date">${date} ${month}</p>
					<!-- <p class="blocktext__time">12:45</p> -->
					</div>
					</div>`;
					$('#pills-All' + '-' +data_load.data('idblock')).append(item);
				}
			}
		})

		data_load.data('load', true);
	} else {
		return;
	}
}

function loadHockey(data_load){
	if(data_load.data('load') == false){
		data_load.data('load', true);
	} else {
		return;
	}
}

function loadBasketball(data_load){
	console.log(data_load.data('idblock'));
	if(data_load.data('load') == false){
		console.log('basketball');
		$.ajax({
			url: "basketball/getLeagues/all",
			cache: false,
			dataType: "text",
			beforeSend: function(){
				$('#worldship_list_basketball-'+data_load.data('idblock')).css('display', 'block');
			},
			success: function(data) {
				data = JSON.parse(data);
				console.log(data);
				$('#worldship_list_basketball-'+data_load.data('idblock')).css('display', 'none');

				for(var key in items = data.data){

					var t = new Date(items[key].date * 1000);
					var months = ['Янв','Фев','Март','Апр','Май','Июнь','Июль','Авг','Сен','Окт','Нояб','Дек'];
					var date = t.getDate();
					var month = months[t.getMonth()];

					let item = `<div class="tournir__card onhover" data-typeLeague="basketball" data-idleague="1" onclick="addLeague($(this))">
					<div class="toutrnir__card_subtitle text-truncate">
					<img src="data:image/png;base64,${items[key].logo}" alt="" class="img-fluid">${items[key].title}
					</div>
					<div class="tournir__card_blocktext">
					<p class="blocktext__date">${date} ${month}</p>
					<!-- <p class="blocktext__time">12:45</p> -->
					</div>
					</div>`;
					$('#pills-basketball-'+ data_load.data('idblock')).append(item);
				}
			}
		})
		data_load.data('load', true);
	} else {
		return;
	}
}

function randomString(length) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");
	if (! length) {
		length = Math.floor(Math.random() * chars.length);
	}
	var str = "";
	for (var i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}
	return str;
}

function delete_tour(elem){
	console.log(elem);
	var id = $(elem).closest('.tour__sports').find('.chooseRoom').data('idRoom');
	var type = $(elem).closest('.tour__sports').find('.chooseRoom').data('typeRoom');
	console.log(id);
	console.log(type);

	if ( id && type ){
		for( let key in createRoomVar.leagues ){
			if (createRoomVar.leagues[key].id == id && createRoomVar.leagues[key].type == type ) {
			  createRoomVar.leagues.splice(key, 1);
			}
		}
	}

	$(elem).closest('.tour__sports').remove();
}

function addNewTour(){

	if(createRoomVar.leagues.length < $('.select__tour').find('.tour__sports').length ){
		alert('Вы еще не выбрали предыдущий турнир');
		return;
	}

	var id = randomString(7);

	let item_new = `<div class="tour__sports" id='select-${id}'>
						<div class="header_tour">
							<p class="title__room mb-3">Выбрать турнир</p>
							<button class="delete__member" onclick="delete_tour(this)">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="btn__tour_group mb-3 list-group" id="pills-tab-${id}" role="tablist">
							<button class="select__tour_btn select__foot" id="pills-football-tab-${id}" data-toggle="pill" href="#pills-football-${id}" role="tab" aria-controls="pills-football-${id}" aria-selected="false" onclick="loadFootball($(this))" data-load="false" data-idBlock="${id}">Футбол</button>

							<button class="select__tour_btn select__hoc" id="pills-hockey-tab-${id}" data-toggle="pill" href="#pills-hockey-${id}" role="tab" aria-controls="pills-hockey-${id}" aria-selected="false" onclick="loadHockey($(this))" data-load="false" data-idBlock="${id}">Хоккей</button>

							<button class="select__tour_btn select__bas" id="pills-basketball-tab-${id}" data-toggle="pill" href="#pills-basketball-${id}" role="tab" aria-controls="pills-basketball-${id}" aria-selected="false" onclick="loadBasketball($(this))" data-load="false" data-idBlock="${id}">Баскетбол</button>
						</div>

						<div class="tab-content chooseRoom">
							<div class="country__select tab-pane fade" id="pills-football-${id}" role="tabpanel" aria-labelledby="pills-football-tab-${id}">
								<div class="select__country row mr-0 ml-0 list-group" id="pills-tab-contry-${id}" role="tablist">
									<div class="col-6 col-sm-4 country__item active" id="pills-Russia-tab-${id}" data-link="Russia" data-toggle="pill" href="#pills-Russia-${id}" role="tab" aria-controls="pills-Russia-${id}" aria-selected="false">
										<img src="/img/match/football/rus.png" alt="">
										<p class="country__item_text">Россия</p>
									</div>
									<div class="col-6 col-sm-4 country__item" id="pills-Italy-tab-${id}" data-link="Italy" data-toggle="pill" href="#pills-Italy-${id}" role="tab" aria-controls="pills-Italy-${id}" aria-selected="false">
										<img src="/img/match/football/it.png" alt="">
										<p class="country__item_text">Италия</p>
									</div>
									<div class="col-6 col-sm-4 country__item border-right-0" id="pills-England-tab-${id}" data-link="England" data-toggle="pill" href="#pills-England-${id}" role="tab" aria-controls="pills-England-${id}" aria-selected="false">
										<img src="/img/match/football/eng.png" alt="">
										<p class="country__item_text">Англия</p>
									</div>
									<div class="col-6 col-sm-4 country__item border_bottom_none" id="pills-France-tab-${id}"  data-link="France"data-toggle="pill" href="#pills-France-${id}" role="tab" aria-controls="pills-France-${id}" aria-selected="false">
										<img src="/img/match/football/fr.png" alt="">
										<p class="country__item_text">Франция</p>
									</div>
									<div class="col-6 col-sm-4 country__item border_bottom_none" id="pills-Spain-tab-${id}" data-link="Spain" data-toggle="pill" href="#pills-Spain-${id}" role="tab" aria-controls="pills-Spain-${id}" aria-selected="false">
										<img src="/img/match/football/sp.png" alt="">
										<p class="country__item_text">Испания</p>
									</div>
									<div class="col-6 col-sm-4 country__item border-right-0 border_bottom_none" id="pills-Germany-tab-${id}" data-link="Germany" data-toggle="pill" href="#pills-Germany-${id}" role="tab" aria-controls="pills-Germany-${id}" aria-selected="false">
										<img src="/img/match/football/ger.png" alt="">
										<p class="country__item_text">Германия</p>
									</div>
								</div>

								<div class="row tab-content">
									<div class="col-md-6 tab-pane fade show active" id="pills-Russia-${id}" role="tabpanel" aria-labelledby="pills-Russia-tab-${id}">
										<p class="title__room mb-3">Турниры России</p>
										<div class="load-wrapp" id="tournir_Russia-${id}">
											<div class="load-3">
												<div class="line green-background"></div>
												<div class="line green-background"></div>
												<div class="line green-background"></div>
											</div>
										</div>
									</div>

									<div class="col-md-6 tab-pane fade" id="pills-Italy-${id}" role="tabpanel" aria-labelledby="pills-Italy-tab-${id}">
										<p class="title__room mb-3">Турниры Италии</p>
										<div class="load-wrapp" id="tournir_Italy-${id}">
											<div class="load-3">
												<div class="line green-background"></div>
												<div class="line green-background"></div>
												<div class="line green-background"></div>
											</div>
										</div>
									</div>

									<div class="col-md-6 tab-pane fade" id="pills-England-${id}" role="tabpanel" aria-labelledby="pills-England-tab-${id}">
										<p class="title__room mb-3">Турниры Англия</p>
										<div class="load-wrapp" id="tournir_England-${id}">
											<div class="load-3">
												<div class="line green-background"></div>
												<div class="line green-background"></div>
												<div class="line green-background"></div>
											</div>
										</div>
									</div>

									<div class="col-md-6 tab-pane fade" id="pills-France-${id}" role="tabpanel" aria-labelledby="pills-France-tab-${id}">
										<p class="title__room mb-3">Турниры Франция</p>
										<div class="load-wrapp" id="tournir_France-${id}">
											<div class="load-3">
												<div class="line green-background"></div>
												<div class="line green-background"></div>
												<div class="line green-background"></div>
											</div>
										</div>
									</div>

									<div class="col-md-6 tab-pane fade" id="pills-Spain-${id}" role="tabpanel" aria-labelledby="pills-Spain-tab-${id}">
										<p class="title__room mb-3">Турниры Испания</p>
										<div class="load-wrapp" id="tournir_Spain-${id}">
											<div class="load-3">
												<div class="line green-background"></div>
												<div class="line green-background"></div>
												<div class="line green-background"></div>
											</div>
										</div>
									</div>

									<div class="col-md-6 tab-pane fade" id="pills-Germany-${id}" role="tabpanel" aria-labelledby="pills-Germany-tab-${id}">
										<p class="title__room mb-3">Турниры Германия</p>
										<div class="load-wrapp" id="tournir_Germany-${id}">
											<div class="load-3">
												<div class="line green-background"></div>
												<div class="line green-background"></div>
												<div class="line green-background"></div>
											</div>
										</div>
									</div>

									<div class="col-md-6" id="pills-All-${id}">
										<p class="title__room mb-3">Международные турниры</p>
										<div class="load-wrapp" id="worldship_list_loader-${id}">
											<div class="load-3">
												<div class="line green-background"></div>
												<div class="line green-background"></div>
												<div class="line green-background"></div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div class="country__select tab-pane fade" id="pills-hockey-${id}" role="tabpanel" aria-labelledby="pills-hockey-tab-${id}">
								<div class="tournir__card onhover">
									<div class="toutrnir__card_subtitle text-truncate">
										<p class="tournir__card_text">Лига чемпионов</p>
										<img src="" alt="" class="img-fluid">
									</div>
									<div class="tournir__card_blocktext">
										<p class="blocktext__date">26 октября</p>
										<p class="blocktext__time">12:45</p>
									</div>
								</div>
							</div>

							<div class="country__select tab-pane fade" id="pills-basketball-${id}" role="tabpanel" aria-labelledby="pills-basketball-tab-${id}">
								<div class="load-wrapp" id="worldship_list_basketball-${id}">
									<div class="load-3">
										<div class="line orange-background"></div>
										<div class="line orange-background"></div>
										<div class="line orange-background"></div>
									</div>
								</div>
							</div>
						</div>
					</div>`;

	$('#add_tournir').before(item_new);
}

function load_info_room(data_load){
	if(data_load.data('load') == false){
		let id = data_load.closest('.room__item').attr('id');
		var token = { 'token' : localStorage.getItem('token')};


		$.ajax({
			url: `/rooms/my/${id}/stats`,
			type:"POST",
			data: JSON.stringify(token),
			processData: false,
			contentType: false,
			success: function(data){
				var data = JSON.parse(data);
				console.log(data.data); 

				for(let key in data.data){
					var idRoomTable = randomString(7);
					let item = `<div class="rooms__table_params">
									<p class="rooms__table_text">${data.data[key].league_title}</p>
									<p class="rooms__table_text">23.04.2020 15:45</p>
								</div>
								<table class="tournir__table">
									<tbody data-idTable="${idRoomTable}">
										<tr class="table__menu">
											<td></td>
											<td>Имя прогнозиста</td>
											<td>Прогнозы</td>
											<td>Точный счет</td>
											<td class="dis-no">Исходы и разница</td>
											<td class="dis-no">Исходы</td>
											<td class="dis-no">Очки</td>
										</tr>
									</tbody>
								</table>`;
					$(data_load).closest('.room__item[id='+id+']').find('.rooms__table_block').append(item);

					for( let keys in data.data[key].users){
						let i = 1;
						let items = `<tr class="two">
										<td>${i}</td>
										<td>
											<div class="user__info_about ">
												<img class="mr-1 " src="/img/main/table_noimg.png">
												<p>${keys}</p>
											</div>
										</td>
										<td>
											<p class="section__item_text"><span class="point__prog">${data.data[key].users[keys].lose}</span>/<span class="title-foot">${data.data[key].users[keys].win}</span></p>
										</td>
										<td>${data.data[key].users[keys].cat1}</td>
										<td class="dis-no">${data.data[key].users[keys].cat2}</td>
										<td class="dis-no">${data.data[key].users[keys].cat3}</td>
										<td class="dis-no">${data.data[key].users[keys].total}</td>
									</tr>`;
						$(data_load).closest('.room__item[id='+id+']').find('.rooms__table_block').find('.tournir__table').children('[data-idTable="'+idRoomTable+'"]').append(items);
						i++;
					}
				}
			},
			error: function(data){
				var data = JSON.parse(data);
				console.log(data);
			}
		});
		data_load.data('load', true);
	} else {
		return;
	}
}