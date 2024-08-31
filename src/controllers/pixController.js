const pixModel = require('../models/pixModel');

const activeStreams = new Map();

const generateUniqueId = () => Math.random().toString(36).substr(2, 10);

const sendMessagesResponse = (res, messages, isMultipart) => {
    if (isMultipart) {
        res.status(200).json(messages);
    } else {
        res.status(200).json(messages[0] || {});
    }
};

const startStream = async (req, res) => {
    const ispb = req.params.ispb;
    const acceptHeader = req.headers.accept;
    const isMultipart = acceptHeader === 'multipart/json';
    const limit = isMultipart ? 10 : 1;

    try {
        let messages = [];
        let pullNext = null;

        const streamId = generateUniqueId();
        activeStreams.set(streamId, ispb);

        const fetchMessages = async () => {
            messages = await pixModel.getMessages(ispb, limit);
            if (messages.length === 0) {
                pullNext = `/api/pix/${ispb}/stream/${streamId}`;
            }
        };

        const waitForMessages = async () => {
            await fetchMessages();
            if (messages.length > 0 || pullNext) {
                sendMessagesResponse(res, messages, isMultipart);
            } else {
                setTimeout(async () => {
                    await waitForMessages();
                }, 8000);
            }
        };

        await waitForMessages();
        if (pullNext) {
            res.setHeader('Pull-Next', pullNext);
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const continueStream = async (req, res) => {
    const ispb = req.params.ispb;
    const streamId = req.params.streamId;
    const acceptHeader = req.headers.accept;
    const isMultipart = acceptHeader === 'multipart/json';
    const limit = isMultipart ? 10 : 1;

    try {
        if (!activeStreams.has(streamId)) {
            return res.status(404).json({ error: 'Stream not found' });
        }

        const messages = await pixModel.getMessages(ispb, limit);
        if (messages.length === 0) {
            res.status(204).send();
        } else {
            res.setHeader('Pull-Next', `/api/pix/${ispb}/stream/${streamId}`);
            sendMessagesResponse(res, messages, isMultipart);
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const endStream = (req, res) => {
    const streamId = req.params.streamId;

    if (activeStreams.has(streamId)) {
        activeStreams.delete(streamId);
        res.status(200).send({ message: 'Stream ended' });
    } else {
        res.status(404).json({ error: 'Stream not found' });
    }
};

const insertMessages = async (req, res) => {
    const ispb = req.params.ispb;
    const number = parseInt(req.params.number, 10);

    try {
        if (isNaN(number) || number <= 0) {
            return res.status(400).json({ error: 'Invalid number of messages' });
        }

        const messages = Array.from({ length: number }).map(() => ({
            endToEndId: generateUniqueId(),
            valor: parseFloat((Math.random() * 100).toFixed(2)),
            pagador: {
                nome: 'Pagador Teste',
                cpfCnpj: '00000000000',
                ispb,
                agencia: '0001',
                contaTransacional: '123456',
                tipoConta: 'CACC'
            },
            recebedor: {
                nome: 'Recebedor Teste',
                cpfCnpj: '00000000000',
                ispb,
                agencia: '0002',
                contaTransacional: '654321',
                tipoConta: 'SVGS'
            },
            campoLivre: '',
            txId: generateUniqueId(),
            dataHoraPagamento: new Date().toISOString()
        }));

        for (const message of messages) {
            await pixModel.insertMessage(message);
        }

        res.status(201).json({ message: 'Messages inserted' });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    startStream,
    continueStream,
    endStream,
    insertMessages
};
