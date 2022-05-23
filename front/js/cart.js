const baseUrl = 'http://localhost:3000/api/';
const productUrl = `${baseUrl}products`;

// Récupère le localstorage
const allProducts = JSON.parse(localStorage.getItem('totalProductsCart'));

// Obtenir le prix total pour chaque produit comprenant la quantité
async function getTotalPrice(product) {
  const response = await fetch(`${productUrl}/${product.id}`);
  if (response.ok) {
    const responseData = await response.json();
    return responseData.price * product.quantity;
  }
  return 0;
}

// Obtenir tous les produits qui se trouvent dans le LS et l'afficher dans la commande
async function getAllProducts() {
  // Si le localstorage est vide, on retourne un message d'erreur
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
  if (allProducts !== null) {
    // eslint-disable-next-line no-restricted-syntax
    for (const product of allProducts) {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(`${productUrl}/${product.id}`);
      if (response.ok) {
        // On récupère depuis l'API les données de chaque produit
        // eslint-disable-next-line no-await-in-loop
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
                <h2>${product.name}</h2>
                <p>${product.color}</p>
                <p>${await getTotalPrice(product)} €</p>
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
      } else {
        console.log('Erreur de récupération des données du produit');
      }
    }
  }
}

// Obtenir le prix total de la commande
async function getAllQuantity() {
  const totalProductsCart = JSON.parse(localStorage.getItem('totalProductsCart'));
  // eslint-disable-next-line no-restricted-syntax
  for (const [index, product] of totalProductsCart.entries()) {
    console.log(product.quantity);
    const x = [];
    x.push(product.quantity);
    console.log(x);


  }
  const totalQuantity = document.querySelector('#totalQuantity');
  totalQuantity.innerHTML = 'oui';
}

getAllProducts();
getAllQuantity();
