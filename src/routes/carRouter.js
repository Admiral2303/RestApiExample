const express = require('express');
const router = express.Router();



let carController = require('../controllers/carController');
router.route('/')
    .get(carController.getAllcars)
    .post(carController.carAdd);

router.use('/:id', carController.getCarById);

router.route('/:id')
    .get(async(req, res) => {
        res.json(req.car)
    })
    .put(carController.updateAllCarFields)
    .patch(carController.updateSomeFields)
    .delete(carController.deleteById)


module.exports = router;