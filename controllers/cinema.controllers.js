const Cinema = require('../models/cinema.model.js');
const { errorHandler } = require('../helpers/error_handler.js');
const mongoose = require('mongoose');

const getAllCinemas = async(req, res) => {
  try {
    const cinemas = await Cinema.find({});
    if (!cinemas) {
      return res.status(404).send({"message": "Cinema not found!"});
    }
    if(cinemas.length === 0){
      return res.status(200).send({"message": "Cinema is empty"});
    }

    res.json({ data: cinemas });
  } catch (error) {
    error(res, error)
  }
}

const getCinemaById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"})
    }

    const cinema = await Cinema.findOne({"_id": req.params.id});
    if (!cinema) {
      return res.status(404).send({"message": "There is no cinema with such ID!"});
    }

    res.json(cinema);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addCinema = async(req, res) => {
  try {
    const {
      name,
      capacity,
      location_id,
      phone,
    } = req.body
    if (!name || !location_id || !phone) {
      return res.status(400).send({"message": "You should enter all required data!"});
    }

    const newCinema = await Cinema({
      name,
      capacity,
      location_id,
      phone
    })

    await newCinema.save();
    return res.status(201).sand({"message": "Cinema succesfully added!"})
  } catch (error) {
    errorHandler(res, error);
  }
}

const updateCinemaById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    }

    const {
      name,
      capacity,
      location_id,
      phone,
    } = req.body

    const updateCinema = await Cinema.updateOne(
      {
        "_id": req.params.id
      },
      {
        $set:{
          name,
          capacity,
          location_id,
          phone
        }
      }
    )

    if (updateCinema.modifiedCount > 0){
      return res.status(400).send({"message": "Cinema data's successfully changed!"});
    } else if (updateCinema.matchedCount === 0){
      return res.status(404).send({"message": "There is no cinema with such ID!"});
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const deleteCinemaById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    }

    const deleteCinema = await Cinema.deleteOne({ "_id": req.params.id })

    if (deleteCinema.deletedCount > 0) {
      return res.status(400).send({"message": "Cinema data's successfully deleted!"});
    } else if (deleteCinema.deletedCount === 0) {
      return res.status(404).send({"message": "There is no cinema with such ID!"});
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports = {
  getAllCinemas,
  getCinemaById,
  addCinema,
  updateCinemaById,
  deleteCinemaById
}