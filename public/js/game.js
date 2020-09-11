	// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAXT80Pt-FoVhaQENIj_BqDiUIyl5tXW8E",
    authDomain: "sport-interest.firebaseapp.com",
    databaseURL: "https://sport-interest.firebaseio.com",
    projectId: "sport-interest",
    storageBucket: "sport-interest.appspot.com",
    messagingSenderId: "653034520433",
    appId: "1:653034520433:web:a04b35895bec5b2c6e00d0",
    measurementId: "G-H06DFDRK3T"
  };
// Initialize Firebase
  

$(document).ready(function(){
	var tmp = document.location.search;
	var id = tmp.split('=')[1];

	$.ajax({
		url: `/football/fullGame/${id}`,
		cache: false,
		dataType: "text",
		beforeSend: function(){
	      	$('#game_info').css('display', 'block');
	      },
		success: function(data){
			$('#game_info').css('display', 'none');
			data = JSON.parse(data);
			console.log(data);

			let time = parseInt(data.data.current_game.timestamp)
			let date = new Date(time*1000);
			var months = ['Янв','Фев','Март','Апр','Май','Июнь','Июль','Авг','Сен','Окт','Нояб','Дек'];
			var month = months[date.getMonth()];

			let dataMatch = `<p class="match__cont_subtitle match__cont_date">${date.getHours()}:${date.getMinutes()} / ${date.getDate()} ${month } ${date.getFullYear()}</p>`;
			$('.match__main_cont').prepend(dataMatch);

			let startMatch = `<div class="icon__cont mr-md-5">
								<img src="${data.data.current_game.team1_logo}" alt="" class="img-fluid mb-3">
								<p class="match__main_team_subtitle">
									${data.data.current_game.team1_title}
								</p>
							</div>
							<div class="score__cont mr-md-5">
								<p class="score__cont_count">${data.data.current_game.score.split(':')[0]} : ${data.data.current_game.score.split(':')[1]}</p>
								<!-- <p class="score__cont_tour">
								 	1-й тайм
								 </p>-->
								<!-- <p class="score__cont_time">12:43</p>-->
							</div>
							<div class="icon__cont">
								<img src="${data.data.current_game.team2_logo}" alt="" class="img-fluid mb-3">
								<p class="match__main_team_subtitle">
									${data.data.current_game.team2_title}
								</p>
							</div>`;

			$('.match__cont_charact').append(startMatch);

			let login = $('.match__text').data('login');
			if ( login == false){
				load_game(data.data.current_game.state, login, id)
			} else {
				load_game(data.data.current_game.state, login, id)
			}
		},
		error: function(data){
			$('#game_info').css('display', 'none');
		}
	});

	firebase.initializeApp(firebaseConfig);
  	firebase.analytics();
});

