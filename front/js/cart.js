const baseUrl = 'http://localhost:3000/api/';
const productUrl = `${baseUrl}products`;
const orderUrl = `${baseUrl}products/order`;

// Récupère le localstorage
const allProducts = JSON.parse(localStorage.getItem('totalProductsCart'));

// Obtenir tous les produits qui se trouvent dans le LS et l'afficher dans la commande
async function getAllProducts() {
  // Si le localstorage est vide, on retourne un message disant que le panier est vide.
  if (allProducts === null) {
    const noProductsMessage = document.querySelector('#cart__items');
    noProductsMessage.innerHTML = '<h2>Votre panier est vide</h2>';
    const disableButton = document.querySelector('#order');
    // Désactive le bouton d'envoi de la commande
    disableButton.disabled = true;
    // Mets le curseur en mode not-allowed sur le bouton de commande
    disableButton.style.cssText = 'cursor: not-allowed';
    // Ajoute les valeurs 0 pour la quantité et pour le prix total
    document.querySelector('#totalQuantity').innerHTML = '0';
    document.querySelector('#totalPrice').innerHTML = '0';
  }

  // On vérifie si le LS n'est pas vide pour éviter les erreurs
  if (allProducts) {
    // Si le localstorage n'est pas vide, on retourne toutes les données du localstorage
    // avec une boucle et un createElement
    allProducts.map(async (product) => {
      const response = await fetch(`${productUrl}/${product.id}`);
      if (response.ok) {
        // On récupère depuis l'API les données de chaque produit
        const responseData = await response.json();
        const productContainer = document.createElement('article');
        productContainer.classList.add('cart__item');
        productContainer.setAttribute('data-id', product.id);
        productContainer.setAttribute('data-color', product.color);
        productContainer.innerHTML = `
            <div class='cart__item__img'>
              <img src='${responseData.imageUrl}' alt='${responseData.altTxt}'>
            </div>
            <div class='cart__item__content'>
              <div class='cart__item__content__description'>
                <h2>${responseData.name}</h2>
                <p>${product.color}</p>
                <p>${product.quantity * responseData.price} €</p>
              </div>
              <div class='cart__item__content__settings'>
                <div class='cart__item__content__settings__quantity'>
                  <p>Qté : </p>
                  <input type='number' class='itemQuantity' name='itemQuantity' min='1' max='100' value='${product.quantity}'>
                </div>
                <div class='cart__item__content__settings__delete'>
                  <p class='deleteItem'>Supprimer</p>
                </div>
              </div>
            </div>
      `;
        // Ajoute la div créée au DOM
        document.querySelector('#cart__items').appendChild(productContainer);
      }
    });
  }
}

// Obtenir le total des quantités de la commande
function getAllQuantity() {
  const totalQuantity = document.querySelector('#totalQuantity');
  // On vérifie si le LS est vide
  if (!allProducts) {
    totalQuantity.innerHTML = '0';
  }
  // Si ce n'est pas le cas, alors on calcule le total des quantités
  if (allProducts) {
    // Additionne toutes les quantités de chaque produit dans calculTotalQuantity
    totalQuantity.innerHTML = allProducts.reduce((acc, cur) => acc + cur.quantity, 0);
  }
}

// On récupère tous les éléments de la page par leur ID
const btnSubmit = document.getElementById('order');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');
const errorFirstName = document.getElementById('firstNameErrorMsg');
const errorLastName = document.getElementById('lastNameErrorMsg');
const errorAddress = document.getElementById('addressErrorMsg');
const errorCity = document.getElementById('cityErrorMsg');
const errorEmail = document.getElementById('emailErrorMsg');

// On déclare les regex pour le nom, l'email et l'adresse postale
const textRegex = /^[A-Za-z]+$/;
const emailRegex = /^\S+@\S+\.\S+$/;
const addressRegex = /^[A-Za-z0-9 ]{3,30}$/;

function checkFirstName() {
  // On vérifie si le champ est rempli et si c'est valide pour le prénom
  function errFirstName() {
    errorFirstName.innerHTML = 'Veuillez renseigner votre prénom';
    firstName.style.border = '1px solid red';
  }

  if (firstName.value === '') {
    errFirstName();
    return false;
  }
  if (!textRegex.test(firstName.value)) {
    errFirstName();
    return false;
  }
  errorFirstName.innerHTML = '';
  firstName.style.border = '1px solid green';
  return true;
}

function checkLastName() {
  // On vérifie si le champ est rempli et si c'est valide pour le nom
  function errLastName() {
    errorLastName.innerHTML = 'Veuillez renseigner votre nom';
    lastName.style.border = '1px solid red';
  }

  if (lastName.value === '') {
    errLastName();
    return false;
  }
  if (!textRegex.test(lastName.value)) {
    errLastName();
    return false;
  }
  errorLastName.innerHTML = '';
  lastName.style.border = '1px solid green';
  return true;
}

function checkAddress() {
  // On vérifie si le champ est rempli et si c'est valide pour l'adresse postale
  function errAddress() {
    errorAddress.innerHTML = 'Veuillez renseigner votre adresse postale';
    address.style.border = '1px solid red';
  }

  if (address.value === '') {
    errAddress();
    return false;
  }
  if (!addressRegex.test(address.value)) {
    errAddress();
    return false;
  }
  errorAddress.innerHTML = '';
  address.style.border = '1px solid green';
  return true;
}

function checkCity() {
  // On vérifie si le champ est rempli et si c'est valide pour la ville
  function errCity() {
    errorCity.innerHTML = 'Veuillez renseigner votre ville';
    city.style.border = '1px solid red';
  }

  if (city.value === '') {
    errCity();
    return false;
  }
  if (!textRegex.test(city.value)) {
    errCity();
    return false;
  }
  errorCity.innerHTML = '';
  city.style.border = '1px solid green';
  return true;
}

function checkEmail() {
  // On vérifie si le champ est rempli et si c'est valide pour l'email
  function errEmail() {
    errorEmail.innerHTML = 'Veuillez renseigner votre email';
    email.style.border = '1px solid red';
  }

  if (email.value === '') {
    errEmail();
    return false;
  }
  if (!emailRegex.test(email.value)) {
    errEmail();
    return false;
  }
  errorEmail.innerHTML = '';
  email.style.border = '1px solid green';
  return true;
}

function order() {
  // On déclare le client dans un tableau pour ensuite l'envoyer sur l'API order
  const client = {
    firstName: document.querySelector('#firstName').value,
    lastName: document.querySelector('#lastName').value,
    email: document.querySelector('#email').value,
    address: document.querySelector('#address').value,
    city: document.querySelector('#city').value,
  };
  // On fait une requête POST pour envoyer le client et les produits commandés
  fetch(`${orderUrl}`, {
    method: 'POST',
    body: JSON.stringify(client),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
    .then((response) => response.json())
    .then((value) => {
      alert('Votre commande a bien été prise en compte');
      localStorage.clear();
      console.log(value);
      window.location.href = `../html/confirmation.html?id=${value.orderId}`;
    })
    .catch((error) => alert(error));
}

// Quand on clique sur le bouton 'commander'
btnSubmit.addEventListener('click', () => {
  const isValidFirstName = checkFirstName();
  const isValidLastName = checkLastName();
  const isValidAddress = checkAddress();
  const isValidCity = checkCity();
  const isValidEmail = checkEmail();

  if (isValidFirstName && isValidLastName && isValidAddress && isValidCity && isValidEmail) {
    order();
  }
});

getAllProducts();
getAllQuantity();
