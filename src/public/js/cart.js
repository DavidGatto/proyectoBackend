document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const cartId = event.target.dataset.cartId;
      const productId = event.target.dataset.productId;
      console.log(productId);

      try {
        const response = await fetch(
          `/api/carts/${cartId}/products/${productId}/decrease`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          window.location.reload();
        } else {
          console.error("Error al disminuir la cantidad del producto");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});

function clearCart(cartId) {
  console.log("Clearing cart with ID:", cartId);

  fetch(`/api/carts/${cartId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Error emptying the cart. HTTP status: " + response.status
        );
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error clearing cart:", error.message);
    });
}
