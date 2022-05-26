const baseUrl = 'http://localhost:3000/api/';
const productUrl = `${baseUrl}products`;

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

// Obtenir le total des quantités de la commande
function getAllQuantity() {
  // Additionne toutes les quantités de chaque produit dans calculTotalQuantity
  const calculateTotalQuantity = allProducts.reduce((acc, cur) => acc + cur.quantity, 0);
  const totalQuantity = document.querySelector('#totalQuantity');
  totalQuantity.innerHTML = calculateTotalQuantity;
}

function order() {

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
const textRegex = /^[A-Z][A-Za-z]+$/;
const emailRegex = /^\S+@\S+\.\S+$/;
const addressRegex = /^[0-9]{1,3} [A-Za-z]{1,20} [0-9]{1,3}$/;

// Quand on clique sur le bouton 'commander'
btnSubmit.addEventListener('click', () => {
  // On vérifie si le champ est rempli et si c'est valide pour le prénom
  if ((firstName.value === '') || (!textRegex.test(firstName.value))) {
    errorFirstName.innerHTML = 'Veuillez renseigner votre prénom';
    firstName.style.border = '1px solid red';
  } else {
    errorFirstName.innerHTML = '';
    firstName.style.border = '1px solid green';
  }
  // On vérifie si le champ est rempli et si c'est valide pour le nom
  if ((lastName.value === '') || (!textRegex.test(lastName.value))) {
    errorLastName.innerHTML = 'Veuillez renseigner votre nom';
    lastName.style.border = '1px solid red';
  } else {
    errorLastName.innerHTML = '';
    lastName.style.border = '1px solid green';
  }
  // On vérifie si le champ est rempli et si c'est valide pour l'adresse postale
  if ((address.value === '') || (!addressRegex.test(address.value))) {
    errorAddress.innerHTML = 'Veuillez renseigner votre adresse postale';
    address.style.border = '1px solid red';
  } else {
    errorAddress.innerHTML = '';
    address.style.border = '1px solid green';
  }
  // On vérifie si le champ est rempli et si c'est valide pour la ville
  if ((city.value === '') || (!textRegex.test(city.value))) {
    errorCity.innerHTML = 'Veuillez renseigner votre ville';
    city.style.border = '1px solid red';
  } else {
    errorCity.innerHTML = '';
    city.style.border = '1px solid green';
  }
  // On vérifie si le champ est rempli et si c'est valide pour l'email
  if ((email.value === '') || (!emailRegex.test(email.value))) {
    errorEmail.innerHTML = 'Veuillez renseigner votre email';
    email.style.border = '1px solid red';
  } else {
    errorEmail.innerHTML = '';
    email.style.border = '1px solid green';
  }
});

getAllProducts();
getAllQuantity();
