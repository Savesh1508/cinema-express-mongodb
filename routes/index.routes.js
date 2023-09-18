const express = require('express');
const { Router } = require('express');

const cinemaRoutes = require('./cinema.routes.js');
const clientRoutes = require('./client.routes.js');
const filmRoutes = require('./film.routes.js');
const locationRoutes = require('./location.routes.js');
const orderRoutes = require('./order.routes.js');
const producerRoutes = require('./producer.routes.js');
const regionRoutes = require('./region.routes.js');



express.Router.prefix = function(path, subRouter){
    const router = express.Router();
    this.use(path, router);
    subRouter(router);
    return router;
}

const router = Router();

router.prefix("/api", (apiRouter) => {
  apiRouter.use('/cinema', cinemaRoutes);
  apiRouter.use('/client', clientRoutes);
  apiRouter.use('/film', filmRoutes);
  apiRouter.use('/location', locationRoutes);
  apiRouter.use('/order', orderRoutes);
  apiRouter.use('/producer', producerRoutes);
  apiRouter.use('/region', regionRoutes);
})

module.exports = router