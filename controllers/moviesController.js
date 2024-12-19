const { mongoInstance } = require("../dbConnect");

const movieController = {

  //MOVIE GENRE
  async getMoviesByGenre(req, res) {
    try {
      const dbMongo = mongoInstance.getDB();
      const moviesCollection = dbMongo.collection("movies");
      //genre
      const genre = req.query.genre;
      const query = genre ? { genres: genre } : {};
      const projection = { title: 1, year: 1 };

      //cursor
      const cursor = moviesCollection.find(query, { projection });
      const moviesList = await cursor.limit(50).toArray();
      if (moviesList.length > 0) {
        const data = { movies: moviesList };
        res.render("moviesList", data);
      } else {
        res.status(404).send("No movies found for the specified genre");
      }
    } catch (error) {
      console.log("Failed to retrieve movies", error);
      res.status(500).send("Internal Server Error.");
    }
  },

  
  //aLL GENRES DB
  
  async getGenresDB(req, res) {
    try {
      const dbMongo = mongoInstance.getDB();
      const moviesCollection = dbMongo.collection("movies");

      const genres = await moviesCollection.aggregate([
        { $unwind: "$genres" }, 
        { $group: { _id: "$genres" } }, 
        { $sort: { _id: 1 } } 
      ]).toArray();

      const genreList = genres.map(genre => genre._id);
      res.render("genresList", { genres: genreList });
    } catch (error) {
      console.log("Failed to retrieve genres", error);
      res.status(500).send("Error retrieving genres.");
    }
  },


  //MOVIE RATING

  async getAverageRating(req, res) {
    try {
      const dbMongo = mongoInstance.getDB();
      const moviesCollection = dbMongo.collection("movies");

      const aggregate = [
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$imdb.rating" },
            totalMovies: { $sum: 1 },
          },
        },
      ];
      const result = await moviesCollection.aggregate(aggregate).toArray();
      const data = { averageRating: result[0]?.averageRating || 0, totalMovies: result[0]?.totalMovies || 0 };
      res.render("averageRating", data);
    } catch (error) {
      console.log("Failed to compute average rating", error);
      res.status(500).send("Internal Server Error");
    }
  },

};

module.exports = { movieController };
