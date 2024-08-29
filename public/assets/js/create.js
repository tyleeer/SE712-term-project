document.addEventListener("DOMContentLoaded", () => {
  AddEvents();
});

const form = document.getElementById("eventForm");
function AddEvents() {
  form.addEventListener("change", (e) => onChanged(e));
  form.addEventListener("submit", (e) => createEvent(e));
}

let dateTime = "";
let startDateStr = "",
  endDateStr = "";
const createObj = {
  title: "",
  category: "",
  datetime: "",
  location: "",
  hosted: "",
  eventDescription: "",
  tags: "",
  images: "https://example.com/images/tech-conference.jpg",
  lat: "",
  lon: "",
};
function onChanged(e) {
  if (e.target.name == "startDate") {
    startDateStr = new Date(e.target.value).toLocaleString("th-TH");
  } else if (e.target.name == "endDate") {
    endDateStr = new Date(e.target.value).toLocaleString("th-TH");
  }

  if (e.target.name == "startDate" || e.target.name == "endDate") {
    dateTime = `${startDateStr}${endDateStr != "" ? " to " + endDateStr : ""}`;
    createObj["dateTime"] = dateTime;
  } else {
    createObj[e.target.name] = e.target.value;
  }
}

function createEvent(e) {
  e.preventDefault();
  fetch("/api/events", {
    method: "POST", // Specify the HTTP method
    headers: {
      "Content-Type": "application/json", // Specify the content type as JSON
    },
    body: JSON.stringify(createObj),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      console.log("Success:", data); // Handle the JSON data
    })
    .catch((error) => {
      console.error("Error:", error); // Handle errors
    })
    .finally(() => {
      window.location.href = "/";
    });
}
