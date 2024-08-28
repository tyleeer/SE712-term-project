const popularEvents = document.getElementById("popular-events");
const trendingEvents = document.getElementById("trending-events");

function loadEvents(tag, section) {
  fetch(`/api/events/search?tag=${tag}`)
    .then((response) => response.json())
    .then((events) => {
      displayEvents(events, section);
    })
    .catch((error) => console.error("Error:", error));
}

function displayEvents(events, section) {
  for (const event of events) {
    // Create the main column div with animation class
    const colDiv = document.createElement("div");
    colDiv.className = "col wow fadeInLeft";
    colDiv.setAttribute("data-wow-delay", ".2s");

    // Create the card div
    const card = document.createElement("div");
    card.className = "card";

    // Create the star div with an icon
    const starDiv = document.createElement("div");
    starDiv.className = "star";
    const starIcon = document.createElement("i");
    starIcon.className = "bi bi-star";
    starDiv.appendChild(starIcon);

    // Create the overlay div with an image and description
    const overlayDiv = document.createElement("div");
    overlayDiv.className = "overlay";

    // Create a clickable link for the image
    const imgLink = document.createElement("a");
    imgLink.href = `detail.html?id=${event.id}`;

    const img = document.createElement("img");
    img.src = `${event.images}`;
    img.className = "card-img-top";
    img.alt = "...";

    imgLink.appendChild(img);

    const descDiv = document.createElement("div");
    descDiv.className = "desc";
    descDiv.textContent = `${event.category}`;

    overlayDiv.appendChild(imgLink); // Append the clickable image link
    overlayDiv.appendChild(descDiv);

    // Create the merged card-body div for event details
    const detailsCardBody = document.createElement("div");
    detailsCardBody.className = "card-body";

    // Create a clickable link for the event title
    const eventLink = document.createElement("a");
    eventLink.href = `detail.html?id=${event.id}`;
    eventLink.style.textDecoration = "none";

    const eventTitle = document.createElement("h5");
    eventTitle.className = "card-title";
    eventTitle.textContent = `${event.title}`;

    eventLink.appendChild(eventTitle); // Append the clickable title link

    // Create the date elements (month and date) below the title
    const dateContainer = document.createElement("div");
    dateContainer.className = "mt-2";

    const dateTitle = document.createElement("h6");
    dateTitle.className = "card-subtitle";
    dateTitle.textContent = `${event.datetime}`;

    dateContainer.appendChild(dateTitle);

    const eventDesc = document.createElement("p");
    eventDesc.className = "card-text fw-bold mt-2";
    const fullDesc = Array.isArray(event.eventDescription)
      ? event.eventDescription.join("<br>")
      : event.eventDescription;

    // Split the full description into lines
    const descLines = fullDesc.split("<br>");
    const previewDesc = descLines.slice(0, 2).join("<br>");

    eventDesc.innerHTML = previewDesc;

    if (descLines.length > 2) {
      const readMore = document.createElement("span");
      readMore.className = "read-more";
      readMore.style.color = "blue";
      readMore.style.cursor = "pointer";
      readMore.textContent = " Read more";

      // Add click event to expand the description
      readMore.addEventListener("click", () => {
        eventDesc.innerHTML = fullDesc;
      });

      eventDesc.appendChild(readMore);
    }

    // Append the title, date, and description to the details body
    detailsCardBody.appendChild(eventLink); // Clickable title link
    detailsCardBody.appendChild(dateContainer); // Date below the title
    detailsCardBody.appendChild(eventDesc);

    // Append all elements to the card div
    card.appendChild(starDiv);
    card.appendChild(overlayDiv);
    card.appendChild(detailsCardBody); // Append merged card body

    // Append the card to the column div
    colDiv.appendChild(card);
    section.appendChild(colDiv);
  }
}
loadEvents("popular", popularEvents);
loadEvents("trending", trendingEvents);
