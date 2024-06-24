document
  .getElementById("deleteInactiveAccountsBtn")
  .addEventListener("click", async () => {
    try {
      const response = await fetch("/api/sessions/delete", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      Swal.fire({
        title: "Success",
        text: "Inactive accounts have been deleted",
        icon: "success",
        confirmButtonText: "OK",
      });

      document.getElementById("showAccountsBtn").click();
    } catch (error) {
      console.error("Error deleting inactive accounts:", error);
      Swal.fire({
        title: "Error",
        text: "There was an error deleting inactive accounts",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  });
