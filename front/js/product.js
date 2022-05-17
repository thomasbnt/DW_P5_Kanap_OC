const baseUrl = 'http://localhost:3000/api/';
const productUrl = `${baseUrl}products`;
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/add
 */

// Sélectionne le contenu de l'item et affiche une erreur
// s'il n'y a pas de produit ou que l'API est indisponible
const errMessageInContent = document.querySelector('.item__content');

function addProductToCart(newProduct) {
  let totalProductsCart = JSON.parse(localStorage.getItem('totalProductsCart'));
  const productCartWithSameId = totalProductsCart?.find(({ id }) => id === newProduct.id);
  const productCartWithSameColor = totalProductsCart?.find(({ color }) => color === newProduct.color);

  // Vérifie si le produit est déjà dans le panier avec la même couleur
  if (productCartWithSameId && productCartWithSameColor) {
    console.log('Le produit avec ID et la même couleur est déjà dans le panier, suite ... ');

    // eslint-disable-next-line max-len
    // TODO : Reformater ces deux lignes pour qu'elles comprennent toute la condition de l'ajout d'un produit
    /* totalQuantityWithSameColor > 100 ? alert('Vous ne pouvez pas ajouter plus de 100 produits dans le panier') : null;
    totalQuantityWithSameColor <= 0 ? alert('Vous devez ajouter au moins 1 produit dans le panier') : null; */

    // Si le produit est déjà dans le panier, on ajoute la quantité à la quantité déjà présente
    productCartWithSameId.quantity = parseInt(productCartWithSameId.quantity, 10) + parseInt(newProduct.quantity, 10);
    // Modifier totalProductsCart avec les nouvelles données
    totalProductsCart = totalProductsCart.map((product) => {
      if ((productCartWithSameId.id === product.id) && (productCartWithSameColor.color === product.color)) {
        return productCartWithSameId;
      }
      return product;
    });
    // Modifier le localStorage avec les nouvelles données
    localStorage.setItem('totalProductsCart', JSON.stringify(totalProductsCart));
  } else {
    // Différentes fonctions pour ajouter/supprimer un produit au panier
    if (totalProductsCart === null) {
      // On ajoute le premier Item dans le panier
      totalProductsCart = [];
    }
    totalProductsCart.push(newProduct);
    localStorage.setItem('totalProductsCart', JSON.stringify(totalProductsCart));
    console.log('Le produit n\'est pas encore dans le panier ou il l\'est mais avec une autre couleur.');
  }
}

function addItem(id, name, quantity, color) {
  // Ajoute le produit au panier
  const productToAdd = {
    id, name, quantity: parseInt(quantity, 10), color,
  };
  addProductToCart(productToAdd);
}

fetch(productUrl).then((response) => response.json())
  .then((products) => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');

    const product = products.find(({ _id }) => _id === id);

    // On vérifie que l'id existe
    if (product === undefined) {
      errMessageInContent.innerHTML = '<h1>Le produit n\'existe pas ou la page a été supprimée.</h1>';
    }

    // Récupère les ID pour par la suite les afficher à sa bonne place
    const nameItem = document.querySelector('#title');
    const priceItem = document.querySelector('#price');
    const descriptionItem = document.querySelector('#description');

    // Afficher le nom, le prix et la description du produit
    nameItem.textContent = product.name;
    priceItem.textContent = product.price;
    descriptionItem.textContent = product.description;

    // Récupère la class de l'image pour afficher celle correspondante à l'ID du produit
    // Et ajout du src de l'image et du texte alternatif dans la balise img
    const imgItem = document.querySelector('.item__img');
    const imgProduct = document.createElement('img');
    imgProduct.src = product.imageUrl;
    imgProduct.alt = product.altTxt;
    imgItem.appendChild(imgProduct);

    // Ajouter toutes les couleurs disponibles pour ce produit
    const colorsItem = document.querySelector('#colors');
    for (product.color of product.colors) {
      const colorsProduct = document.createElement('option');
      colorsProduct.text = product.color;
      colorsProduct.value = product.color;
      colorsItem.add(colorsProduct);
    }

    // Le bouton 'Ajouter au panier'
    const addToCart = document.querySelector('#addToCart');
    addToCart.addEventListener('click', () => {
      // Récupère la quantité choisie par l'utilisateur
      // En vérifiant si c'est compris entre 1 et 100 et non vide
      const quantityItem = document.querySelector('#quantity');
      const quantity = quantityItem.value;
      const color = colorsItem.value;

      if (colorsItem.value !== '') {
        if ((quantityItem.value >= 1) && (quantityItem.value <= 100)) {
          // eslint-disable-next-line no-underscore-dangle
          addItem(product._id, product.name, quantity, color);
        } else {
          alert('S\'il vous plait, entrez une quantité valide entre 1 et 100');
        }
      } else {
        alert('S\'il vous plait, entrez une couleur');
      }
    });
  }).catch(() => {
    errMessageInContent.innerHTML = '<h1>Erreur 503</h1><p>Impossible de récupérer les articles depuis l\'API.</p>';
  });
