'use strict'

var ws = new WebSocket(`ws://${window.location.host}/`);

ws.onopen = (e) => {
    console.log("WS: OPEN");
};

ws.onmessage = (e) => {
    let data = JSON.parse(e.data);
    console.log("WS: DATA", data);
};

ws.onclose = (e) => {
    console.log("WS: CLOSE");
};