const base_url = 'http://localhost:3000/api/';
const product_url = base_url + 'products';

const cart_list = document.querySelector('.item');

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/add
 */

fetch(product_url).then(response => response.json())
  .then(products => {
    let url = new URL(window.location.href);
    let id = url.searchParams.get('id');

    let product = products.find(({ _id }) => _id === id);
    //console.table(product);

    // On vérifie que l'id existe
    if (product === undefined) {
      const ErrMessageInContent = document.querySelector('.item__content');
      ErrMessageInContent.innerHTML = '<h1>Le produit n\'existe pas ou la page a été supprimée.</h1>';
    }

    // Récupère les ID pour par la suite les afficher à sa bonne place
    const name_item = document.querySelector('#title');
    const price_item = document.querySelector('#price');
    const description_item = document.querySelector('#description');

    // Afficher le nom, le prix et la description du produit
    name_item.textContent = product.name;
    price_item.textContent = product.price;
    description_item.textContent = product.description;

    // Récupère la class de l'image pour afficher celle correspondante à l'ID du produit
    // Et ajout du src de l'image et du texte alternatif dans la balise img
    const img_item = document.querySelector('.item__img');
    const img_product = document.createElement('img');
    img_product.src = product.imageUrl;
    img_product.alt = product.altTxt;
    img_item.appendChild(img_product);

    // Ajouter toutes les couleurs disponibles pour ce produit
    const colors_item = document.querySelector('#colors');
    for (product.color of product.colors) {
      let colors_product = document.createElement('option');
      colors_product.text = product.color;
      colors_product.value = product.color;
      colors_item.add(colors_product);
    }

    // Différentes fonctions pour ajouter/supprimer un produit au panier
    function CheckIfCartIsEmpty(product) {
      let TotalProductsCart = JSON.parse(localStorage.getItem('TotalProductsCart'));
      // On initie le panier dans le localStorage s'il est vide
      if (TotalProductsCart === null) {
        // On ajoute le premier Item dans le panier
        TotalProductsCart = [];
      }
      TotalProductsCart.push(product);
      localStorage.setItem('TotalProductsCart', JSON.stringify(TotalProductsCart));
    }

    function AddItem(id, name, quantity, color) {
      // Ajoute le produit au panier
      let ComposeItemCart = {
        id: id,
        name: name,
        quantity: quantity,
        color: color
      };
      CheckIfCartIsEmpty(ComposeItemCart);
    }

    // Le bouton 'Ajouter au panier'
    const addToCart = document.querySelector('#addToCart');
    addToCart.addEventListener('click', (key, value) => {

      // Récupère la quantité choisie par l'utilisateur
      // En vérifiant si c'est compris entre 1 et 100 et non vide
      const quantity_item = document.querySelector('#quantity');
      let quantity = quantity_item.value;
      let color = colors_item.value;

      if (colors_item.value !== '') {
        if ((quantity_item.value >= 1) && (quantity_item.value <= 100)) {
          AddItem(product._id, product.name, quantity, color);
        } else {
          alert('S\'il vous plait, entrez une quantité valide entre 1 et 100');
        }
      } else {
        alert('S\'il vous plait, entrez une couleur');
      }
    });
  });
