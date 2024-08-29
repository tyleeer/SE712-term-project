// Get the show-events container
const showEvents = document.getElementById("show-events");

// Add an event listener for search input
document.getElementById("searchInput").addEventListener("input", filterEvents);

// Function to load events based on the category from URL
function loadEvents() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  const searchTerm = urlParams.get("search");

  let fetchUrl = "/api/events/all"; // Default to fetch all events

  // Construct the URL with appropriate parameters
  if (category && searchTerm) {
    fetchUrl = `http://localhost:3000/api/events/search?category=${encodeURIComponent(
      category
    )}&title=${encodeURIComponent(searchTerm)}`;
  } else if (category) {
    fetchUrl = `http://localhost:3000/api/events/search?category=${encodeURIComponent(
      category
    )}`;
  } else if (searchTerm) {
    fetchUrl = `http://localhost:3000/api/events/search?title=${encodeURIComponent(
      searchTerm
    )}`;
  }

  fetch(fetchUrl)
    .then((response) => response.json())
    .then((events) => {
      displayEvents(events);
    })
    .catch((error) => console.error("Error:", error));
}

// Function to display events on the page
function displayEvents(events) {
  // Clear the existing events
  showEvents.innerHTML = ""; // Clear the container before appending new content

  for (const event of events) {
    // Create the main div element with classes
    const colDiv = document.createElement("div");
    colDiv.className = "col-lg-6 wow fadeInUp";
    colDiv.setAttribute("data-wow-delay", ".2s");

    // Create the card div with classes
    const cardDiv = document.createElement("div");
    cardDiv.className = "card d-flex flex-row";

    // Create the star div with the icon
    const starDiv = document.createElement("div");
    starDiv.className = "star";
    const starIcon = document.createElement("i");
    starIcon.className = "bi bi-star";
    starDiv.appendChild(starIcon);

    // Create the overlay div with image and description
    const overlayDiv = document.createElement("div");
    overlayDiv.className = "overlay";

    // Create the clickable link for the image
    const imgLink = document.createElement("a");
    imgLink.href = `detail.html?id=${event.id}`;
    const img = document.createElement("img");
    img.src = `${event.images}`;
    img.className = "card-img-top";
    img.alt = "...";
    imgLink.appendChild(img);

    // Description div
    const descDiv = document.createElement("div");
    descDiv.className = "desc";
    descDiv.textContent = `${event.category}`;

    overlayDiv.appendChild(imgLink);
    overlayDiv.appendChild(descDiv);

    // Create the card-body div with title and text
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";

    // Create the clickable link for the title
    const titleLink = document.createElement("a");
    titleLink.href = `detail.html?id=${event.id}`;
    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = `${event.title}`;
    titleLink.appendChild(cardTitle);

    const cardText1 = document.createElement("p");
    cardText1.className = "card-text fw-bold";
    cardText1.textContent = `${event.datetime}`;

    const cardText2 = document.createElement("p");
    cardText2.className = "card-text";
    cardText2.textContent = `${event.location}`;

    // Append elements to the card-body
    cardBodyDiv.appendChild(titleLink);
    cardBodyDiv.appendChild(cardText1);
    cardBodyDiv.appendChild(cardText2);

    // Append all elements to the card div
    cardDiv.appendChild(starDiv);
    cardDiv.appendChild(overlayDiv);
    cardDiv.appendChild(cardBodyDiv);

    // Append the card to the main div
    colDiv.appendChild(cardDiv);

    // Append to the container
    showEvents.appendChild(colDiv);
  }
}

// Function to filter events by title
function filterEvents() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  fetch("/api/events/all") // Fetch all events
    .then((response) => response.json())
    .then((events) => {
      const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchInput)
      );
      displayEvents(filteredEvents);
    })
    .catch((error) => console.error("Error:", error));
}

// Function to filter events by selected categories
function filterEventsByCategory() {
  // Get all checkboxes
  const checkboxes = document.querySelectorAll(".form-check-input");

  // Collect checked categories and convert to lowercase
  const selectedCategories = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) =>
      checkbox.nextElementSibling.textContent.trim().toLowerCase()
    );

  // Fetch all events and filter based on selected categories
  fetch("/api/events/all")
    .then((response) => response.json())
    .then((events) => {
      if (selectedCategories.length > 0) {
        // Filter events by selected categories, using lowercase for comparison
        const filteredEvents = events.filter((event) =>
          selectedCategories.includes(event.category.toLowerCase())
        );
        displayEvents(filteredEvents);
      } else {
        // No category selected, display all events
        displayEvents(events);
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Add event listeners to all checkboxes
const checkboxes = document.querySelectorAll(".form-check-input");
checkboxes.forEach((checkbox) =>
  checkbox.addEventListener("input", filterEventsByCategory)
);

// Load events when the page is loaded
loadEvents();
