const keybindings = {
    '⇧': 'w',
    '⇦': 'a',
    '⇩': 's',
    '⇨': 'd',
    'X': 'left',
    'Y': 'up',
    'B': 'right',
    'A': 'down'
};

let activeKey;

class Controller {
    static async request(json, endpoint='control') {
        json.controller = window.localStorage.getItem('name');
        try {
            await fetch(`http://10.0.0.214:52305/${endpoint}`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(json)
            });
        } catch(error) {
            console.warn('Server not available');
        }
    }

    static async connect() {
        if (!window.localStorage.getItem('name')) {
            window.localStorage.setItem('name', prompt("Enter the name of this device"));
        }
        try {
            await Controller.request({}, 'controller');
        } catch(error) {
            console.error('Controller unable to connect');
        }
    }

    static async toggleKey(key, isOn) {
        if (keybindings[key]) {
            await Controller.request({
                action: 'keyToggle',
                args: [keybindings[key], isOn ? 'down' : 'up']
            });
        }
    }

    static async toggleJoyStick(direction) {
        let lastKey = activeKey;
        switch (direction) {
            case 'NORTH':
                if (activeKey !== '⇧') {
                    activeKey = '⇧';
                    await Controller.toggleKey(lastKey, false);
                    await Controller.toggleKey(activeKey, true);
                }
                return;
            case 'WEST':
                if (activeKey !== '⇦') {
                    activeKey = '⇦';
                    await Controller.toggleKey(lastKey, false);
                    await Controller.toggleKey(activeKey, true);
                }
                return;
            case 'SOUTH':
                if (activeKey !== '⇩') {
                    activeKey = '⇩';
                    await Controller.toggleKey(lastKey, false);
                    await Controller.toggleKey(activeKey, true);
                }
                return;
            case 'EAST':
                if (activeKey !== '⇨') {
                    activeKey = '⇨';
                    await Controller.toggleKey(lastKey, false);
                    await Controller.toggleKey(activeKey, true);
                }
                return;
            default:
                activeKey = null;
                await Controller.toggleKey(lastKey, false);
                return;
        }
    }
}

Controller.connect();
