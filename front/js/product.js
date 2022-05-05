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
        console.log(url)
        let id = url.searchParams.get('id');
        console.log(`ID: ${id}`);

        let h = data.find(product => product._id === id);
        console.table(h);

        if (h._id === id) {
            const name_item = document.querySelector('#title');
            const price_item = document.querySelector('#price');
            const description_item = document.querySelector('#description');

            const img_item = document.querySelector('.item__img');
            const img_product = document.createElement('img');
            img_product.src = h.imageUrl;
            img_product.alt = h.altTxt;
            img_item.appendChild(img_product);

            const colors_item = document.querySelector('#colors');
            for (h.color of h.colors) {
                let colors_product = document.createElement('option');
                colors_product.text = h.color;
                colors_product.value = h.color;
                colors_item.add(colors_product);
            }

            name_item.innerHTML = h.name;
            price_item.innerHTML = h.price;
            description_item.innerHTML = h.description;

            const addToCart = document.querySelector('#addToCart');
            addToCart.addEventListener('click', () => {

                const quantity_item = document.querySelector('#quantity');
                if (colors_item.value !== '') {
                    if ((quantity_item.value >= 1) && (quantity_item.value <= 100)) {
                        let quantity = quantity_item.value;
                        let color = colors_item.value;
                        const TotalQuantityItem = [{
                            name: h.name,
                            quantity: quantity,
                            color: color,
                        }]
                        const x = JSON.stringify(TotalQuantityItem);
                        console.table(x)
                    } else {
                        console.log(quantity_item.value);
                        alert('S\'il vous plait, entrez une quantité valide entre 1 et 100');
                    }
                } else {
                    alert('S\'il vous plait, entrez une couleur');
                }

                /*localStorage.setItem(h._id, x);*/
            })








        }
    });
