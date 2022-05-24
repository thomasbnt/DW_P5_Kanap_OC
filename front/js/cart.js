const baseUrl = 'http://localhost:3000/api/';
const productUrl = `${baseUrl}products`;

// Récupère le localstorage
const allProducts = JSON.parse(localStorage.getItem('totalProductsCart'));

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

// Obtenir le prix total de la commande
function getAllQuantity() {
  const totalProductsCart = JSON.parse(localStorage.getItem('totalProductsCart'));
  // Additionne toutes les quantités de chaque produit dans calculTotalQuantity
  const calculateTotalQuantity = totalProductsCart.reduce((acc, cur) => acc + cur.quantity, 0);
  // TODO : Faire un total de tous les prix de chaque produit dans calculTotalPrice
  //const calculateTotalPrice = totalProductsCart.reduce((acc, cur) => acc + cur.price, 0);
  //console.log({ calculateTotalPrice });

  const totalQuantity = document.querySelector('#totalQuantity');
  totalQuantity.innerHTML = calculateTotalQuantity;
}

getAllProducts();
getAllQuantity();
