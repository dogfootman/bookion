const express = require('express');
const router = express.Router();
const { getLocationBasedTours, getAllLocationBasedTours, getTourDetailImages, getAllTourDetailImages } = require('../controllers/tourController');
const { validateApiKey } = require('../middlewares/apiKeyMiddleware');

/**
 * @swagger
 * /api/v1/tours/location:
 *   get:
 *     tags:
 *       - Tours
 *     summary: Get location-based tour information
 *     description: Retrieves tour information based on location coordinates
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: mapX
 *         required: true
 *         schema:
 *           type: number
 *         description: X coordinate (longitude)
 *       - in: query
 *         name: mapY
 *         required: true
 *         schema:
 *           type: number
 *         description: Y coordinate (latitude)
 *       - in: query
 *         name: radius
 *         schema:
 *           type: integer
 *           default: 10000
 *         description: Search radius in meters
 *       - in: query
 *         name: contentTypeId
 *         schema:
 *           type: string
 *         description: Content type ID for filtering
 *       - in: query
 *         name: pageNo
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: numOfRows
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved tour information
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
router.get('/location', validateApiKey, getLocationBasedTours);

/**
 * @swagger
 * /api/v1/tours/location-all:
 *   get:
 *     tags:
 *       - Tours
 *     summary: Get all location-based tour information
 *     description: Retrieves all tour information based on location coordinates with pagination
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: mapX
 *         required: true
 *         schema:
 *           type: number
 *         description: X coordinate (longitude)
 *       - in: query
 *         name: mapY
 *         required: true
 *         schema:
 *           type: number
 *         description: Y coordinate (latitude)
 *       - in: query
 *         name: radius
 *         schema:
 *           type: integer
 *           default: 10000
 *         description: Search radius in meters
 *       - in: query
 *         name: numOfRows
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved all tour information
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
router.get('/location-all', validateApiKey, getAllLocationBasedTours);

/**
 * @swagger
 * /api/v1/tours/detail-images:
 *   get:
 *     tags:
 *       - Tours
 *     summary: Get tour detail images
 *     description: Retrieves detailed images of a specific tour location
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID of the tour location
 *       - in: query
 *         name: pageNo
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: numOfRows
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved tour detail images
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
router.get('/detail-images', validateApiKey, getTourDetailImages);

/**
 * @swagger
 * /api/v1/tours/detail-images-all:
 *   get:
 *     tags:
 *       - Tours
 *     summary: Get all tour detail images
 *     description: Retrieves all detailed images of a specific tour location with pagination
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID of the tour location
 *       - in: query
 *         name: numOfRows
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved all tour detail images
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
router.get('/detail-images-all', validateApiKey, getAllTourDetailImages);

module.exports = router; 