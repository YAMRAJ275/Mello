const fs = require("fs");
module.exports.config = {
	name: "arman",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "MrTomXxX", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "tea",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("@YAMRAJ")==0 || event.body.indexOf("yamraj dev")==0 || event.body.indexOf("YAMMA raj")==0 || event.body.indexOf("dev")==0) {
		var msg = {
				body: "𝗛𝗲 𝗶𝘀 𝗕𝗲𝘀𝘁 𝗙𝗿𝗶𝗲𝗻𝗱 𝗢𝗳 𝗠𝘆 𝗕𝗼𝘀𝘀 𝐑𝐈𝐒𝐇𝐔 𝐗 𝐑𝐈𝐒𝐇𝐈𝐊𝐄𝐒𝐇 \n 💞 \n 🌹YAMRAJ DEV😘♥️🌹",
				attachment: fs.createReadStream(__dirname + `/noprefix/arman.jpg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🍿", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }