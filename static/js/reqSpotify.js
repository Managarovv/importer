window.addEventListener('load', async () => {
	if (localStorage.getItem('access_token')){
		getUser().then((user) => {
			console.info(user.display_name)
			document.getElementById('welcome').innerHTML = //`<h1>Hello, ${user.display_name}</h1> <button id="find">найти</button>`
			`<h1 id="title" class="main-title">Welcome, ${user.display_name}</h1><br>`
			document.getElementById('form').style.visibility = 'visible'
  //<a class="cta-button" id="find" href="#">Get Started</a>`
			document.getElementById('find').addEventListener('click', () =>{
				//getUser() console.info(document.getElementById('idvalue').value)

				document.getElementById('form').style.visibility = 'hidden'
				document.getElementById('title').innerText = 'Search You vk-page, please wait'
				document.getElementById('imgload').style.visibility = 'visible'
				
				createPlaylist(user.id).then(playlist => {
					authorizeVk()
				})

					/*let array = [{
						track: 'Колыбельная',
						artist: 'Би-2'
					},
					{
						track: 'Draw Me Inside',
						artist: 'Skillet'
					},
					{
						track: 'Детство',
						artist: 'БИ-2'
					}]
					
					let o = 0
					let time = setInterval(()=>{
						findMusik(array[o].track, array[o].artist).then(track => {
							if (track) {
								console.info(localStorage.getItem('tracks_uris'))
							}
							else{
								artistFilter(array[o].track, array[o].artist).then(res => {
									console.info(localStorage.getItem('tracks_uris'))
								})
							}
							o++
							if(o==array.length)
							clearInterval(time)
						})
						
						}, 2000)*/
					
					/*forEach(function(item, index, arr) {
						findMusik(item.track, item.artist).then(track => {
						addTrack(localStorage.getItem('tracks_uris'), localStorage.getItem('playlistId'))
						})
					})*/
					
				
				
			})
		})
	}
	else {
		console.info('access_token false')
		var urlp = new URLSearchParams(window.location.search)
		if (urlp.get('code') || urlp.get('state')) {
			document.getElementById('welcome').innerHTML = `<h1 class="main-title">Logged</h1> <a href=# class="cta-button" id="nToken">Continue</a>`
			document.getElementById('nToken').addEventListener('click', () =>{
				getURLParams()
			})
		}
		else {
		document.getElementById('welcome').innerHTML = `<h1 class="main-title">Please login</h1>`/*<a href=# class="cta-button" id="nToken">новый токен</a>*/+`<a href=# class="cta-button" id="tocken">Sign in</a>`
		document.getElementById('tocken').addEventListener('click', () =>{/*getTocken()*/authorize()})
		//document.getElementById('nToken').addEventListener('click', () =>{getURLParams()})
		}
	}
/*createPlaylist('251yxkjyawpow2f4fkp92ithi')getUser()handleCallback()*/
})
//document.getElementById('tocken').addEventListener('click', () =>{/*getTocken()*/authorize()})
//document.getElementById('find').addEventListener('click', () =>{getUser()})//findMusik('https://api.spotify.com/v1/search?q=%20track:Open%20Air%20artist:Miracle%20Of%20Sound%20&type=artist,track')})
//document.getElementById('nToken').addEventListener('click', () =>{getURLParams()})
//var token = "BQAWAmkP1WjeZL9JAJlHhGRDiOdzsthsNrCT-D24zOoGRdQX9Ao2aY3-LQ0GvnBYXhfG3jRwYGoiDvOG38qcZ5Uf1-I5C9LulM27nOYLvWoew7v9nbwa"


// spotify

async function getTocken() {
	let url = "https://accounts.spotify.com/api/token"
	//console.info(data);
	//data = JSON.stringify(data);
	//console.info(data);
	var response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		//body: JSON.stringify({mark: "Audi", ort:"Cottbus", distance:"10"})
		body: new URLSearchParams({
			'grant_type': 'client_credentials',
			'client_id': '',
			'client_secret': ''
		//JSON.stringify(data)
		})
	});

	if (response.ok) {
		//let text = await response.json();
		let json = await response.json()
		console.info(json.access_token)
		localStorage.setItem('token', json.access_token)
		//findMusik(json)
	}
	else console.info('error')
}

