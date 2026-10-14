const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { verifyToken, verifyDealerOrAdmin } = require('../middleware/auth');

// Public endpoints
router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);

// Protected endpoints (Dealers / Admins can create and edit vehicle listings)
router.post('/', verifyToken, verifyDealerOrAdmin, carController.createCar);
router.put('/:id', verifyToken, verifyDealerOrAdmin, carController.updateCar);
router.delete('/:id', verifyToken, verifyDealerOrAdmin, carController.deleteCar);

module.exports = router;