function load_game(state, login, id){
	if ( login == false){
		if (state == 2){
			$('.match__text').prepend(`<p class="football__game_title">Чат</p>
									   <p><a href="" data-toggle="modal" data-target="#regModal">Авторизуйтесь</a>, чтобы оставить сообщение</p>`);
		} else {
			$('.match__text').prepend(`<p class="football__game_title">Комментарии</p>
									   <p><a href="" data-toggle="modal" data-target="#regModal">Авторизуйтесь</a>, чтобы оставить сообщение</p>`);
			$.ajax({
				url: `/football/game/${id}/comments`,
				cache: false,
				dataType: "text",
				beforeSend: function(){
			      	$('#game_comment').css('display', 'block');
			      },
				success: function(data){
					$('#game_comment').css('display', 'none');
					data = JSON.parse(data);
					console.log(data);
					if(data.data == "Нет комментариев"){
						$('.comments').append(`<p style="text-align: center;">${data.data}</p>`);
					} else {

					}
				},
				error: function(data){
					$('#game_comment').css('display', 'none');
				}
			});
		}
	} else {
		if (state == 2){
			$('.match__text').prepend(`<p class="football__game_title">Чат</p>
									<textarea name="" id="textarea_comment" cols="30" rows="10"></textarea>
									<button class="header__enter" onclick="send_chat(${id})">Отправить</button>`);
			load_chats(id);
		} else {
			$('.match__text').prepend(`<p class="football__game_title">Комментарии</p>
									<textarea name="" id="textarea_comment" cols="30" rows="10"></textarea>
									<button class="header__enter" onclick="send_comment(${id})">Отправить</button>`);
			$.ajax({
				url: `/football/game/${id}/comments`,
				cache: false,
				dataType: "text",
				beforeSend: function(){
			      	$('#game_comment').css('display', 'block');
			      },
				success: function(data){
					$('#game_comment').css('display', 'none');
					data = JSON.parse(data);
					console.log(data);
					if(data.data == "Нет комментариев"){
						$('.comments').append(`<p style="text-align: center;">${data.data}</p>`);
					} else {
						for(let key in data.data){
							let time = parseInt(data.data[key].timestamp)
							let date = new Date(time*1000);
							let item_comment = `<div class="comment__item">
													<div class="comment__header">
														<div class="comment__text_block">
															<div class="comment__header_inf">
																<img src="data:image/png;base64,${data.data[key].avatar}" alt="" class="mr-3">
																<div>
																	<p class="inf__nick">
																		${data.data[key].user} 
																		<span style="font-weight: normal;">${date.getDate()}.${date.getMonth()}.${date.getFullYear()} в ${date.getHours()}:${date.getMinutes()}</span>
																	</p>
																</div>
															</div>
															<p class="comment__body_text">
																${data.data[key].text}
															</p>
														</div>
													</div>
													<div class="comment__footer">
														<!--<ul class="comment__footer_list">
															<li class="comment__list_item">
																<a href="" class="comment__list_link">Ответить</a>
															</li>
															<li class="comment__list_item">
																<a href="" class="comment__list_link">Поделиться</a>
															</li>
															<li class="comment__list_item">
																<a href="" class="comment__list_link">Пожаловаться</a>
															</li>
														</ul>
														<div class="comment__footer_btn">
															{# like #}
															<svg style="margin-top: -10px;" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M23 13.6562C23 13.0803 22.7709 12.5436 22.3761 12.1478C22.8237 11.6581 23.0518 11.0016 22.9894 10.3183C22.8773 9.10029 21.78 8.14579 20.4901 8.14579H14.5705C14.8637 7.25549 15.3333 5.62348 15.3333 4.31247C15.3333 2.23385 13.5671 0.479156 12.4583 0.479156C11.4636 0.479156 10.7515 1.03978 10.7218 1.06278C10.6078 1.15384 10.5416 1.29184 10.5416 1.43747V4.68717L7.78069 10.6662L7.66664 10.7247V10.5416C7.66664 10.2771 7.45195 10.0624 7.18745 10.0624H2.39582C1.07431 10.0625 0 11.1368 0 12.4583V20.125C0 21.4465 1.07431 22.5208 2.39582 22.5208H5.27082C6.30676 22.5208 7.19226 21.8595 7.52576 20.9367C8.32312 21.3468 9.39644 21.5625 10.0625 21.5625H18.8591C19.9027 21.5625 20.816 20.859 21.0306 19.8892C21.1408 19.389 21.0766 18.8858 20.8581 18.4488C21.5654 18.0933 22.0417 17.3621 22.0417 16.5312C22.0417 16.192 21.9641 15.8671 21.8174 15.5738C22.5247 15.2174 23 14.4871 23 13.6562ZM20.9789 14.8388C20.7939 14.8609 20.6377 14.9864 20.5783 15.1637C20.5199 15.341 20.5687 15.5355 20.7048 15.6639C20.9482 15.893 21.0834 16.2015 21.0834 16.5312C21.0834 17.1359 20.6262 17.6439 20.0215 17.7138C19.8366 17.7359 19.6804 17.8614 19.621 18.0387C19.5625 18.216 19.6114 18.4105 19.7475 18.5389C20.0628 18.836 20.1893 19.2529 20.0944 19.6822C19.9765 20.217 19.4571 20.6042 18.8591 20.6042H10.0625C9.28432 20.6042 7.97907 20.239 7.52675 19.7857C7.38969 19.6497 7.18269 19.6094 7.00444 19.6822C6.82525 19.756 6.70832 19.9314 6.70832 20.125C6.70832 20.9175 6.06337 21.5625 5.27082 21.5625H2.39582C1.60326 21.5625 0.958318 20.9175 0.958318 20.125V12.4583C0.958318 11.6657 1.60326 11.0208 2.39582 11.0208H6.70832V11.5C6.70832 11.6658 6.79457 11.82 6.93639 11.9082C7.07632 11.9925 7.25264 12.0012 7.40214 11.9284L8.36045 11.4492C8.45726 11.4012 8.53489 11.3207 8.58089 11.222L11.4559 4.99286C11.4846 4.92961 11.5 4.86061 11.5 4.79161V1.69717C11.6993 1.58697 12.0453 1.43747 12.4583 1.43747C12.9835 1.43747 14.375 2.74272 14.375 4.31247C14.375 5.99916 13.4569 8.43042 13.4483 8.45441C13.3927 8.60103 13.4119 8.76684 13.501 8.89716C13.5911 9.02653 13.7387 9.10416 13.8958 9.10416H20.4901C21.2894 9.10416 21.9679 9.67628 22.0349 10.4065C22.0858 10.9528 21.8231 11.4722 21.3526 11.7626C21.206 11.8527 21.1188 12.0156 21.1255 12.189C21.1322 12.3625 21.2319 12.5177 21.3852 12.5973C21.7906 12.8033 22.0416 13.2097 22.0416 13.6562C22.0417 14.2609 21.5846 14.7689 20.9789 14.8388Z" fill="#7C7C7C"/>
															<path d="M7.18621 11.0208C6.92171 11.0208 6.70703 11.2355 6.70703 11.5V20.125C6.70703 20.3895 6.92171 20.6042 7.18621 20.6042C7.45071 20.6042 7.6654 20.3895 7.6654 20.125V11.5C7.6654 11.2355 7.45071 11.0208 7.18621 11.0208Z" fill="#7C7C7C"/>
															</svg>
															<span class="ml-2 mr-2">1</span>
															{# dislike #}
															<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M0 8.53126C0 9.05713 0.209139 9.54714 0.569626 9.90853C0.160986 10.3556 -0.0472507 10.955 0.00963783 11.5789C0.112013 12.691 1.1139 13.5625 2.29163 13.5625H7.6965C7.42875 14.3754 7.00001 15.8655 7.00001 17.0625C7.00001 18.9604 8.61263 20.5625 9.62501 20.5625C10.5333 20.5625 11.1834 20.0506 11.2105 20.0296C11.3147 19.9465 11.375 19.8205 11.375 19.6875V16.7204L13.8959 11.2613L14 11.2079V11.375C14 11.6165 14.196 11.8126 14.4375 11.8126H18.8125C20.0191 11.8125 21 10.8316 21 9.62503V2.62502C21 1.41838 20.0191 0.437529 18.8125 0.437529H16.1875C15.2417 0.437529 14.4332 1.04128 14.1287 1.8839C13.4006 1.50939 12.4206 1.31252 11.8125 1.31252H3.78086C2.82799 1.31252 1.9941 1.95478 1.79812 2.84027C1.69751 3.29701 1.75612 3.75639 1.95563 4.15539C1.30988 4.48003 0.874987 5.14764 0.874987 5.90626C0.874987 6.21601 0.945862 6.51264 1.07974 6.78039C0.433987 7.10589 0 7.77264 0 8.53126ZM1.84538 7.45153C2.01424 7.43139 2.15689 7.31679 2.21111 7.1549C2.26447 6.99301 2.21985 6.81542 2.09561 6.69815C1.87335 6.48901 1.74997 6.20728 1.74997 5.90626C1.74997 5.35415 2.16735 4.89039 2.71946 4.82653C2.88832 4.80639 3.03097 4.69179 3.0852 4.5299C3.13856 4.36802 3.09393 4.19042 2.96969 4.07315C2.68181 3.80192 2.56631 3.42129 2.65293 3.02926C2.76056 2.54101 3.23482 2.1875 3.78082 2.1875H11.8125C12.523 2.1875 13.7148 2.52088 14.1277 2.93476C14.2529 3.059 14.4419 3.09575 14.6046 3.02926C14.7682 2.96188 14.875 2.80175 14.875 2.62502C14.875 1.90138 15.4639 1.31252 16.1875 1.31252H18.8125C19.5362 1.31252 20.125 1.90138 20.125 2.62502V9.62503C20.125 10.3487 19.5362 10.9375 18.8125 10.9375H14.875V10.5C14.875 10.3486 14.7963 10.2078 14.6668 10.1273C14.539 10.0503 14.378 10.0424 14.2415 10.1089L13.3665 10.5464C13.2782 10.5902 13.2073 10.6637 13.1653 10.7538L10.5403 16.4413C10.514 16.499 10.5 16.562 10.5 16.625V19.4504C10.318 19.551 10.0021 19.6875 9.62501 19.6875C9.1455 19.6875 7.875 18.4958 7.875 17.0625C7.875 15.5225 8.71324 13.3027 8.72111 13.2808C8.77185 13.1469 8.75437 12.9955 8.673 12.8765C8.59076 12.7584 8.45599 12.6875 8.31251 12.6875H2.29163C1.56188 12.6875 0.942375 12.1651 0.881138 11.4984C0.834749 10.9996 1.07453 10.5254 1.50413 10.2602C1.638 10.178 1.71761 10.0292 1.7115 9.87088C1.70539 9.71251 1.61437 9.57076 1.47439 9.49813C1.10426 9.30999 0.875029 8.939 0.875029 8.53126C0.874987 7.97915 1.29236 7.51539 1.84538 7.45153Z" fill="#7C7C7C"/>
															<path d="M14.4375 10.9375C14.679 10.9375 14.875 10.7415 14.875 10.5V2.62499C14.875 2.38349 14.679 2.18748 14.4375 2.18748C14.196 2.18748 14 2.38349 14 2.62499V10.5C14 10.7415 14.196 10.9375 14.4375 10.9375Z" fill="#7C7C7C"/>
															</svg>
															<span class="ml-2">1</span>
														</div>-->
													</div>
												</div>`;

							$('.comments').append(item_comment);
						}
					}
				},
				error: function(data){
					$('#game_comment').css('display', 'none');
				}
			});
		}
	}
}