async function getUser() {
	return /*var response =*/ await fetch('https://api.spotify.com/v1/me', {
		method: 'GET',
		headers: {
			//'Content-Type': 'application/json;charset=utf-8',
  			'Authorization': 'Bearer ' + localStorage.getItem('access_token')//+localStorage.getItem('token')
		}
	}).then((response) => {
  		if (response.ok) {/*console.info(response.json()) */return response.json()}
  		if (response.status == 401) {refreshToken()}
  }).then((user) => {
  		console.info(user, user.id)
  		localStorage.setItem('user_id', user.id)
  		//createPlaylist(localStorage.getItem('user_id'))
  		return user
  }).catch((error) => console.error(error))
}

async function findMusik(nameTrack, nameArtist) {
	for (var i = 0; i < nameTrack.length; i++) {
		if(nameTrack[i]=='(') {
			nameTrack = nameTrack.slice(0, i-1)
			break
		}
	}
	nameTrack = nameTrack.replaceAll(' ', '%20')

	for (var i = 0; i < nameArtist.length; i++) {
		if(nameArtist[i]=='('){
			nameArtist = nameArtist.slice(0, i-1)
		}
	}
	
	nameArtist = nameArtist.replaceAll(' ', '%20')
	console.info(nameTrack, nameArtist)
	//localStorage.setItem('track', nameTrack)
	var response = await fetch(`https://api.spotify.com/v1/search?q=%20track:${nameTrack}%20artist:${nameArtist}%20&type=artist,track&market=ES`, {
  		method: 'GET',
  		headers: {
  			'Content-Type': 'application/json;charset=utf-8',
  			'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  			//'Bearer  BQAWAmkP1WjeZL9JAJlHhGRDiOdzsthsNrCT-D24zOoGRdQX9Ao2aY3-LQ0GvnBYXhfG3jRwYGoiDvOG38qcZ5Uf1-I5C9LulM27nOYLvWoew7v9nbwa'
  		}
  	}).then((response) => {
  		if (response.ok) {/*console.info(response.json()) */return response.json()}
  		if (response.status == 401) {refreshToken()}

  	}).then((tracks) => {
  		//console.info(tracks) 
  		//console.info(tracks.tracks.items[0].uri)
			try{
				localStorage.setItem('tracks_uris', tracks.tracks.items[0].uri)
				return true
			}catch(e){
				//console.info(e)
				// nameTrack = nameTrack.replaceAll('%20', ' ')
				// nameArtist = nameArtist.replaceAll('%20', ' ')
				// console.info(nameTrack, nameArtist)
				localStorage.removeItem('tracks_uris')
				return false

				
				/*artistFilter(nameTrack, nameArtist).then(res =>{
					console.info(localStorage.getItem('tracks_uris'))
				})*/
			}
  	})
}

async function artistFilter(nameTrack, nameArtist){
	for (var i = 0; i < nameTrack.length; i++) {
		if(nameTrack[i]=='(') {
			nameTrack = nameTrack.slice(0, i-1)
			break
		}
	}
	nameTrack = nameTrack.replaceAll(' ', '%20')

	for (var i = 0; i < nameArtist.length; i++) {
		if(nameArtist[i]=='('){
			nameArtist = nameArtist.slice(0, i-1)
		}
	}
	
	nameArtist = nameArtist.replaceAll(' ', '%20')
	var response = await fetch(`https://api.spotify.com/v1/search?q=%20track:${nameTrack}%20&type=artist,track&market=ES`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
  		'Authorization': `Bearer ${localStorage.getItem('access_token')}`
		}
	}).then((response) => {
			if (response.ok) {/*console.info(response.json()) */return response.json()}
  		if (response.status == 401) {refreshToken()}
	}).then((tracks) => {
		  //console.info(tracks)
			let array = tracks.tracks.items
			for (var i = 0; i < array.length; i++) {
				if (array[i].artists[0].name.toUpperCase() == nameArtist.toUpperCase()) {
					//console.info(nameArtist, array[i].uri)
					localStorage.setItem('tracks_uris', array[i].uri)
					break
				}
			}
	})
}

async function createPlaylist(user_id){
	var response = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
		method: 'POST',
		headers: {
				'Content-Type': 'application/json',
  			'Authorization': `Bearer ${localStorage.getItem('access_token')}`
		},
		body: JSON.stringify({
			"name": "VK",
    	"description": "Musik from VK",
    	"public": false
		})
	}).then((response) => {
		if (response.ok) {
			console.info('playlist created')
			return response.json()
		}
		if (response.status == 401) {
			refreshToken()
		}
	}).then((playlist) => {
		console.info(playlist)
		localStorage.setItem('playlistId', playlist.id)
		return playlist
	}).catch((error) => console.error(error))
}

