const login = document.getElementById('login');
const logout = document.getElementById('logout');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const btnRegister = document.getElementById('btnRegister')
const btnLogin = document.getElementById('btnLogin')
const btnLogout = document.getElementById('btnLogout')
const btnFacebook = document.getElementById('btnFacebook');
const btnGoogle = document.getElementById('btnGoogle');
const bd = document.getElementById('bd');
const btnSave = document.getElementById('btnSave');
const post = document.getElementById('post');
const posts = document.getElementById('posts');

window.onload = () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('User is signed in.');
      login.classList.add("hiden");
      bd.classList.remove("hiden");
      posts.classList.remove("hiden");
      logout.classList.remove("hiden");
      username.innerHTML = `Bienvenida ${user.displayName}`;
    } else {
      console.log('No user is signed in.');
      login.classList.remove("hiden");
      logout.classList.add("hiden");
      posts.classList.add("hiden");
      bd.classList.add("hiden")
    }
  });
}




function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}


function writeNewPost(uid, body) {
  // A post entry.
  var postData = {
    uid: uid,
    body: body,
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}

btnSave.addEventListener('click', () => {
  var userId = firebase.auth().currentUser.uid;
  writeNewPost(userId, post.value );

  var btnUpdate = document.createElement("input");
  btnUpdate.setAttribute("value", "Update");
  btnUpdate.setAttribute("type", "button");
  var btnDelete = document.createElement("input");
  btnDelete.setAttribute("value", "Delete");
  btnDelete.setAttribute("type", "button");
  var contPost = document.createElement('div');

  contPost.innerHTML = `<textarea name="Publicacòn" id="post" cols="30" rows="10">${post.value}</textarea>`;

  contPost.appendChild(btnUpdate );
  contPost.appendChild(btnDelete);
  posts.appendChild(contPost);
})

btnRegister.addEventListener('click', () => {
  firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
  .then(() => {
    console.log('Usuario Creado');
  })
  .catch(function(error) {
    console.log(error.code ,' : ' , error.message);
  });
})


btnLogin.addEventListener('click', () => {
  firebase.auth().signInWithEmailAndPassword(email.value, password.value)
  .then (() => {
    console.log('Verificado')
  })
  .catch(function(error) {
    console.log('Contraseña Incorrecta')
  });
})

btnLogout.addEventListener('click', () => {
  firebase.auth().signOut().then(function() {
    console.log('Cerro Sesión');
  }).catch(function(error) {
    console.log('Error al cerrar Sesión');
  });
})

btnFacebook.addEventListener('click', () => {
  var provider = new firebase.auth.FacebookAuthProvider();
  provider.setCustomParameters({
    'display' : 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then(function(result) { console.log('Logueado con Fb')})
    .catch(function(error) {
      console.log(error.code);
      console.log(error.message);
      console.log(error.email);
      console.log(error.credential);
  });
})

btnGoogle.addEventListener('click',() => {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then(function(result) {
      console.log('Login Google');
      var user = result.user;
      writeUserData(user.uid, user.displayName, user.email, user.photoURL);
     })
    .catch(function(error) {
      console.log(error.code);
      console.log(error.message);
      console.log(error.email);
      console.log(error.credential);
  });
});