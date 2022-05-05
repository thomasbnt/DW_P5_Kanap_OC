const base_url = 'http://localhost:3000/api/';
const product_url = base_url + 'products';

const product_list = document.querySelector('#items')

fetch(product_url)
    .then(response => response.json())
    .then(data => {
        console.table(data);
        for (let d of data) {
            let product = document.createElement('a');
            product.href = `./product.html?id=${d._id}`
            product.innerHTML = `
            <article>
              <img src="${d.imageUrl}" alt="${d.altTxt}">
              <h3 class="productName">${d.name}</h3>
              <p class="productDescription">${d.description}</p>
            </article>
            `;
            product_list.appendChild(product);
            console.log(d);
        }

    });

