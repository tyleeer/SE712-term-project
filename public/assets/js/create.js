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
  images:
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F817703069%2F512516274193%2F1%2Foriginal.20240731-072617?w=600&auto=format%2Ccompress&q=75&sharp=10&s=b15ed3269ca56ee3dd1c1153a654945b",
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