async function addTrack(tracks_uris, playlist_id) {
	setTimeout(3000)
	if (tracks_uris == null) 
		return null
	var response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
		method: 'POST',
		headers: {
				'Content-Type': 'application/json',
  			'Authorization': `Bearer ${localStorage.getItem('access_token')}`
		},
		body: JSON.stringify({
			"uris": [
        tracks_uris
    	]
		})

	}) 
	localStorage.removeItem('tracks_uris')
}

function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

// Константы, которые необходимо указать
const CLIENT_ID = '';
const REDIRECT_URI = 'http://192.168.2.32:3000';
const CLIENT_SECRET = '';

async function authorize() {
  var state = generateRandomString(16);
  var scope = 'playlist-read-private%20playlist-modify-private%20playlist-modify-public';

  var authorizeURL = 'https://accounts.spotify.com/authorize?' +
    'response_type=code' +
    '&client_id=' + encodeURIComponent(CLIENT_ID) +
    '&scope=' + scope +
    '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
    '&state=' + encodeURIComponent(state);
    
  window.location = authorizeURL;
}

async function getURLParams() {
  var urlParams = new URLSearchParams(window.location.search);
  var code = urlParams.get('code');
  var state = urlParams.get('state');
  /*if (code || state == false) {
  	console.info(code, state)
  	return null
  }*/

  var response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
  }).then((response) => {
    if (!response.ok) {
      console.info(response.status)
    }
    else{
      return response.json()
    }
  }).then((token) => {
  	localStorage.setItem('access_token', token.access_token);
  	localStorage.setItem('refresh_token', token.refresh_token);
    console.info(token.refresh_token, token.access_token);
    location.reload()
	});
}

async function refreshToken() {
	var response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
		},
		body: new URLSearchParams({
			'grant_type': 'refresh_token',
			'refresh_token': `${localStorage.getItem('refresh_token')}`
		})	
	}).then(response => {
		if (response.ok)
			return response.json()
	}).then(newToken => {
		console.info(newToken)
		localStorage.setItem('access_token', newToken.access_token)
		location.reload()
	}).catch(error => console.info(error))
}


// VK

async function authorizeVk() {
	var HOST = '192.168.2.32:3000'
	var VKid = document.getElementById('idvalue').value
	var list = await fetch(`http://${HOST}/VK/audio?id=${VKid}`, {method: 'GET'})
		.then(response => {
				if (response.ok) {
					//console.info(response.json())
					return response.json()
				}
				else{
					console.info('что то не работает')
					document.getElementById('title').innerText = 'Something went wrong, please try again later'
					document.getElementById('imgload').style.visibility = 'hidden'
				}
		}).then(list => {
			document.getElementById('form').style.visibility = 'hidden'
			document.getElementById('imgload').style.visibility = 'hidden'
			document.getElementById('title').innerText = 'Please stand by...'
			document.getElementById('myProgress').style.visibility = 'visible'
			var progressbar = document.getElementById("myBar")
			progressbar.style.visibility = "visible"
			var progressnum = document.getElementById("proc")
			progressnum.style.visibility = "visible"
			let diff = 0
			let diffpr = 0
			if (list.length/100 > 1) {
				diff = 1
				diffpr = Math.round(list.length/100)
			}

			else{
				diff = Math.round(1/(list.length/100))
				diffpr = 1
			}
			//console.info(list.length)
			/*list.forEach(async function(item, index, arr) {
				
					//console.info(item)
				 	findMusik(item.track, item.artist).then(track => {
						addTrack(localStorage.getItem('tracks_uris'), localStorage.getItem('playlistId'))
					})	
			})*/
			let index = 0
			let width = 0
			let timer = setInterval(()=>{
				findMusik(list[index].track, list[index].artist).then(track => {
					if (track) {
						addTrack(localStorage.getItem('tracks_uris'), localStorage.getItem('playlistId'))
					}
					else{
						artistFilter(list[index].track, list[index].artist).then(uri => {
							addTrack(localStorage.getItem('tracks_uris'), localStorage.getItem('playlistId'))
						})
					}
					index++
					width++
					if (index==list.length){
						clearInterval(timer)
						progressbar.style.width = '100%'
						progressnum.innerHTML = '100%'
					}
					else{
						if (index % diffpr == 0) {
							let progress = +progressbar.style.width.replace('%', '') + diff
							progressbar.style.width = progress + '%'
							if (progress < 100) {
								progressnum.innerHTML = progressbar.style.width
							}
						}
					}
				})	
			}, 2000)
		})
}
