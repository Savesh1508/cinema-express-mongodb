const Producer = require('../models/producer.model.js');
const { errorHandler } = require('../helpers/error_handler.js');
const mongoose = require('mongoose');

const getAllProducers = async(req, res) => {
  try {
    const producers = await Producer.find({});
    if (!producers) {
      return res.status(404).send({"message": "Producer not found!"});
    }
    if(producers.length === 0){
      return res.status(200).send({"message": "Producer is empty"});
    }

    res.json({ data: producers });
  } catch (error) {
    error(res, error)
  }
}

const getProducerById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"})
    }

    const producer = await Producer.findOne({"_id": req.params.id});
    if (!producer) {
      return res.status(404).send({"message": "There is no producer with such ID!"});
    }

    res.json(producer);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addProducer = async(req, res) => {
  try {
    const {
      name,
      description
    } = req.body
    if (!name) {
      return res.status(400).send({"message": "You should enter all required data!"});
    }

    const newProducer = await Producer({
      name,
      description
    })

    await newProducer.save();
    return res.status(201).sand({"message": "Producer succesfully added!"})
  } catch (error) {
    errorHandler(res, error);
  }
}

const updateProducerById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    }

    const {
      name,
      description
    } = req.body
    if (!name){
      return res.status(400).send({"message": "You should enter all required data!"});
    }

    const updateProducer = await Producer.updateOne(
      {
        "_id": req.params.id
      },
      {
        $set:{
          name,
          description
        }
      }
    )

    if (updateProducer.modifiedCount > 0){
      return res.status(400).send({"message": "Producer data's successfully changed!"});
    } else if (updateProducer.matchedCount === 0){
      return res.status(404).send({"message": "There is no producer with such ID!"});
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const deleteProducerById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    }

    const deleteProducer = await Producer.deleteOne({ "_id": req.params.id })

    if (deleteProducer.deletedCount > 0) {
      return res.status(400).send({"message": "Producer data's successfully deleted!"});
    } else if (deleteProducer.deletedCount === 0) {
      return res.status(404).send({"message": "There is no producer with such ID!"});
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports = {
  getAllProducers,
  getProducerById,
  addProducer,
  updateProducerById,
  deleteProducerById
}