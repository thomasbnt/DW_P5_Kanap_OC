const baseUrl = 'http://localhost:3000/api/products';
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/add
 */

// Sélectionne le contenu de l'item et affiche une erreur
// s'il n'y a pas de produit ou que l'API est indisponible
const errMessageInContent = document.querySelector('.item__content');

// Ajout/supp depuis la value input du produit côté HTML
function addProductToCart(newProduct) {
  // Récupère le panier dans le localStorage
  let totalProductsCart = JSON.parse(localStorage.getItem('totalProductsCart'));
  const productCartWithSameId = totalProductsCart?.find(({ id }) => id === newProduct.id);
  // eslint-disable-next-line max-len
  const productCartWithSameColor = totalProductsCart?.find(({ color }) => color === newProduct.color);

  // Vérifie si le produit est déjà dans le panier avec la même couleur
  if (productCartWithSameId && productCartWithSameColor) {
    // boucle pour ajouter la quantité du produit si la couleur et l'id sont identiques
    // eslint-disable-next-line no-restricted-syntax
    for (const [index, product] of totalProductsCart.entries()) {
      if ((product.color === newProduct.color) && (product.id === newProduct.id)) {
        // On vérifie si la quantité n'est pas supérieure à 100 et inférieure à 0
        if (productCartWithSameId.quantity < 100 && productCartWithSameId.quantity > 0) {
          // On va insérer dans la bonne couleur le produit qu'on choisit
          if (totalProductsCart[index].color === productCartWithSameColor.color) {
            // On vérifie si le total ne dépasse pas 100 quantités,
            // sinon dans ce cas-là, on retourne 100.
            if ((productCartWithSameColor.quantity + newProduct.quantity) > 100) {
              totalProductsCart[index].quantity = 100;
            } else {
              // On additionne la quantité du produit déjà dans le panier avec la nouvelle quantité
              // eslint-disable-next-line max-len
              totalProductsCart[index].quantity = productCartWithSameColor.quantity + newProduct.quantity;
            }
          }
        }
      }
    }
    // Modifier le localStorage avec les nouvelles données
    localStorage.setItem('totalProductsCart', JSON.stringify(totalProductsCart));
  } else {
    // Différentes fonctions pour ajouter/supprimer un produit au panier
    if (totalProductsCart === null) {
      // On ajoute le premier Item dans le panier
      totalProductsCart = [];
    }
    // Si le produit est déjà dans le panier, mais que la couleur n'est pas encore présente,
    // On ajoute dans un nouveau array le produit et sa quantité avec la couleur

    totalProductsCart.push(newProduct);
    localStorage.setItem('totalProductsCart', JSON.stringify(totalProductsCart));
  }
}

// Ajout d'un produit au panier
function addItem(id, quantity, color) {
  // Créer un nouvel objet avec les données du produit
  const productToAdd = {
    id,
    quantity: parseInt(quantity, 10),
    color,
  };
  // Ajoute le produit au panier
  addProductToCart(productToAdd);
}

// On récupère le produit et on vérifie s'il existe avec son ID dans un premier temps
fetch(baseUrl)
  .then((response) => response.json())
  .then((products) => {
    // Sélectionne le contenu de la page avec searchParams avec l'id du produit
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
    // eslint-disable-next-line no-restricted-syntax
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
      const quantityItem = document.querySelector('#quantity');
      const quantity = quantityItem.value;
      const color = colorsItem.value;

      // En vérifiant si c'est compris entre 1 et 100 et non vide
      if (colorsItem.value !== '') {
        if ((quantityItem.value >= 1) && (quantityItem.value <= 100)) {
          // eslint-disable-next-line no-underscore-dangle
          addItem(product._id, quantity, color);
        } else {
          alert('S\'il vous plait, entrez une quantité valide entre 1 et 100');
        }
      } else {
        alert('S\'il vous plait, entrez une couleur');
      }
    });
  }).catch((err) => {
    if (err.message === 'Failed to fetch') {
      errMessageInContent.innerHTML = '<h1>Erreur 503</h1><p>Impossible de récupérer les articles depuis l\'API.</p>';
    } else {
      errMessageInContent.innerHTML = '<h1>Erreur 404</h1><p>Le produit n\'existe pas ou la page a été supprimée.</p>';
    }
  });
