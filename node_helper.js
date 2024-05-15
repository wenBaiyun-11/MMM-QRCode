const NodeHelper = require("node_helper");
const si = require('systeminformation');

module.exports = NodeHelper.create({
    start: function () {
        console.log("\x1b[46m%s\x1b[0m", `[Node Helper] Init >> ${this.name}`);
    },

    socketNotificationReceived: function(notification, payload) {
        switch (notification) {
            case "GETIPADDRESS":
                console.log("\x1b[46m%s\x1b[0m","QR-Code Requested for device Network Interface Information.");
                si.networkInterfaces('default').then(data => this.sendSocketNotification("GOTSOMETHING", data.ip4));
                break;
            default:
                break;
        }
    },
});