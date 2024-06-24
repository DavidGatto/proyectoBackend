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
      `;
        accountsContainer.appendChild(userDiv);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  });
