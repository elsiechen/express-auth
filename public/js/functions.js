// function parseJwt (token) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));
 
//    return JSON.parse(jsonPayload);
// };

// function handleCallback(response) {
//   const data = parseJwt(response.credential);
//   console.log(data);
//   // send data to server for verification
//   const url = "/user/login/google";
  
//   axios.post(url , {data})
//     .then(res => console.log('Send token to backend successfully.'))
//     .catch(err => console.error('Failed to send token to server.'))
//   }

function handleCredentialResponse(response) {
  console.log(response);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/user/login/google", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(response));
}

// contents of response parameter
// {
//   clientId: ''
//   client_id: '',
//   credential: ''
//   select_by: 'btn'
// }