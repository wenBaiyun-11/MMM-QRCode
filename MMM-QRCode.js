/* global Module */

/* Magic Mirror
 * Module: QRCode
 *
 * By Evghenii Marinescu https://github.com/MarinescuEvghenii/
 * MIT Licensed.
 */

'use strict';

Module.register("MMM-QRCode", {

	defaults: {
		text       : 'https://github.com/MarinescuEvghenii/MMM-QRCode',
		colorDark  : "#fff",
		colorLight : "#000",
		imageSize  : 150,
		showRaw    : true,
		useQRconnection: false,
		apiKey: 'null',
	},

	deviceIP: {
		connectionString: null,
	},

	getStyles: function() {
		return ["MMM-QRCode.css"];
	},

	getScripts: function() {
		return ["qrcode.min.js"];
	},


	start: function() {
		this.config = Object.assign({}, this.defaults, this.config);
		if (this.config.useQRconnection) {
			this.sendSocketNotification("GETIPADDRESS");
		}
		Log.log("Starting module: " + this.name);
	},

	getDom: function() {

		const wrapperEl = document.createElement("div");
		wrapperEl.classList.add('qrcode');
		
		const qrcodeEl  = document.createElement("div");
		new QRCode(qrcodeEl, {
			text: this.config.useQRconnection ? `http://${this.deviceIP.connectionString}:8080/remote.html` : this.config.text,
			width: this.config.imageSize,
			height: this.config.imageSize,
			colorDark : this.config.colorDark,
			colorLight : this.config.colorLight,
			correctLevel : QRCode.CorrectLevel.H
		});

		const imageEl  = document.createElement("div");
		imageEl.classList.add('qrcode__image');
		imageEl.appendChild(qrcodeEl);

		wrapperEl.appendChild(imageEl);

		if(this.config.showRaw) {
			const textEl = document.createElement("div");
			textEl.classList.add('qrcode__text');
			textEl.innerHTML = this.config.text;
			wrapperEl.appendChild(textEl);
		}

		return wrapperEl;
	},
	socketNotificationReceived: function(notification, payload) {
        switch (notification) {
            case "GOTSOMETHING":
				var connectionString = {
					mirrorIp : payload,
					apiKey : this.config.apiKey,
				};
				this.deviceIP.connectionString = payload;
				this.updateDom();
                break;
            default:
                break;
        }
    },
});