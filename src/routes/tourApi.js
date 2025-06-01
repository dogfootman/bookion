const express = require('express');
const router = express.Router();
const tourApiController = require('../controllers/tourApiController');
const { validateApiKey } = require('../middlewares/apiKeyMiddleware');

/**
 * @swagger
 * /api/v1/tour-api/sync/area-codes:
 *   post:
 *     tags:
 *       - Tour API
 *     summary: Sync area codes from tour API
 *     description: Synchronizes area codes from the tour API to the database
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Area codes synchronized successfully
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
router.post('/sync/area-codes', validateApiKey, tourApiController.syncAreaCodes);

/**
 * @swagger
 * /api/v1/tour-api/sync/category-codes:
 *   post:
 *     tags:
 *       - Tour API
 *     summary: Sync category codes from tour API
 *     description: Synchronizes category codes from the tour API to the database
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Category codes synchronized successfully
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
router.post('/sync/category-codes', validateApiKey, tourApiController.syncCategoryCodes);

/**
 * @swagger
 * /api/v1/tour-api/sync/tourist-spots:
 *   post:
 *     tags:
 *       - Tour API
 *     summary: Sync all tourist spots from tour API
 *     description: Synchronizes all tourist spots from the tour API to the database
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Tourist spots synchronized successfully
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
router.post('/sync/tourist-spots', validateApiKey, tourApiController.syncTouristSpots);

/**
 * @swagger
 * /api/v1/tour-api/sync/tourist-spots/{areaCode}:
 *   post:
 *     tags:
 *       - Tour API
 *     summary: Sync tourist spots by area code
 *     description: Synchronizes tourist spots for a specific area code from the tour API to the database
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: areaCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Area code to sync tourist spots for
 *     responses:
 *       200:
 *         description: Tourist spots synchronized successfully
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
router.post('/sync/tourist-spots/:areaCode', validateApiKey, tourApiController.syncTouristSpotsByArea);

/**
 * @swagger
 * /api/v1/tour-api/sync/lcls-systm-codes:
 *   post:
 *     tags:
 *       - Tour API
 *     summary: Sync lclsSystm codes from tour API
 *     description: Synchronizes lclsSystm codes from the tour API to the database
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: LclsSystm codes synchronized successfully
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
router.post('/sync/lcls-systm-codes', validateApiKey, tourApiController.syncLclsSystmCodes);

module.exports = router; 