function deleteProductInCart(cartId, productId) {
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
  fetch(`/api/carts/${cartId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error emptying the cart.");
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function completePurchase(cartId) {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error completing the purchase.");
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
