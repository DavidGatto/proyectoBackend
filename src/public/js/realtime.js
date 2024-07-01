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
    <p class="card-title font-weight-bold"> ${item.title} </p>
    <p class="card-text"> ${item.price} </p>
    <div class="btn-group mb-3" role="group">
      <button class="btn btn-danger btn-delete">Eliminar</button>
      <button class="btn btn-warning btn-update">Actualizar</button>
    </div>
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
        showUpdateProductModal(item);
      } else if (role === "admin") {
        showUpdateProductModal(item);
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

const showUpdateProductModal = (item) => {
  Swal.fire({
    title: "Actualizar Producto",
    html: `
      <input id="swal-input1" class="swal2-input" placeholder="Nuevo Título" value="${
        item.title
      }">
      <input id="swal-input2" class="swal2-input" placeholder="Nueva Descripción" value="${
        item.description
      }">
      <input id="swal-input3" class="swal2-input" placeholder="Nuevo Precio" value="${
        item.price
      }">
      <input id="swal-input4" class="swal2-input" placeholder="Nueva Imagen" value="${
        item.img
      }">
      <input id="swal-input5" class="swal2-input" placeholder="Nuevo Código" value="${
        item.code
      }">
      <input id="swal-input6" class="swal2-input" placeholder="Nuevo Stock" value="${
        item.stock
      }">
      <input id="swal-input7" class="swal2-input" placeholder="Nueva Categoría" value="${
        item.category
      }">
      <select id="swal-input8" class="swal2-input">
        <option value="true" ${item.status ? "selected" : ""}>Activo</option>
        <option value="false" ${
          !item.status ? "selected" : ""
        }>Inactivo</option>
      </select>
    `,
    focusConfirm: false,
    preConfirm: () => {
      const updatedProduct = {
        title: document.getElementById("swal-input1").value,
        description: document.getElementById("swal-input2").value,
        price: document.getElementById("swal-input3").value,
        img: document.getElementById("swal-input4").value,
        code: document.getElementById("swal-input5").value,
        stock: document.getElementById("swal-input6").value,
        category: document.getElementById("swal-input7").value,
        status: document.getElementById("swal-input8").value === "true",
      };
      socket.emit("updateProduct", { productId: item._id, updatedProduct });
    },
  });
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
