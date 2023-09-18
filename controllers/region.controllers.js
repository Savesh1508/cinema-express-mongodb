const Region = require('../models/region.model.js');
const { errorHandler } = require('../helpers/error_handler.js');
const mongoose = require('mongoose');

const getAllRegions = async(req, res) => {
  try {
    const regions = await Region.find({});
    if (!regions) {
      return res.status(404).send({"message": "Region not found!"});
    }
    if(regions.length === 0){
      return res.status(200).send({"message": "Region is empty"});
    }

    res.json({ data: regions });
  } catch (error) {
    error(res, error)
  }
}

const getRegionById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"})
    }

    const region = await Region.findOne({"_id": req.params.id});
    if (!region) {
      return res.status(404).send({"message": "There is no region with such ID!"});
    }

    res.json(region);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addRegion = async(req, res) => {
  try {
    const {
      name,
    } = req.body
    if (!name) {
      return res.status(400).send({"message": "You should enter all required data!"});
    }

    const newRegion = await Region({
      name,
    })

    await newRegion.save();
    return res.status(201).sand({"message": "Region succesfully added!"})
  } catch (error) {
    errorHandler(res, error);
  }
}

const updateRegionById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    }

    const {
      name
    } = req.body
    if (!name){
      return res.status(400).send({"message": "You should enter all required data!"});
    }

    const updateRegion = await Region.updateOne(
      {
        "_id": req.params.id
      },
      {
        $set:{
          name,
        }
      }
    )

    if (updateRegion.modifiedCount > 0){
      return res.status(400).send({"message": "Region data's successfully changed!"});
    } else if (updateRegion.matchedCount === 0){
      return res.status(404).send({"message": "There is no region with such ID!"});
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const deleteRegionById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    }

    const deleteRegion = await Region.deleteOne({ "_id": req.params.id })

    if (deleteRegion.deletedCount > 0) {
      return res.status(400).send({"message": "Region data's successfully deleted!"});
    } else if (deleteRegion.deletedCount === 0) {
      return res.status(404).send({"message": "There is no region with such ID!"});
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports = {
  addRegion,
  getAllRegions,
  getRegionById,
  updateRegionById,
  deleteRegionById
}