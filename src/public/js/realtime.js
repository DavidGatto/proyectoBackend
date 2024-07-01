const socket = io();
const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;

socket.on("products", (data) => {
  renderProducts(data);
});

const renderProducts = (products) => {
  const containerProducts = document.getElementById("containerProducts");
  containerProducts.innerHTML = "";

  products.docs.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <p> ${item.title} </p>
      <p> ${item.price} </p>
      <button class="btn-delete">Eliminar</button>
      <button class="btn-update">Actualizar</button>
    `;

    containerProducts.appendChild(card);

    card.querySelector(".btn-delete").addEventListener("click", () => {
      if (role === "premium" && item.owner === email) {
        deleteProduct(item._id);
      } else if (role === "admin") {
        deleteProduct(item._id);
      } else {
        Swal.fire({
          title: "Error",
          text: "No tienes permiso para borrar este producto",
        });
      }
    });

    card.querySelector(".btn-update").addEventListener("click", () => {
      if (role === "premium" && item.owner === email) {
        updateProduct(item);
      } else if (role === "admin") {
        updateProduct(item);
      } else {
        Swal.fire({
          title: "Error",
          text: "No tienes permiso para actualizar este producto",
        });
      }
    });
  });
};

const deleteProduct = (id) => {
  socket.emit("deleteProductById", id);
};

const updateProduct = (item) => {
  const updatedProduct = {
    title: prompt("Nuevo Título", item.title),
    description: prompt("Nueva Descripción", item.description),
    price: prompt("Nuevo Precio", item.price),
    img: prompt("Nueva Imagen", item.img),
    code: prompt("Nuevo Código", item.code),
    stock: prompt("Nuevo Stock", item.stock),
    category: prompt("Nueva Categoría", item.category),
    status: prompt("Nuevo Estado (true/false)", item.status) === "true",
  };

  socket.emit("updateProduct", { productId: item._id, updatedProduct });
};

document.getElementById("btnEnviar").addEventListener("click", () => {
  addProduct();
});

const addProduct = () => {
  const owner = role === "premium" ? email : "admin";
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    img: document.getElementById("img").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === "true",
    owner,
  };

  socket.emit("addProduct", product);
};
