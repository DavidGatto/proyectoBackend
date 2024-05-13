function deleteProduct(cartId, productId) {
  if (typeof cartId !== "string" || cartId.trim() === "") {
    console.error("Invalid cart ID:", cartId);
    return;
  }

  if (typeof productId !== "string" || productId.trim() === "") {
    console.error("Invalid product ID:", productId);
    return;
  }
  console.log(
    "Deleting product with ID:",
    productId,
    "from cart with ID:",
    cartId
  );
  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error deleting the product from the cart.");
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function clearCart(cartId) {
  console.log("Clearing cart with ID:", cartId);

  fetch(`/api/carts/${cartId}`, {
    method: "DELETE",
  })
    .then((response) => {
      // Verificar el estado de la respuesta HTTP
      if (!response.ok) {
        throw new Error(
          "Error emptying the cart. HTTP status: " + response.status
        );
      }
      // Recargar la página después de vaciar el carrito
      location.reload();
    })
    .catch((error) => {
      console.error("Error clearing cart:", error.message);
    });
}

// function completePurchase(cartId) {
//   console.log("Completing purchase for cart with ID:", cartId);

//   fetch(`/api/carts/${cartId}/purchase`, {
//     method: "POST",
//   })
//     .then((response) => {
//       // Verificar el estado de la respuesta HTTP
//       if (!response.ok) {
//         throw new Error(
//           "Error completing the purchase. HTTP status: " + response.status
//         );
//       }
//       // Recargar la página después de completar la compra
//       location.reload();
//     })
//     .catch((error) => {
//       console.error("Error completing purchase:", error.message);
//     });
// }
