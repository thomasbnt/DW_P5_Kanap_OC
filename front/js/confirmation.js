// Récupère depuis l'URLSearchParam l'ID de la commande
const orderId = new URLSearchParams(window.location.search).get('id');
// On affiche l'orderID sur le span id
document.querySelector('#orderId').innerHTML = orderId;
