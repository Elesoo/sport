window.onload = () => {
	let items = document.getElementsByClassName('tournir__menu_item_head');
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

	let items_v = document.getElementsByClassName('tournir__menu_items');
	lastElem_v = items_v[0];
	for (let i = 0; i < items_v.length; i++) {
		items_v[i].addEventListener('click', function() {
			lastElem_v.classList.remove('active');
			items_v[i].classList.add('active');

			let tabOld = document.getElementById(lastElem_v.dataset.tab);
			let tabNew = document.getElementById(items_v[i].dataset.tab);
			tabOld.classList.remove('active');
			tabNew.classList.add('active');
			
			lastElem_v = items_v[i];
		});
	}	


	var token = { 'token' : localStorage.getItem('token')};

	$.ajax({
		url: '/api/user/me',
		type:"POST",
		data: JSON.stringify(token),
		processData: false,
		contentType: false,
		success: function(data){
			var data = JSON.parse(data);
			console.log(data);

			$('.profile__name').append(data.data.name + ' ' + data.data.surname);
			          
		},
		error: function(data){
			var data = JSON.parse(data);
			console.log(data);
		}
	});

	$.ajax({
		url: '/api/user/avatar/me',
		type:"POST",
		data: JSON.stringify(token),
		processData: false,
		contentType: false,
		success: function(data){
			var data = JSON.parse(data);
			console.log(data);
			$('#user_img').attr('src', 'data:image/png;base64,'+data.data);
			          
		},
		error: function(data){
			var data = JSON.parse(data);
			console.log(data);
		}
	});

	$.ajax({
		url: '/api/user/balance',
		type:"POST",
		data: JSON.stringify(token),
		processData: false,
		contentType: false,
		success: function(data){
			var data = JSON.parse(data);
			console.log(data);
			$('#balance_now').append(data.data.total_balance + '₽');
			$('#out_money_now').append(data.data.total_balance + '₽');
			$('#out_money_success').append(data.data.success + '₽');
			if(data.data.all_transactions.length != 0 ){
				for(var key in data.data.all_transactions){
					let status;
					if(data.data.all_transactions[key].status == 1){
						status = 'В обработке';
					} else {
						status = 'Успешно проведена';
					}
					let d = new Date(data.data.all_transactions[key].date *1000);
			    timeStampCon = d.getDate() + '.' + (d.getMonth() +1) + '.' + d.getFullYear() + " " + d.getHours() + ':' + d.getMinutes();

					let item = `<tr>
												<td>${key + 1}</td>
												<td>
													${timeStampCon}
												</td>
												<td>
													${data.data.all_transactions[key].amount}₽
												</td>
												<td>
													${status}
												</td>
											</tr>`;
					$('#money_status').append(item);
				}
			} else {
				let item = `<tr style="text-align:center;">
											<td colspan='4'>История выплат пуста</td>
										</tr>`;
				$('#money_status').append(item);
			}
			          
		},
		error: function(data){
			// var data = JSON.parse(data);
			console.log(data);
		}
	});

	$.ajax({
		url: '/api/user/bets',
		type:"POST",
		data: JSON.stringify(token),
		processData: false,
		contentType: false,
		success: function(data){
			var data = JSON.parse(data);
			console.log(data);
			          
		},
		error: function(data){
			// var data = JSON.parse(data);
			console.log(data);
		}
	});

	$.ajax({
		url: '/api/user/stat/me',
		type:"POST",
		data: JSON.stringify(token),
		processData: false,
		contentType: false,
		success: function(data){
			var data = JSON.parse(data);
			console.log(data);
			          
		},
		error: function(data){
			// var data = JSON.parse(data);
			console.log(data);
		}
	});


	$('#load_avatar').on('change', function(e){
		let file = e.target.files
		if (file[0]) {
	       
	       var FR= new FileReader();
	       
	       FR.addEventListener("load", function(e) {
	       	let ava = e.target.result;
	         var token = { 
				'token' : localStorage.getItem('token')
			};

			token['avatar'] = ava.split(',')[1];
	         $.ajax({
				url: '/api/user/avatar/change',
				type:"POST",
				data: JSON.stringify(token),
				processData: false,
				contentType: false,
				success: function(data){
					var data = JSON.parse(data);
					if(data.error){
						console.log(data.error);
					} else {
						location.reload();
					}
				},
				error: function(data){
					// var data = JSON.parse(data);
					console.log(data);
				}
			});
	       }); 
	       
	       FR.readAsDataURL( file[0] );
	     }
	})

};


function take_money(){
	if( $('#check').is(':checked')){
		let money = $('.form__money_input').val();

		if( money == ''){
			alert('Вы не указали количество денег');
			return;
		}

		var token = { 
			'token' : localStorage.getItem('token'),
			'amount' : $('.form__money_input').val()
		};

		console.log(JSON.stringify(token));

		$.ajax({
			url: '/api/user/withdrawal',
			type:"POST",
			data: JSON.stringify(token),
			processData: false,
			contentType: false,
			success: function(data){
				var data = JSON.parse(data);
				console.log(data);

				if ( data.error){
					alert(data.error.message);
				}

				$('.form__money_input').val('');
				$('#check').removeAttr('checked');
				          
			},
			error: function(data){
				// var data = JSON.parse(data);
				console.log(data);
			}
		});
	} else {
		alert('Вы не дали согласие на обработку данных');
	}
}


function save_profile_settings(){
	
	var token = { 
		'token' : localStorage.getItem('token')
	};

	if ($('#settings_name').val() == '' && $('#settings_surname').val() == '' && $('#settings_nickname').val() == ''){
		return;
	}

	if($('#settings_name').val() != ''){
		token['name'] = $('#settings_name').val();
	}

	if($('#settings_surname').val() != ''){
		token['surname'] = $('#settings_surname').val();
	}

	if($('#settings_nickname').val() != ''){
		token['username'] = $('#settings_nickname').val();
	}

	console.log(token);


	$.ajax({
		url: '/api/user/edit',
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
			// var data = JSON.parse(data);
			console.log(data);
		}
	});

}