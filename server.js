const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const axios = require("axios");
const parse = require("csv-parse");
const router = express.Router();

const port = process.env.PORT || 4001;

const app = express();

router.get("/", (req, res) => {
  res.render('index.html');
});

app.use(express.static(path.join(__dirname, 'build')));
app.use(router);

const server = http.createServer(app);

const io = socketIO(server);

let interval;

io.on("connection", socket => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  hydrateSchedule(socket);
  interval = setInterval(() => hydrateSchedule(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const hydrateSchedule = async socket => {
  try {

    const res = await axios.get(
      "http://developer.mbta.com/lib/gtrtfs/Departures.csv"
    );

    if (res.data) {
      schedule = parse(res.data, {delimiter: ','}, function(err, output) {
        let schedule = output.slice(1);

        // Sort By Departure Time
        schedule.sort((a, b) => {
          return a[4] - b[4];
        });

        socket.emit("schedule refresh", schedule);
      });
    }
    
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
}



server.listen(port, () => console.log(`Listening on port ${port}`));