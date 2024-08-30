// ฟังก์ชันเพื่อดึงค่า parameter จาก URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ฟังก์ชันที่จะทำงานเมื่อโหลดหน้าเสร็จ
function onPageLoad() {
  const id = getQueryParam("id");

  if (!id) {
    console.error("ID parameter is missing in the URL.");
    return; // Exit if ID is missing
  }

  console.log("ID:", id);
  loadEvents(id);

  // Attach delete event handler
  const deleteButton = document.getElementById("deleteButton");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => deleteEvent(id));
  }
}

// รอให้เอกสารโหลดเสร็จแล้วค่อยเรียกใช้ฟังก์ชัน onPageLoad
document.addEventListener("DOMContentLoaded", onPageLoad);

// ฟังก์ชันลบเหตุการณ์
function deleteEvent(eventId) {
  if (confirm("Are you sure you want to delete this event?")) {
    fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        console.log("Event deleted:", data);
        // Redirect to home page after successful deletion
        window.location.href = "/index.html"; // Adjust path if needed
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  }
}

function loadEvents(id) {
  fetch(`/api/events/search?id=${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching events: ${response.statusText}`);
      }
      return response.json();
    })
    .then((events) => {
      if (events.length === 0) {
        console.error("No events found with this ID.");
        return;
      }
      displayEvents(events[0]); // Pass the first event object if the API returns an array
    })
    .catch((error) => console.error("Error:", error));
}

function displayEvents(event) {
  // Get the image element inside the thumbnail container
  const thumbnailImage = document.querySelector("#event-image img");
  const eventTitle = document.getElementById("event-title");
  const eventDatetime = document.getElementById("event-datetime");
  const eventLocation = document.getElementById("event-location");
  const eventHosted = document.getElementById("event-hosted");
  const eventDesc = document.getElementById("event-desc");
  const updateAnchor = document.getElementById("updateAnchor");

  if (!updateAnchor) {
    console.error("updateAnchor image element not found.");
    return;
  }
  updateAnchor.href = `update.html?id=${event.id}`;

  if (!thumbnailImage) {
    console.error("Thumbnail image element not found.");
    return;
  }
  thumbnailImage.src = event.images;

  if (!eventTitle) {
    console.error("Event title element not found.");
    return;
  }
  eventTitle.innerText = event.title;

  if (!eventDatetime) {
    console.error("Event datetime element not found.");
    return;
  }
  eventDatetime.childNodes[1].nodeValue = event.datetime;

  if (!eventLocation) {
    console.error("Event location element not found.");
    return;
  }
  eventLocation.childNodes[1].nodeValue = event.location;

  if (!eventHosted) {
    console.error("Event hosted element not found.");
    return;
  }
  eventHosted.textContent = event.hosted;

  if (!eventDesc) {
    console.error("Event hosted element not found.");
    return;
  }
  const fullDesc = Array.isArray(event.eventDescription)
    ? event.eventDescription.join("\n")
    : event.eventDescription;

  if (eventDesc) {
    // Replace new line characters with <br> tags
    eventDesc.innerHTML = fullDesc.replace(/\n/g, "<br>");
  }

  const map = L.map("event-map").setView([event.lat, event.lon], 12); // ใส่ค่าของ lat long ที่คุณต้องการ
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);
  L.marker([event.lat, event.lon]).addTo(map).bindPopup("Here!").openPopup();
}
