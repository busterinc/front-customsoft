// stores/app/api.js
const API_URL = 'http://localhost:8080/api'
const SUPER_USER_EMAIL = 'invitado@gmail.com'
const SUPER_USER_PASS = 'Invitado+123'

export async function TestApi () {
    // Lógica para llamar a la API y obtener los datos
    console.log('API_URL ++++++++++++++++++++++',  API_URL)
    return  API_URL
}

export async function GetTokenApi () {
	console.log('API_URL ++++++++++++++++++++++',  API_URL)
    const resp = await fetch(`${API_URL}/token`, {
      method: 'POST',
      body: JSON.stringify({
        email: SUPER_USER_EMAIL,
        password: SUPER_USER_PASS,
        returnSecureToken: true
      }),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())

    console.log ('resp ++++++++++++++++++++++++++++++++++', resp)
    return resp
}

export async function UpFileApi (file, token, id) {
	console.log('UpFileApi ~~~~~~~~~~~~~~~~~~~~~', file, token, id);
    try {
        const formdata = new FormData();
        formdata.append("author", id);
        formdata.append("file", file);

        const requestOptions = {
            method: "POST",
            body: formdata,
            headers: {
                Authorization: `${token}`
            },
            redirect: "follow"
        };

        const resp = await fetch(`${API_URL}/upload`, requestOptions);
        console.log('resp:', resp);
        const data = await resp.text();
        console.log('data:', data);
        return data;
    } catch (e) {
        console.error('ERROR:', e);
        return e;
    }	
}
  
export async function GetSignInApi (token, email, pass) {
	console.log('GetSignInApi >>>>>>>>>>>>>>>',  token, email, pass)
    const resp = await fetch(`${API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: pass
      }),
      headers: { 'Content-Type': 'application/json', 'Authorization': token }
    }).then(res => res.json())

    console.log ('resp >>>>>>>>>>>>>>>', resp)
    return resp	
}


export async function GetDocsApi (token, id) {
	console.log('GetDocsApi zzzzzzzzzzzzzzzzzzzzzzzzz',  token, id)
  const resp = await fetch(`${API_URL}/documents?profileId=${id}`, {
    method: 'GET',
    headers: { 'Authorization': token }
  }).then(res => res.json())

  console.log ('resp zzzzzzzzzzzzzzzzzzzzzzzzz', resp)
  return resp	
}
