const express = require('express');
const router = express.Router();
const bookionController = require('../controllers/bookionController');
const { validateApiKey } = require('../middlewares/apiKeyMiddleware');

/**
 * @swagger
 * /api/v1/bookion/area-codes:
 *   post:
 *     tags:
 *       - Bookion
 *     summary: Get area codes list
 *     description: Retrieve list of area codes with filtering and pagination
 */
router.post('/area-codes', validateApiKey, bookionController.getAreaCodes);

/**
 * @swagger
 * /api/v1/bookion/area-codes/{id}:
 *   get:
 *     tags:
 *       - Bookion
 *     summary: Get area code detail
 *     description: Retrieve detail of specific area code
 */
router.get('/area-codes/:id', validateApiKey, bookionController.getAreaCodeDetail);

/**
 * @swagger
 * /api/v1/bookion/category-codes:
 *   post:
 *     tags:
 *       - Bookion
 *     summary: Get category codes list
 *     description: Retrieve list of category codes with filtering and pagination
 */
router.post('/category-codes', validateApiKey, bookionController.getCategoryCodes);

/**
 * @swagger
 * /api/v1/bookion/category-codes/{id}:
 *   get:
 *     tags:
 *       - Bookion
 *     summary: Get category code detail
 *     description: Retrieve detail of specific category code
 */
router.get('/category-codes/:id', validateApiKey, bookionController.getCategoryCodeDetail);

/**
 * @swagger
 * /api/v1/bookion/tourist-spots:
 *   post:
 *     tags:
 *       - Bookion
 *     summary: Get tourist spots list
 *     description: Retrieve list of tourist spots with filtering and pagination
 */
router.post('/tourist-spots', validateApiKey, bookionController.getTouristSpots);

/**
 * @swagger
 * /api/v1/bookion/tourist-spots/{id}:
 *   get:
 *     tags:
 *       - Bookion
 *     summary: Get tourist spot detail
 *     description: Retrieve detail of specific tourist spot
 */
router.get('/tourist-spots/:id', validateApiKey, bookionController.getTouristSpotDetail);

/**
 * @swagger
 * /api/v1/bookion/lcls-systm-codes:
 *   post:
 *     tags:
 *       - Bookion
 *     summary: Get classification system codes list
 *     description: Retrieve list of classification system codes with filtering and pagination
 */
router.post('/lcls-systm-codes', validateApiKey, bookionController.getLclsSystmCodes);

/**
 * @swagger
 * /api/v1/bookion/lcls-systm-codes/{id}:
 *   get:
 *     tags:
 *       - Bookion
 *     summary: Get classification system code detail
 *     description: Retrieve detail of specific classification system code
 */
router.get('/lcls-systm-codes/:id', validateApiKey, bookionController.getLclsSystmCodeDetail);

/**
 * @swagger
 * /api/v1/bookion/area-based-list:
 *   post:
 *     tags:
 *       - Bookion
 *     summary: Get area based list
 *     description: Retrieve list of area based tour information with filtering and pagination
 */
router.post('/area-based-list', validateApiKey, bookionController.getAreaBasedList);

module.exports = router; 