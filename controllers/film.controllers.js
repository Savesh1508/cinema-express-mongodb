const Film = require('../models/film.model.js');
const { errorHandler } = require('../helpers/error_handler.js');
const mongoose = require('mongoose');

const getAllFilms = async(req, res) => {
  try {
    const films = await Film.find({});
    if (!films) {
      return res.status(404).send({"message": "Film not found!"});
    }
    if(films.length === 0){
      return res.status(200).send({"message": "Film is empty"});
    }

    res.json({ data: films });
  } catch (error) {
    error(res, error)
  }
}

const getFilmById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"})
    }

    const film = await Film.findOne({"_id": req.params.id});
    if (!film) {
      return res.status(404).send({"message": "There is no film with such ID!"});
    }

    res.json(film);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addFilm = async(req, res) => {
  try {
    const {
      name,
      cinema_id,
      producer_id,
      description
    } = req.body
    if (!name || !cinema_id || !producer_id) {
      return res.status(400).send({"message": "You should enter all required data!"});
    }

    const newFilm = await Film({
      name,
      cinema_id,
      producer_id,
      description
    })

    await newFilm.save();
    return res.status(201).sand({"message": "Film succesfully added!"})
  } catch (error) {
    errorHandler(res, error);
  }
}

const updateFilmById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    }

    const {
      name,
      cinema_id,
      producer_id,
      description
    } = req.body

    const updateFilm = await Film.updateOne(
      {
        "_id": req.params.id
      },
      {
        $set:{
          name,
          cinema_id,
          producer_id,
          description
        }
      }
    )

    if (updateFilm.modifiedCount > 0){
      return res.status(400).send({"message": "Film data's successfully changed!"});
    } else if (updateFilm.matchedCount === 0){
      return res.status(404).send({"message": "There is no film with such ID!"});
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const deleteFilmById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    }

    const deleteFilm = await Film.deleteOne({ "_id": req.params.id })

    if (deleteFilm.deletedCount > 0) {
      return res.status(400).send({"message": "Film data's successfully deleted!"});
    } else if (deleteFilm.deletedCount === 0) {
      return res.status(404).send({"message": "There is no film with such ID!"});
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports = {
  getAllFilms,
  getFilmById,
  addFilm,
  updateFilmById,
  deleteFilmById
}