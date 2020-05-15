const { Menu, Tray } = require('electron');
const path = require('path');
const robot = require('robotjs');
const Server = require('./server');

const iconOn = path.resolve(__dirname, '../client/assets/trayon.png');
const iconOff = path.resolve(__dirname, '../client/assets/trayoff.png');

class JoyCon {
    constructor() {
        this.tray = new Tray(iconOff);
        this.controllers = {};
        this.off(false);
    }

    setMenu(items) {
        this.menu = Menu.buildFromTemplate(items);
        this.tray.setContextMenu(this.menu);
    }

    updateActiveControls(menuItem) {
        this.controllers[menuItem.label] = menuItem.checked;
    }

    onNewController(data) {
        this.controllers[data.controller] = false;

        const newMenu = [
            {
                label: 'JoyCon: On',
                role: 'close'
            },
            {
                label: 'Turn JoyCon Off',
                click: this.off.bind(this)
            },
            {
                type: 'separator'
            },
            {
                label: 'Devices',
                role: 'close'
            }
        ];
        for (const controller in this.controllers) {
            newMenu.push({
                label: controller,
                type: 'checkbox',
                click: this.updateActiveControls.bind(this)
            });
        }
        newMenu.push({
            type: 'separator'
        }, {
            label: 'Quit',
            role: 'quit'
        });

        this.setMenu(newMenu);
    }

    onInput(input) {
        if (this.controllers[input.controller]) {
            robot[input.action].apply(robot[input.action], input.args);
        }
    }

    toggleSocket() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.controllers = {};
        } else {
            this.socket = new Server();
            this.socket.on('controller', this.onNewController.bind(this));
            this.socket.on('control', this.onInput.bind(this));
        }
    }

    on() {
        this.tray.setImage(iconOn);

        this.setMenu([{
                label: 'JoyCon: On',
                role: 'close'
            },
            {
                label: 'Turn JoyCon Off',
                click: this.off.bind(this)
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                role: 'quit'
            }
        ]);

        this.toggleSocket();
    }

    off(doToggleSocket = true) {
        this.tray.setImage(iconOff);

        this.setMenu([{
                label: 'JoyCon: Off',
                role: 'close'
            },
            {
                label: 'Turn JoyCon On',
                click: this.on.bind(this)
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                role: 'quit'
            }
        ]);

        if (doToggleSocket) this.toggleSocket();
    }
}

module.exports = JoyCon;