function send_comment(id){
	if ($('#textarea_comment').val() == ''){
		alert('Вы не ввели сообщение');
		return;
	}
	
	var token = { 
		'token' : localStorage.getItem('token'),
		'text' : $('#textarea_comment').val()
	};
	$.ajax({
		url: `/football/game/${id}/addComment`,
		type:"POST",
		data: JSON.stringify(token),
		processData: false,
		contentType: false,
		success: function(data){
			data = JSON.parse(data);
			console.log(data);
			alert('Комментарий отправлен');
			// location.reload();
		},
		error: function(data){
		}
	});
}

let item_protocol = `<div class="contaiber-fluid" style="background: #F4F4F4;">
		<div class="container">
			<p class="football__game_title">Личные встречи</p>
			<div class="row">
				<div class="col-xl-8">
					<div class="cards__meet">
						<div class="card__item">
							<p class="card__item_status">10.05.2020 14:00
							</p>
							<p class="card__item_status">Тур 21</p>

							<div class="card__item_body">
								<div class="icon__cont mr-3">
									<img src="/img/match_status/vol.png" alt="">
									<p class="card__item_subtitle">Вольсбург</p>
								</div>
								<p class="score__cont_tour">2:0</p>
								<div class="icon__cont ml-3">
									<img src="/img/match_status/vol.png" alt="">
									<p class="card__item_subtitle">Вольсбург</p>
								</div>
							</div>
						</div>
						<div class="card__item">
							<p class="card__item_status">10.05.2020 14:00
							</p>
							<p class="card__item_status">Тур 21</p>

							<div class="card__item_body">
								<div class="icon__cont mr-3">
									<img src="/img/match_status/vol.png" alt="">
									<p class="card__item_subtitle">Вольсбург</p>
								</div>
								<p class="score__cont_tour">2:0</p>
								<div class="icon__cont ml-3">
									<img src="/img/match_status/vol.png" alt="">
									<p class="card__item_subtitle">Вольсбург</p>
								</div>
							</div>
						</div>
						<div class="card__item">
							<p class="card__item_status">10.05.2020 14:00
							</p>
							<p class="card__item_status">Тур 21</p>

							<div class="card__item_body">
								<div class="icon__cont mr-3">
									<img src="/img/match_status/vol.png" alt="">
									<p class="card__item_subtitle">Вольсбург</p>
								</div>
								<p class="score__cont_tour">2:0</p>
								<div class="icon__cont ml-3">
									<img src="/img/match_status/vol.png" alt="">
									<p class="card__item_subtitle">Вольсбург</p>
								</div>
							</div>
						</div>
						<div class="card__item">
							<p class="card__item_status">10.05.2020 14:00
							</p>
							<p class="card__item_status">Тур 21</p>

							<div class="card__item_body">
								<div class="icon__cont mr-3">
									<img src="/img/match_status/vol.png" alt="">
									<p class="card__item_subtitle">Вольсбург</p>
								</div>
								<p class="score__cont_tour">2:0</p>
								<div class="icon__cont ml-3">
									<img src="/img/match_status/vol.png" alt="">
									<p class="card__item_subtitle">Вольсбург</p>
								</div>
							</div>
						</div>
					</div>
					<p class="football__game_title">Последние матчи команд</p>
					
					<div class="teams">
						<div class="team__block">
							<p class="team__block_subtitle">Динамо</p>
							<div class="team__group">
								<div class="team__item">
									<div class="card__item">
										<p class="card__item_status">10.05.2020 14:00
										</p>
										<p class="card__item_status">Тур 21</p>

										<div class="card__item_body">
											<div class="icon__cont mr-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
											<p class="score__cont_tour">2:0</p>
											<div class="icon__cont ml-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
										</div>
									</div>
									<div class="card__item">
										<p class="card__item_status">10.05.2020 14:00
										</p>
										<p class="card__item_status">Тур 21</p>

										<div class="card__item_body">
											<div class="icon__cont mr-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
											<p class="score__cont_tour">2:0</p>
											<div class="icon__cont ml-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
										</div>
									</div>
								</div>
								<div class="team__item">
									<div class="card__item">
										<p class="card__item_status">10.05.2020 14:00
										</p>
										<p class="card__item_status">Тур 21</p>

										<div class="card__item_body">
											<div class="icon__cont mr-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
											<p class="score__cont_tour">2:0</p>
											<div class="icon__cont ml-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
										</div>
									</div>
									<div class="card__item">
										<p class="card__item_status">10.05.2020 14:00
										</p>
										<p class="card__item_status">Тур 21</p>

										<div class="card__item_body">
											<div class="icon__cont mr-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
											<p class="score__cont_tour">2:0</p>
											<div class="icon__cont ml-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="team__block">
							<p class="team__block_subtitle">Вольсбург</p>
							<div class="team__group">
								<div class="team__item">
									<div class="card__item">
										<p class="card__item_status">10.05.2020 14:00
										</p>
										<p class="card__item_status">Тур 21</p>

										<div class="card__item_body">
											<div class="icon__cont mr-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
											<p class="score__cont_tour">2:0</p>
											<div class="icon__cont ml-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
										</div>
									</div>
									<div class="card__item">
										<p class="card__item_status">10.05.2020 14:00
										</p>
										<p class="card__item_status">Тур 21</p>

										<div class="card__item_body">
											<div class="icon__cont mr-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
											<p class="score__cont_tour">2:0</p>
											<div class="icon__cont ml-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
										</div>
									</div>
								</div>
								<div class="team__item">
									<div class="card__item">
										<p class="card__item_status">10.05.2020 14:00
										</p>
										<p class="card__item_status">Тур 21</p>

										<div class="card__item_body">
											<div class="icon__cont mr-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
											<p class="score__cont_tour">2:0</p>
											<div class="icon__cont ml-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
										</div>
									</div>
									<div class="card__item">
										<p class="card__item_status">10.05.2020 14:00
										</p>
										<p class="card__item_status">Тур 21</p>

										<div class="card__item_body">
											<div class="icon__cont mr-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
											<p class="score__cont_tour">2:0</p>
											<div class="icon__cont ml-3">
												<img src="/img/match_status/vol.png" alt="">
												<p class="card__item_subtitle">Вольсбург</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>	
				</div>
			</div>
		</div>
	</div>`;


