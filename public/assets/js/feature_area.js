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
    const img = document.createElement("img");
    img.src = `${event.images}`;
    img.className = "card-img-top";
    img.alt = "...";

    const descDiv = document.createElement("div");
    descDiv.className = "desc";
    descDiv.textContent = `${event.category}`;

    overlayDiv.appendChild(img);
    overlayDiv.appendChild(descDiv);

    // Create the flex container div
    const flexDiv = document.createElement("div");
    flexDiv.className = "d-flex";

    // Create the first card-body div (for date)
    const dateCardBody = document.createElement("div");
    dateCardBody.className = "card-body w-25";

    const monthTitle = document.createElement("h5");
    monthTitle.className = "card-title text-center";
    monthTitle.textContent = "NOV";

    const dateText = document.createElement("h5");
    dateText.className = "card-text text-center";
    dateText.textContent = "25-26";

    dateCardBody.appendChild(monthTitle);
    dateCardBody.appendChild(dateText);

    // Create the second card-body div (for event details)
    const detailsCardBody = document.createElement("div");
    detailsCardBody.className = "card-body ps-0 w-75";

    const eventTitle = document.createElement("h5");
    eventTitle.className = "card-title";
    eventTitle.textContent = `${event.title}`;

    const eventDesc = document.createElement("p");
    eventDesc.className = "card-text fw-bold";
    // eventDesc.textContent = `${
    //   Array.isArray(event.eventDescription)
    //     ? event.eventDescription.join("<br>")
    //     : event.eventDescription
    // }`;
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

    const eventTime = document.createElement("p");
    eventTime.className = "card-text";
    eventTime.textContent = `${event.datetime}`;

    detailsCardBody.appendChild(eventTitle);
    detailsCardBody.appendChild(eventDesc);
    detailsCardBody.appendChild(eventTime);

    // Append the card bodies to the flex container
    flexDiv.appendChild(dateCardBody);
    flexDiv.appendChild(detailsCardBody);

    // Append all elements to the card div
    card.appendChild(starDiv);
    card.appendChild(overlayDiv);
    card.appendChild(flexDiv);

    // Append the card to the column div
    colDiv.appendChild(card);
    section.appendChild(colDiv);
  }
}
loadEvents("popular", popularEvents);
loadEvents("trending", trendingEvents);
