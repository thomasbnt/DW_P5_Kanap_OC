const baseUrl = 'http://localhost:3000/api/';
const productUrl = `${baseUrl}products`;
const productList = document.querySelector('#items');

// On récupère les données du produit depuis l'API
fetch(productUrl)
  .then((response) => response.json())
  .then((data) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const d of data) {
      // On crée un nouvel élément HTML avec la balise <a>
      const product = document.createElement('a');
      // eslint-disable-next-line no-underscore-dangle
      product.href = `./product.html?id=${d._id}`;
      product.innerHTML = `
            <article>
              <img src='${d.imageUrl}' alt='${d.altTxt}'>
              <h3 class='productName'>${d.name}</h3>
              <p class='productDescription'>${d.description}</p>
            </article>
            `;
      productList.appendChild(product);
    }
  }).catch(() => {
  // Sélectionne le contenu de l'item et affiche une erreur
  // s'il n'y a pas de produit ou que l'API est indisponible
    const errMessageInContent = document.querySelector('.titles');
    errMessageInContent.innerHTML = '<h1>Erreur 503</h1><h2>Impossible de récupérer les articles depuis l\'API.</h2>';
  });
