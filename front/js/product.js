const base_url = 'http://localhost:3000/api/';
const product_url = base_url + 'products';

const cart_list = document.querySelector('.item');

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/add
 */

fetch(product_url).then(response => response.json())
    .then(data => {
        let url = new URL(window.location.href);
        let id = url.searchParams.get('id');
        console.log(`ID: ${id}`);

        let h = data.find(product => product._id === id);
        console.table(h);

        // On vérifie que l'id existe
        h === undefined ? alert('Le produit n\'existe pas ou la page a été supprimée.') : null;

        // Récupère les ID pour par la suite les afficher à sa bonne place
        const name_item = document.querySelector('#title');
        const price_item = document.querySelector('#price');
        const description_item = document.querySelector('#description');

        // Afficher le nom, le prix et la description du produit
        name_item.textContent = h.name;
        price_item.textContent = h.price;
        description_item.textContent = h.description;

        // Récupère la class de l'image pour afficher celle correspondante à l'ID du produit
        // Et ajout du src de l'image et du texte alternatif dans la balise img
        const img_item = document.querySelector('.item__img');
        const img_product = document.createElement('img');
        img_product.src = h.imageUrl;
        img_product.alt = h.altTxt;
        img_item.appendChild(img_product);

        // Ajouter toutes les couleurs disponibles pour ce produit
        const colors_item = document.querySelector('#colors');
        for (h.color of h.colors) {
            let colors_product = document.createElement('option');
            colors_product.text = h.color;
            colors_product.value = h.color;
            colors_item.add(colors_product);
        }

        // Le bouton 'Ajouter au panier'
        const addToCart = document.querySelector('#addToCart');
        addToCart.addEventListener('click', () => {

            // Récupère la quantité choisie par l'utilisateur
            // En vérifiant si c'est compris entre 1 et 100 et non vide
            const quantity_item = document.querySelector('#quantity');
            if (colors_item.value !== '') {
                if ((quantity_item.value >= 1) && (quantity_item.value <= 100)) {
                    let quantity = quantity_item.value;
                    let color = colors_item.value;
                    // On enregistre le produit et son composant comme le nombre et la couleur
                    const ComposeQuantityItem = [{
                        name: h.name,
                        quantity: quantity,
                        color: color,
                    }]
                    const OrderQuantityItem = JSON.stringify(ComposeQuantityItem);
                    console.table(OrderQuantityItem)
                    // On l'enregistre dans le localStorage
                    localStorage.setItem('OrderQuantityItem', OrderQuantityItem);
                } else {
                    console.log(quantity_item.value);
                    alert('S\'il vous plait, entrez une quantité valide entre 1 et 100');
                }
            } else {
                alert('S\'il vous plait, entrez une couleur');
            }


        })

    });
