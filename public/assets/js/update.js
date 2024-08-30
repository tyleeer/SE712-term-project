let urlEventId;
let startDateStr = "",
  endDateStr = "",
  dateTime = "";

document.addEventListener("DOMContentLoaded", () => {
  AddEvents();
});

const form = document.getElementById("eventForm");
function AddEvents() {
  form.addEventListener("change", (e) => onChanged(e));
}

function onChanged(e) {
  if (e.target.name == "startDate") {
    startDateStr =
      new Date(e.target.value).toDateString("th-TH") +
      " at " +
      new Date(e.target.value).toLocaleTimeString("th-TH");
  } else if (e.target.name == "endDate") {
    endDateStr =
      new Date(e.target.value).toDateString("th-TH") +
      " at " +
      new Date(e.target.value).toLocaleTimeString("th-TH");
  }
  dateTime = `${startDateStr}${endDateStr != "" ? " to " + endDateStr : ""}`;
}

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

  // console.log("ID:", id);
  urlEventId = id;
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
      console.log(events[0]);

      displayEvents(events[0]); // Pass the first event object if the API returns an array
    })
    .catch((error) => console.error("Error:", error));
}

function displayEvents(eventData) {
  // Bind data to form fields
  document.getElementById("title").value = eventData.title || "";
  document.getElementById("category").value = eventData.category || "";
  document.getElementById("location").value = eventData.location || "";
  document.getElementById("lat").value = eventData.lat || "";
  document.getElementById("lon").value = eventData.lon || "";
  document.getElementById("hosted").value = eventData.hosted || "";

  if (eventData.eventDescription) {
    if (Array.isArray(eventData.eventDescription)) {
      document.getElementById("eventDescription").value =
        eventData.eventDescription.join(" ");
    } else {
      document.getElementById("eventDescription").value =
        eventData.eventDescription;
    }
  } else {
    document.getElementById("eventDescription").value = "";
  }
}

function updateEvent(eventId) {
  // Collect data from the form
  const updatedEventData = {
    title: document.getElementById("title").value,
    category: document.getElementById("category").value,
    location: document.getElementById("location").value,
    lat: document.getElementById("lat").value,
    lon: document.getElementById("lon").value,
    hosted: document.getElementById("hosted").value,
    eventDescription: document.getElementById("eventDescription").value,
    datetime: dateTime,
  };

  // console.log(updatedEventData);

  // datetime: new Date(document.getElementById("startDate").value).toISOString(), // Convert to ISO string

  // Call the PUT API to update the event

  fetch(`/api/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedEventData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error updating event: ${response.statusText}`);
      }
      return response.json();
    })
    .then((updatedEvent) => {
      console.log("Event updated successfully:", updatedEvent);
      alert("Event updated successfully!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to update the event. Please try again.");
    })
    .finally(async () => {
      setTimeout(() => {
        window.location.href = `/detail.html?id=${eventId}`;
      }, 1500);
    });
}

// Example usage of updateEvent
document.getElementById("eventForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission
  updateEvent(urlEventId);
});
