HTMLCollection.prototype.addEventListener = function (event, callback) {
    for (let i = 0; i < this.length; i++) {
        this[i].addEventListener(event, callback);
    }
}

NodeList.prototype.addEventListener = function (event, callback) {
    for (let i = 0; i < this.length; i++) {
        this[i].addEventListener(event, callback);
    }
}

document.querySelectorAll('div.button').addEventListener('touchmove', async function (event) {
    event.preventDefault();
    const center = {
        x: event.target.parentNode.offsetLeft + event.target.parentNode.clientWidth / 2,
        y: event.target.parentNode.offsetTop + event.target.parentNode.clientHeight / 2
    };

    const radius = event.target.parentNode.clientHeight / 2 + event.target.clientHeight / 2;

    const touches = Array.from(event.touches).map(touch => {
        return { x: touch.clientX, y: touch.clientY };
    });

    const distance = Math.sqrt(Math.pow(touches[0].y - center.y, 2) + Math.pow(touches[0].x - center.x, 2));

    if (distance < radius) {
        event.target.style.position = "absolute";
        event.target.style.left = touches[0].x - event.target.clientWidth / 2 + "px";
        event.target.style.top = touches[0].y - event.target.clientHeight / 2 + "px";

        const xDifference = touches[0].x - center.x;
        const yDifference = touches[0].y - center.y;

        if (Math.abs(xDifference) > Math.abs(yDifference)) {
            if (xDifference > 0) {
                await Controller.toggleJoyStick('EAST');
            } else {
                await Controller.toggleJoyStick('WEST');
            }
        } else {
            if (yDifference > 0) {
                await Controller.toggleJoyStick('SOUTH');
            } else {
                await Controller.toggleJoyStick('NORTH');
            }
        }
    }
});

document.querySelectorAll('div.button').addEventListener('touchend', async function (event) {
    event.preventDefault();
    await Controller.toggleJoyStick();
    event.target.style.position = "relative";
    event.target.style.left = "0px";
    event.target.style.top = "0px";
});

document.getElementsByTagName('button').addEventListener('touchstart', async function (event) {
    event.preventDefault();
    await Controller.toggleKey(event.target.textContent, true);
});

document.getElementsByTagName('button').addEventListener('touchend', async function (event) {
    event.preventDefault();
    await Controller.toggleKey(event.target.textContent, false);
});