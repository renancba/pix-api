const express = require('express');
const {
    startStream,
    continueStream,
    endStream,
    insertMessagesController,
} = require('../controllers/pixController');

const router = express.Router();

router.get('/pix/:ispb/stream/start', startStream);
router.get('/pix/:ispb/stream/:interationId', continueStream);
router.delete('/pix/:ispb/stream/:interationId', endStream);
router.post('/util/msgs/:ispb/:number', insertMessagesController);

module.exports = router;
