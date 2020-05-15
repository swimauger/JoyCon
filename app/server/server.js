const express = require('express');
const path = require('path');

class Server {
    constructor() {
        this.__app = express();
        this.__app.use(express.json());
        this.__app.use(express.static(path.resolve(__dirname, '../client')));
        this.__server = this.__app.listen(52305);

        this.__listeners = { 'controller': [], 'control': [] };

        this.__app.post('/controller', this.__handleController.bind(this));
        this.__app.post('/control', this.__handleInput.bind(this));
        this.__app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '../client/controller.html')));
    }

    __handleController(req, res) {
        this.__listeners['controller'].forEach(listener => void listener(req.body));
        res.send();
    }

    __handleInput(req, res) {
        this.__listeners['control'].forEach(listener => void listener(req.body));
        res.send();
    }

    on(event, listener) {
        this.__listeners[event].push(listener);
    }

    close() {
        this.__server.close();
        this.__app = null;
    }
}

module.exports = Server;