function load_chats(id){
	firebase.database().ref(`/threads/${id}/messages`).on('child_added', snapshot => {
	console.log(snapshot.val())
		var msg = snapshot.val().msg;
		var username = snapshot.val().username;
		let item = `<div class="comment__item">
					<div class="comment__header">
						<div class="comment__text_block">
							<div class="comment__header_inf">
								<img src="" alt="" class="mr-3">
								<div>
									<p class="inf__nick">
										${username} 
										<span style="font-weight: normal;"></span>
									</p>
								</div>
							</div>
							<p class="comment__body_text">
								${msg}
							</p>
						</div>
					</div>
					<div class="comment__footer">
						<!--<ul class="comment__footer_list">
							<li class="comment__list_item">
								<a href="" class="comment__list_link">Ответить</a>
							</li>
							<li class="comment__list_item">
								<a href="" class="comment__list_link">Поделиться</a>
							</li>
							<li class="comment__list_item">
								<a href="" class="comment__list_link">Пожаловаться</a>
							</li>
						</ul>
						<div class="comment__footer_btn">
							{# like #}
							<svg style="margin-top: -10px;" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M23 13.6562C23 13.0803 22.7709 12.5436 22.3761 12.1478C22.8237 11.6581 23.0518 11.0016 22.9894 10.3183C22.8773 9.10029 21.78 8.14579 20.4901 8.14579H14.5705C14.8637 7.25549 15.3333 5.62348 15.3333 4.31247C15.3333 2.23385 13.5671 0.479156 12.4583 0.479156C11.4636 0.479156 10.7515 1.03978 10.7218 1.06278C10.6078 1.15384 10.5416 1.29184 10.5416 1.43747V4.68717L7.78069 10.6662L7.66664 10.7247V10.5416C7.66664 10.2771 7.45195 10.0624 7.18745 10.0624H2.39582C1.07431 10.0625 0 11.1368 0 12.4583V20.125C0 21.4465 1.07431 22.5208 2.39582 22.5208H5.27082C6.30676 22.5208 7.19226 21.8595 7.52576 20.9367C8.32312 21.3468 9.39644 21.5625 10.0625 21.5625H18.8591C19.9027 21.5625 20.816 20.859 21.0306 19.8892C21.1408 19.389 21.0766 18.8858 20.8581 18.4488C21.5654 18.0933 22.0417 17.3621 22.0417 16.5312C22.0417 16.192 21.9641 15.8671 21.8174 15.5738C22.5247 15.2174 23 14.4871 23 13.6562ZM20.9789 14.8388C20.7939 14.8609 20.6377 14.9864 20.5783 15.1637C20.5199 15.341 20.5687 15.5355 20.7048 15.6639C20.9482 15.893 21.0834 16.2015 21.0834 16.5312C21.0834 17.1359 20.6262 17.6439 20.0215 17.7138C19.8366 17.7359 19.6804 17.8614 19.621 18.0387C19.5625 18.216 19.6114 18.4105 19.7475 18.5389C20.0628 18.836 20.1893 19.2529 20.0944 19.6822C19.9765 20.217 19.4571 20.6042 18.8591 20.6042H10.0625C9.28432 20.6042 7.97907 20.239 7.52675 19.7857C7.38969 19.6497 7.18269 19.6094 7.00444 19.6822C6.82525 19.756 6.70832 19.9314 6.70832 20.125C6.70832 20.9175 6.06337 21.5625 5.27082 21.5625H2.39582C1.60326 21.5625 0.958318 20.9175 0.958318 20.125V12.4583C0.958318 11.6657 1.60326 11.0208 2.39582 11.0208H6.70832V11.5C6.70832 11.6658 6.79457 11.82 6.93639 11.9082C7.07632 11.9925 7.25264 12.0012 7.40214 11.9284L8.36045 11.4492C8.45726 11.4012 8.53489 11.3207 8.58089 11.222L11.4559 4.99286C11.4846 4.92961 11.5 4.86061 11.5 4.79161V1.69717C11.6993 1.58697 12.0453 1.43747 12.4583 1.43747C12.9835 1.43747 14.375 2.74272 14.375 4.31247C14.375 5.99916 13.4569 8.43042 13.4483 8.45441C13.3927 8.60103 13.4119 8.76684 13.501 8.89716C13.5911 9.02653 13.7387 9.10416 13.8958 9.10416H20.4901C21.2894 9.10416 21.9679 9.67628 22.0349 10.4065C22.0858 10.9528 21.8231 11.4722 21.3526 11.7626C21.206 11.8527 21.1188 12.0156 21.1255 12.189C21.1322 12.3625 21.2319 12.5177 21.3852 12.5973C21.7906 12.8033 22.0416 13.2097 22.0416 13.6562C22.0417 14.2609 21.5846 14.7689 20.9789 14.8388Z" fill="#7C7C7C"/>
							<path d="M7.18621 11.0208C6.92171 11.0208 6.70703 11.2355 6.70703 11.5V20.125C6.70703 20.3895 6.92171 20.6042 7.18621 20.6042C7.45071 20.6042 7.6654 20.3895 7.6654 20.125V11.5C7.6654 11.2355 7.45071 11.0208 7.18621 11.0208Z" fill="#7C7C7C"/>
							</svg>
							<span class="ml-2 mr-2">1</span>
							{# dislike #}
							<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 8.53126C0 9.05713 0.209139 9.54714 0.569626 9.90853C0.160986 10.3556 -0.0472507 10.955 0.00963783 11.5789C0.112013 12.691 1.1139 13.5625 2.29163 13.5625H7.6965C7.42875 14.3754 7.00001 15.8655 7.00001 17.0625C7.00001 18.9604 8.61263 20.5625 9.62501 20.5625C10.5333 20.5625 11.1834 20.0506 11.2105 20.0296C11.3147 19.9465 11.375 19.8205 11.375 19.6875V16.7204L13.8959 11.2613L14 11.2079V11.375C14 11.6165 14.196 11.8126 14.4375 11.8126H18.8125C20.0191 11.8125 21 10.8316 21 9.62503V2.62502C21 1.41838 20.0191 0.437529 18.8125 0.437529H16.1875C15.2417 0.437529 14.4332 1.04128 14.1287 1.8839C13.4006 1.50939 12.4206 1.31252 11.8125 1.31252H3.78086C2.82799 1.31252 1.9941 1.95478 1.79812 2.84027C1.69751 3.29701 1.75612 3.75639 1.95563 4.15539C1.30988 4.48003 0.874987 5.14764 0.874987 5.90626C0.874987 6.21601 0.945862 6.51264 1.07974 6.78039C0.433987 7.10589 0 7.77264 0 8.53126ZM1.84538 7.45153C2.01424 7.43139 2.15689 7.31679 2.21111 7.1549C2.26447 6.99301 2.21985 6.81542 2.09561 6.69815C1.87335 6.48901 1.74997 6.20728 1.74997 5.90626C1.74997 5.35415 2.16735 4.89039 2.71946 4.82653C2.88832 4.80639 3.03097 4.69179 3.0852 4.5299C3.13856 4.36802 3.09393 4.19042 2.96969 4.07315C2.68181 3.80192 2.56631 3.42129 2.65293 3.02926C2.76056 2.54101 3.23482 2.1875 3.78082 2.1875H11.8125C12.523 2.1875 13.7148 2.52088 14.1277 2.93476C14.2529 3.059 14.4419 3.09575 14.6046 3.02926C14.7682 2.96188 14.875 2.80175 14.875 2.62502C14.875 1.90138 15.4639 1.31252 16.1875 1.31252H18.8125C19.5362 1.31252 20.125 1.90138 20.125 2.62502V9.62503C20.125 10.3487 19.5362 10.9375 18.8125 10.9375H14.875V10.5C14.875 10.3486 14.7963 10.2078 14.6668 10.1273C14.539 10.0503 14.378 10.0424 14.2415 10.1089L13.3665 10.5464C13.2782 10.5902 13.2073 10.6637 13.1653 10.7538L10.5403 16.4413C10.514 16.499 10.5 16.562 10.5 16.625V19.4504C10.318 19.551 10.0021 19.6875 9.62501 19.6875C9.1455 19.6875 7.875 18.4958 7.875 17.0625C7.875 15.5225 8.71324 13.3027 8.72111 13.2808C8.77185 13.1469 8.75437 12.9955 8.673 12.8765C8.59076 12.7584 8.45599 12.6875 8.31251 12.6875H2.29163C1.56188 12.6875 0.942375 12.1651 0.881138 11.4984C0.834749 10.9996 1.07453 10.5254 1.50413 10.2602C1.638 10.178 1.71761 10.0292 1.7115 9.87088C1.70539 9.71251 1.61437 9.57076 1.47439 9.49813C1.10426 9.30999 0.875029 8.939 0.875029 8.53126C0.874987 7.97915 1.29236 7.51539 1.84538 7.45153Z" fill="#7C7C7C"/>
							<path d="M14.4375 10.9375C14.679 10.9375 14.875 10.7415 14.875 10.5V2.62499C14.875 2.38349 14.679 2.18748 14.4375 2.18748C14.196 2.18748 14 2.38349 14 2.62499V10.5C14 10.7415 14.196 10.9375 14.4375 10.9375Z" fill="#7C7C7C"/>
							</svg>
							<span class="ml-2">1</span>
						</div>-->
					</div>
				</div>`;

	$('.comments').prepend(item);
  });
}

function randomString(length) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");
	if (!length) {
		length = Math.floor(Math.random() * chars.length);
	}
	var str = "";
	for (var i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}
	return str;
}

function timeSet(){
	var time = Date.now();
	console.log(Math.trunc(time/1000));
}

function send_chat(id){
	var idMessages = randomString(6);
	var time = Date.now();
	var timeNow = Math.trunc(time/1000);
	firebase.database().ref(`/threads/${id}/messages/${idMessages}`).set({
		username: localStorage.getItem('username'),
		msg: $('#textarea_comment').val(),
		icon: '324234',
		timestamp: timeNow
	});
	$('#textarea_comment').val('');
}