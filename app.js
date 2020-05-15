const { app } = require('electron');
const JoyCon = require('./app/server/joycon');

if (app.dock) {
    app.dock.hide();
}

app.on('ready', () => new JoyCon());
