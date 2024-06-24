document
  .getElementById("showAccountsBtn")
  .addEventListener("click", async () => {
    try {
      const response = await fetch("/api/sessions/allusers");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const users = await response.json();

      const accountsContainer = document.getElementById("accountsContainer");
      accountsContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos usuarios

      users.forEach((user) => {
        const userDiv = document.createElement("div");
        userDiv.classList.add("user", "border", "p-2", "mb-2");
        userDiv.innerHTML = `
        <p><strong>Nombre:</strong> ${user.first_name} ${user.last_name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Rol:</strong> ${user.role}</p>
        <button class="btn btn-danger btn-sm delete-account-btn" data-id="${
          user._id
        }">Borrar cuenta</button>
        <select class="form-control role-select" data-id="${user._id}">
          <option value="usuario" ${
            user.role === "usuario" ? "selected" : ""
          }>Usuario</option>
          <option value="premium" ${
            user.role === "premium" ? "selected" : ""
          }>Premium</option>
          <option value="admin" ${
            user.role === "admin" ? "selected" : ""
          }>Admin</option>
        </select>
        <button class="btn btn-primary btn-sm update-role-btn" data-id="${
          user._id
        }">Actualizar Rol</button>
      `;
        accountsContainer.appendChild(userDiv);
      });

      // Agregar event listener para los botones de borrar cuenta
      document.querySelectorAll(".delete-account-btn").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const userId = event.target.getAttribute("data-id");
          try {
            const deleteResponse = await fetch(
              `/api/sessions/delete/${userId}`,
              {
                method: "DELETE",
              }
            );

            if (!deleteResponse.ok) {
              throw new Error(`HTTP error! status: ${deleteResponse.status}`);
            }

            // Remover el usuario de la lista
            event.target.parentElement.remove();

            Swal.fire({
              icon: "success",
              title: "Cuenta eliminada",
              text: `La cuenta con ID ${userId} ha sido eliminada.`,
            });
          } catch (error) {
            console.error("Error deleting user:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un error al eliminar la cuenta.",
            });
          }
        });
      });

      // Agregar event listener para los botones de actualizar rol
      document.querySelectorAll(".update-role-btn").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const userId = event.target.getAttribute("data-id");
          const newRole = document.querySelector(
            `.role-select[data-id="${userId}"]`
          ).value;
          try {
            const updateResponse = await fetch(
              `/api/sessions/updateRole/${userId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ role: newRole }),
              }
            );

            if (!updateResponse.ok) {
              throw new Error(`HTTP error! status: ${updateResponse.status}`);
            }

            const updatedUser = await updateResponse.json();

            Swal.fire({
              icon: "success",
              title: "Rol actualizado",
              text: `El rol del usuario con ID ${userId} ha sido actualizado a ${newRole}.`,
            });
          } catch (error) {
            console.error("Error updating user role:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un error al actualizar el rol del usuario.",
            });
          }
        });
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  });

document
  .getElementById("deleteAccountBtn")
  .addEventListener("click", async () => {
    const userId = event.target.getAttribute("data-id");
    try {
      const deleteResponse = await fetch(`/api/sessions/delete/${userId}`, {
        method: "DELETE",
      });

      if (!deleteResponse.ok) {
        throw new Error(`HTTP error! status: ${deleteResponse.status}`);
      }

      window.location.href = "/api/sessions/logout";
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al eliminar tu cuenta.",
      });
    }
  });
