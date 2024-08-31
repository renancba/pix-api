const express = require('express');
const router = express.Router();
const pixController = require('../controllers/pixController');

router.get('/api/pix/:ispb/stream/start', pixController.startStream);

router.get('/api/pix/:ispb/stream/:streamId', pixController.continueStream);

router.delete('/api/pix/:ispb/stream/:streamId', pixController.endStream);

router.post('/api/util/msgs/:ispb/:number', pixController.insertMessages);

module.exports = router;
