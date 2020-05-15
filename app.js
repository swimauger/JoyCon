const { app } = require('electron');
const JoyCon = require('./app/server/joycon');

app.dock.hide();
app.on('ready', () => new JoyCon());
