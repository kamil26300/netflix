require("dotenv").config();
const mongoose = require("mongoose");

exports.findMovieOrSeriesById = async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection("movie&serie");

    const type = req.originalUrl.split("/")[1];
    const movieId = req.params.id;

    if (!movieId || (type !== "Movie" && type !== "Serie")) {
      return res
        .status(400)
        .json({ error: "Invalid URL format. Use /Movie/:id or /Serie/:id" });
    }

    const movieOrSeries = await collection.findOne({
      id: parseInt(movieId),
      type,
    });

    if (movieOrSeries) {
      res.status(200).json(movieOrSeries);
    } else {
      res.status(404).json({ error: `${type} not found` });
    }
  } catch (error) {
    console.error("Error finding movie or series: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection("movie&serie");

    const type = req.originalUrl.split("/")[1];
    const category = req.params.category;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (
      !category ||
      typeof category !== "string" ||
      !type ||
      typeof type !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "Invalid category or type provided" });
    }

    const query = {
      category: { $in: [category] },
      type,
    };

    const pipeline = [{ $match: query }, { $sort: { voteAverage: -1 } }];

    if (limit > 0) {
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });
    }

    const categoryReturnList =
      page && limit
        ? await collection.aggregate(pipeline).toArray()
        : await collection
            .find({
              category: { $in: [category] },
              type,
              projection: {
                id: 1,
                title: 1,
                name: 1,
                image: 1,
                type: 1,
              },
            })
            .sort({ voteAverage: -1 })
            .toArray();

    if (categoryReturnList.length > 0) res.status(200).json(categoryReturnList);
    else res.status(404).json({ error: `No ${category} category in ${type}.` });
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSearchResult = async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection("movie&serie");
    const searchQuery = req.query.title;
    const filter = { title: { $regex: searchQuery, $options: "i" } };
    const results = await collection.find(filter).toArray();

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ message: "No titles found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
