// Event listener for detecting 'Enter' key press on the search input
document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      // If Enter key is pressed
      const searchQuery = event.target.value; // Get the search input value
      if (searchQuery) {
        // Redirect to the events page with the search query as a parameter
        window.location.href = `events.html?search=${encodeURIComponent(
          searchQuery
        )}`;
      }
    }
  });
