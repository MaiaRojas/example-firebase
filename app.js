const login = document.getElementById('login');
const logout = document.getElementById('logout');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const btnRegister = document.getElementById('btnRegister')
const btnLogin = document.getElementById('btnLogin')
const btnLogout = document.getElementById('btnLogout')


window.onload = () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('User is signed in.')
    } else {
      console.log('No user is signed in.')
    }
    console.log('User' + JSON.stringify(user))
  });
}
btnRegister.addEventListener('click', () => {
  firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
  .then(() => {
    console.log('Usuario Creado');
    login.classList.add("hiden");
    logout.classList.remove("hiden");
    username.innerHTML = ' Hola Claudia';

  })
  .catch(function(error) {
    console.log(error.code ,' : ' , error.message);
  });
})


btnLogin.addEventListener('click', () => {
  firebase.auth().signInWithEmailAndPassword(email.value, password.value)
  .then (() => {
    console.log('Verificado')
    login.classList.add("hiden");
    logout.classList.remove("hiden");

    var user = firebase.auth().currentUser;

    username.innerHTML = user.email;
  })
  .catch(function(error) {
    console.log('Contraseña Incorrecta')
  });
})

btnLogout.addEventListener('click', () => {
  firebase.auth().signOut().then(function() {
    console.log('Cerro Sesión');
    login.classList.remove("hiden");
    logout.classList.add("hiden");
  }).catch(function(error) {
    console.log('Error al cerrar Sesión');
  });
})
