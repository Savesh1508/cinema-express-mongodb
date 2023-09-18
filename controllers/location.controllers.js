const Location = require('../models/location.model.js');
const { errorHandler } = require('../helpers/error_handler.js');
const mongoose = require('mongoose');

const getAllLocations = async(req, res) => {
  try {
    const locations = await Location.find({});
    if (!locations) {
      return res.status(404).send({"message": "Location not found!"});
    }
    if(locations.length === 0){
      return res.status(200).send({"message": "Location is empty"});
    }

    res.json({ data: locations });
  } catch (error) {
    error(res, error)
  }
}

const getLocationById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"})
    }

    const location = await Location.findOne({"_id": req.params.id});
    if (!location) {
      return res.status(404).send({"message": "There is no location with such ID!"});
    }

    res.json(location);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addLocation = async(req, res) => {
  try {
    const {
      name,
      region_id
    } = req.body
    if (!name || !region_id) {
      return res.status(400).send({"message": "You should enter all required data!"});
    }

    const newLocation = await Location({
      name,
      region_id
    })

    await newLocation.save();
    return res.status(201).sand({"message": "Location succesfully added!"})
  } catch (error) {
    errorHandler(res, error);
  }
}

const updateLocationById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    }

    const {
      name,
      region_id
    } = req.body
    if (!name){
      return res.status(400).send({"message": "You should enter all required data!"});
    }

    const updateLocation = await Location.updateOne(
      {
        "_id": req.params.id
      },
      {
        $set:{
          name,
          region_id
        }
      }
    )

    if (updateLocation.modifiedCount > 0){
      return res.status(400).send({"message": "Location data's successfully changed!"});
    } else if (updateLocation.matchedCount === 0){
      return res.status(404).send({"message": "There is no location with such ID!"});
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const deleteLocationById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    }

    const deleteLocation = await Location.deleteOne({ "_id": req.params.id })

    if (deleteLocation.deletedCount > 0) {
      return res.status(400).send({"message": "Location data's successfully deleted!"});
    } else if (deleteLocation.deletedCount === 0) {
      return res.status(404).send({"message": "There is no location with such ID!"});
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports = {
  getAllLocations,
  getLocationById,
  addLocation,
  updateLocationById,
  deleteLocationById
}