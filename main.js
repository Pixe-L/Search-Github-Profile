// OBTENER EL FORMULARIO
const form = document.getElementById('form');

// OBTENER LA BARRA DE BÚSQUEDA
const search = document.getElementById('search');

// OBTENER LA INFO DEL USUARIO
const infoCard = document.getElementById('information');

// ESCUCHAR EL EVENTO SUBMIT DEL FORM
form.addEventListener('submit', (evt) => {
 evt.preventDefault();
 const username = search.value;
 getUserData(username);
 search.value = '';
});

// OBTENER LA INFORMACIÓN DEL USUARIO EN GITHUB
async function getUserData(username) {
 const API = 'https://api.github.com/users/';

 try {
  const userRequest = await fetch(`${API}${username}`);

  if (!userRequest.ok) {
   throw new Error(userRequest.status);
  }

  const userData = await userRequest.json();

  if (userData.public_repos) {
   const reposRequest = await fetch(`${API}${username}${'/repos'}`);
   const reposData = await reposRequest.json();
   userData.repos = reposData;
  }

  showUserData(userData);
 } catch (error) {
  showError(error.message);
 }
}

// FUNCIÓN PARA INTERACTUAR CON HTML CON EL WIDGET
function showUserData(userData) {
 let userContent = `
    <img class="avatar" src="${userData.avatar_url}" alt="Icono del avatar del perfil" />
    <h1 class="title">${userData.name}</h1>
    <p class="description">${userData.bio}</p>

    <section class="data">
     <ul>
      <li>followers: ${userData.followers}</li>
      <li>following: ${userData.following}</li>
      <li>Repos: ${userData.public_repos}</li>
     </ul>
    </section>
 `;

 if (userData.repos) {
  userContent += `<section class="repos">`;
  userData.repos.slice(0, 7).forEach((repo) => {
   userContent += `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
  });
  userContent += `</section>`;
 }

 infoCard.innerHTML = userContent;
}

// FUNCIÓN PARA GESTIONAR ERRORES
function showError(error) {
 const errorContent = `<h1 align="center">Error ❌ ${error}</h1>`;
 infoCard.innerHTML = errorContent;
}
