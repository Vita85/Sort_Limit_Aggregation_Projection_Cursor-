const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const { mongoInstance } = require("./dbConnect");
const { movieController } = require("./controllers/moviesController")

require("dotenv").config();

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    await mongoInstance.connectDB();
  } catch (error) {
    console.log("Failed to connect to database", error);
    process.exit(1);
  }
}

startServer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/movies", movieController.getMoviesByGenre);  //genre by film
app.get("/average-rating", movieController.getAverageRating); //rating films
app.get("/genres", movieController.getGenresDB); //all genres

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});