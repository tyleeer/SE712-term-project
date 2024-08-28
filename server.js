const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

// Setup express app
const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Path to the JSON file
const jsonFilePath = path.join(__dirname, "data", "events.json");

// Function to read users from the JSON file
const readEventsFromFile = () => {
  const data = fs.readFileSync(jsonFilePath);
  return JSON.parse(data);
};

// Function to write users to the JSON file
const writeEventsToFile = (events) => {
  fs.writeFileSync(jsonFilePath, JSON.stringify(events, null, 2));
};

// GET route to fetch all events
app.get("/api/events/all", (req, res) => {
  try {
    const events = readEventsFromFile();
    console.log("Events fetched:", events); // Debugging line
    res.json(events);
  } catch (error) {
    console.error("Error reading books file:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/events/search", (req, res) => {
  try {
    const { title, id, category, tag } = req.query; // Extract query parameters
    const events = readEventsFromFile(); // Read events from the JSON file

    // Filter events based on the query parameters
    let filteredEvents = events;

    if (title) {
      filteredEvents = filteredEvents.filter((event) =>
        event.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (id) {
      filteredEvents = filteredEvents.filter(
        (event) => event.id === parseInt(id, 10)
      );
    }

    if (category) {
      filteredEvents = filteredEvents.filter((event) =>
        event.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (tag) {
      filteredEvents = filteredEvents.filter(
        (event) => event.tags && event.tags.toLowerCase() === tag.toLowerCase()
      );
    }

    // Log for debugging
    console.log("Search query:", { title, id, category, tag });
    console.log("Filtered events:", filteredEvents);

    // If matching events are found, return them; otherwise, return a 404 status
    if (filteredEvents.length > 0) {
      res.json(filteredEvents);
    } else {
      res.status(404).send("Event not found");
    }
  } catch (error) {
    console.error("Error searching events:", error);
    res.status(500).send("Internal Server Error");
  }
});
// DELETE route to delete an event by ID
app.delete("/api/events/:id", (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    console.log("DELETE request received for event ID:", eventId);

    let events = readEventsFromFile();
    const eventIndex = events.findIndex((event) => event.id === eventId);

    if (eventIndex !== -1) {
      const deletedEvent = events.splice(eventIndex, 1);
      writeEventsToFile(events);
      res.json(deletedEvent);
    } else {
      console.log("Event not found with ID:", eventId);
      res.status(404).send("Event not found");
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST route to add a new event
app.post("/api/events", (req, res) => {
  try {
    const newEvent = req.body;
    console.log("Events fetched: ", newEvent);
    const events = readEventsFromFile();
    newEvent.id = events.length ? events[events.length - 1].id + 1 : 1;
    events.push(newEvent);
    writeEventsToFile(events);
    res.redirect("/");
  } catch (error) {
    console.error("Error adding new event:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// // Search Events by Title
// app.get("/api/events/search", (req, res) => {
//   const query = req.query.q ? req.query.q.toLowerCase() : ""; // Get the search query from the query parameter and convert it to lowercase
//   console.log("Search query:", query); // Log the search query for debugging

//   try {
//     const events = readEventsFromFile(); // Read events from the JSON file
//     console.log("All events fetched:", events); // Log all fetched events for debugging

//     // Filter events where the title includes the search query
//     const filteredEvents = events.filter((event) =>
//       event.title.toLowerCase().includes(query)
//     );

//     console.log("Filtered events:", filteredEvents); // Log filtered events for debugging

//     // If matching events are found, return them; otherwise, return a 404 status
//     if (filteredEvents.length > 0) {
//       res.json(filteredEvents);
//     } else {
//       res.status(404).send("Event not found");
//     }
//   } catch (error) {
//     console.error("Error fetching or filtering events:", error); // Log any errors for debugging
//     res.status(500).send("Internal Server Error");
//   }
// });

// // GET route to fetch an event by ID
// app.get("/api/events/:id", (req, res) => {
//   try {
//     const eventId = parseInt(req.params.id, 10); // Parse the id from the request parameters
//     const events = readEventsFromFile(); // Read all events from the file
//     const event = events.find((ev) => ev.id === eventId); // Find the event with the matching id

//     if (event) {
//       res.json(event); // Return the event as JSON
//     } else {
//       res.status(404).send("Event not found"); // Send a 404 if the event is not found
//     }
//   } catch (error) {
//     console.error("Error fetching event by ID:", error);
//     res.status(500).send("Internal Server Error"); // Send a 500 error for any other issues
//   }
// });

// // Get Events by Category
// app.get("/api/events/category/:category", (req, res) => {
//   const category = req.params.category.toLowerCase();
//   const events = readEventsFromFile();
//   const filteredEvents = events.filter(
//     (e) => e.category.toLowerCase() === category
//   );

//   res.json(filteredEvents);
// });
