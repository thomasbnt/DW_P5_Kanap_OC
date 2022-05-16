const base_url = 'http://localhost:3000/api/';
const product_url = base_url + 'products';

const product_list = document.querySelector('#items');

fetch(product_url)
  .then((response) => response.json())
  .then((data) => {
    for (let d of data) {
      let product = document.createElement('a');
      product.href = `./product.html?id=${d._id}`;
      product.innerHTML = `
            <article>
              <img src='${d.imageUrl}' alt='${d.altTxt}'>
              <h3 class='productName'>${d.name}</h3>
              <p class='productDescription'>${d.description}</p>
            </article>
            `;
      product_list.appendChild(product);
    }
  }).catch((err) => {
// Sélectionne le contenu de l'item et affiche une erreur s'il n'y a pas de produit ou que l'API est indisponible
  const ErrMessageInContent = document.querySelector('.titles');
  console.log(ErrMessageInContent);
  ErrMessageInContent.innerHTML = `<h1>Erreur 503</h1><h2>Impossible de récupérer les articles depuis l\'API.</h2>`;
});

