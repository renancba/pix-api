const { getMessages, insertMessages, deleteMessages } = require('../models/pixModel');
const crypto = require('crypto');

const startStream = async (req, res) => {
    const { ispb } = req.params;
    const acceptHeader = req.headers.accept || 'application/json';
    const limit = acceptHeader === 'multipart/json' ? 10 : 1;

    const messages = await getMessages(ispb, limit);

    if (messages.length === 0) {
        res.status(204).set('Pull-Next', `/api/pix/${ispb}/stream/start`).end();
    } else {
        const interactionId = crypto.randomBytes(10).toString('hex');
        res.status(200).set('Pull-Next', `/api/pix/${ispb}/stream/${interactionId}`);
        if (acceptHeader === 'multipart/json') {
            res.json({ messages });
        } else {
            res.json(messages[0]);
        }
    }
};

const continueStream = async (req, res) => {
    const { ispb, interationId } = req.params;
    return startStream(req, res);
};

const endStream = async (req, res) => {
    const { ispb } = req.params;
    await deleteMessages(ispb);
    res.status(204).end();
};

const insertMessagesController = async (req, res) => {
    const { ispb, number } = req.params;
    const messages = Array.from({ length: parseInt(number) }, () => ({
        id: crypto.randomUUID(),
        amount: (Math.random() * 1000).toFixed(2),
        sender: crypto.randomBytes(8).toString('hex'),
        receiver: ispb,
    }));

    const insertedMessages = await insertMessages(ispb, messages);
    res.status(201).json(insertedMessages);
};

module.exports = {
    startStream,
    continueStream,
    endStream,
    insertMessagesController,
};
