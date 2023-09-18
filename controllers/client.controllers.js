const Client = require('../models/client.model.js');
const config = require('config');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mongoose = require('mongoose');

const { errorHandler } = require('../helpers/error_handler.js');
const MyJwt = require('../services/jwt_service.js');
const mailService = require('../services/mail_service.js');

const registrationClient = async(req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      confirm_password,
    } = req.body

    if (!email || !password || !confirm_password) {
      return res.status(400).send({"message": "You should enter all required data!"});
    }

    const existedClient = await Client.findOne({email});
    if(existedClient) {
      return res.status(400).send({"message": "This client already exists!"})
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    const activation_link = uuid.v4()

    const newClient = await Client({
      name,
      phone,
      email,
      hashed_password: hashedPassword,
      activation_link,
    });
    await newClient.save();

    const payload = {
      id: newClient._id,
      clientRoles: ["READ", "WRITE"],
      is_active: newClient.is_active
    };
    const tokens = MyJwt.generateTokens(payload);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7)

    newClient.hashed_refresh_token = hashedRefreshToken;
    await newClient.save();

    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: config.get("refresh_ms"),
        httpOnly: true,
    });

    await mailService.sendActivationMail(
      email, `${config.get("api_url")}/api/client/activate/${activation_link}`
    )

    return res.status(200).send({"message": "Client succesfully registered!"});
  } catch (error) {
    errorHandler(res, error)
  }
}

const getAllClients = async(req, res) => {
  try {
    const clients = await Client.find({});
    if (!clients) {
      return res.status(404).send({"message": "Clients not found!"});
    }
    if(clients.length === 0){
      return res.status(200).send({"message": "Clients are empty!"});
    }

    res.json({ data: clients });
  } catch (error) {
    errorHandler(res, error)
  }
}

const getClientById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"})
    }

    const client = await Client.findOne({"_id": req.params.id});
    if (!client) {
      return res.status(404).send({"message": "There is no client with such ID!"});
    }

    res.json(client);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateClientById = async(req, res) => {
  try {
    if (req.params.id !== req.client.id) {
      return res.status(401).send({"message": "You don't have such right!"});
    };
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    };

    const {
      name,
      phone,
      email,
      password,
      confirm_password,
    } = req.body;

    const existedClient = await Client.findOne({email});
    if(existedClient) {
      return res.status(400).send({"message": "This client already exists!"})
    };

    const hashedPassword = await bcrypt.hash(password, 7);

    const updateClient = await Client.updateOne(
      {
        "_id": req.params.id
      },
      {
        $set: {
          name,
          phone,
          email,
          hashed_password: hashedPassword,
        }
      }
    );

    if (updateClient.modifiedCount > 0){
      return res.status(200).send({"message": "Client data's successfully changed!"});
    } else if (updateClient.matchedCount === 0){
      return res.status(404).send({"message": "There is no client with such ID!"});
    };
  } catch (error) {
    errorHandler(res, error);
  }
}

const deleteClientById = async(req, res) => {
  try {
    if (req.params.id !== req.client.id) {
      return res.status(401).send({"message": "You don't have such right!"})
    };
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"})
    };

    const deleteClient = await Client.deleteOne({ "_id": req.params.id });

    if (deleteClient.deletedCount > 0){
      return res.status(200).send({"message": "Client data's succesfully deleted!"});
    } else if (deleteClient.deletedCount === 0){
      return res.status(404).send({"message": "There is no client with such ID!"});
    };
  } catch (error) {
    errorHandler(res, error);
  }
}

const loginClient = async(req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(400).send({"message": "Incorrect e-mail or password!"});
    }

    const validPassword = await bcrypt.compare(
      password,
      client.hashed_password
    );
    if (!validPassword) {
      return res.status(400).send({"message": "Incorrect e-mail or password!"});
    }

    const payload = {
      id: client._id,
      clientRoles: ["READ", "WRITE"],
      is_active: client.is_active
    };
    const tokens = MyJwt.generateTokens(payload);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7)

    client.hashed_refresh_token = hashedRefreshToken;
    await client.save();

    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: config.get("refresh_ms"),
        httpOnly: true,
    });

    res.status(200).send({"message": "Succesfully logined"})
  } catch (error) {
    errorHandler(res, error);
  }
}

const logoutClient = async(req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if(!refreshToken) {
      return res.status(400).send({"message": "Undefined token!"})
    }

    const clientFromCookie = await MyJwt.verifyRefresh(refreshToken);
    const clientFromDB = await Client.findOne({ "_id": clientFromCookie.id },);
    if (!clientFromCookie || !clientFromDB) {
      return res.status(400).send({"message": "Client is not registered!"});
    }

    const validToken = await bcrypt.compare(
      refreshToken,
      clientFromDB.hashed_refresh_token
    );
    if (!validToken) {
      return res.status(400).send({"message": "Incorrect token!"});
    }

    const updateClient = await Client.findOneAndUpdate(
        { "_id": clientFromDB.id },
        { $set: { hashed_refresh_token: "", new: true }}
      );
    if (!updateClient) {
      return res.status(400).send({"message": "Undefined token!"});
    }

    res.clearCookie("refreshToken");
    res.status(200).send({"message": "Client succesfully logout!"})
  } catch (error) {
    errorHandler(res, error)
  }
}

const refreshClientToken = async(req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if(!refreshToken) {
      return res.status(400).send({"message": "Undefined token!"})
    }

    const clientFromCookie = await MyJwt.verifyRefresh(refreshToken);
    const clientFromDB = await Client.findOne({ "_id": clientFromCookie.id },);
    if (!clientFromCookie || !clientFromDB) {
      return res.status(400).send({"message": "Client is not registered!"});
    }

    const validToken = await bcrypt.compare(
      refreshToken,
      clientFromDB.hashed_refresh_token
    );
    if (!validToken) {
      return res.status(400).send({"message": "Incorrect token!"});
    }

    const payload = {
      id: clientFromDB._id,
      clientRoles: ["READ", "WRITE"],
      is_active: clientFromDB.is_active
    };
    const tokens = MyJwt.generateTokens(payload);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7)

    clientFromDB.hashed_refresh_token = hashedRefreshToken;
    await clientFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: config.get("refresh_ms"),
        httpOnly: true,
    });

    res.status(200).send({"message": "Client's token succesfully refreshed!"})
  } catch (error) {
    errorHandler(res, error);
  }
}

const activationClient = async(req, res) => {
  try {
    const client = await Client.findOne({ activation_link: req.params.link });
    if (!client) {
      return res.status(400).send({"message": "No such client!"})
    }
    if (client.is_active) {
      return res.status(400).send({"message": "Client already activated!"})
    }

    client.is_active = true;

    await client.save()
    res.status(200).send({"message": "Client activated!"})
  } catch (error) {
    errorHandler(res, error);
  }
}

const banClientById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"})
    }

    const client = await Client.findOne({"_id": req.params.id});
    if (!client) {
      return res.status(404).send({"message": "There is no client with such ID!"});
    }

    const updateClient = await Client.updateOne(
      {
        "_id": req.params.id
      },
      {
        $set: {
          is_active: false,
        }
      }
    );

    if (updateClient.modifiedCount > 0){
      return res.status(200).send({"message": "Client successfully banned!"});
    } else if (updateClient.modified === 0){
      return res.status(404).send({"message": "There is no client with such ID!"});
    };
  } catch (error) {
    errorHandler(req, res)
  }
}

module.exports = {
  registrationClient,
  getAllClients,
  getClientById,
  updateClientById,
  deleteClientById,
  loginClient,
  logoutClient,
  refreshClientToken,
  activationClient,
  banClientById
}