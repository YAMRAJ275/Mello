const fs = require("fs");
module.exports.config = {
	name: "chocolate",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", 
	description: "hihihi",
	commandCategory: "no prefix",
	usages: "chocolate",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("Chocolate")==0 || event.body.indexOf("chocolate")==0 || event.body.indexOf("toffee")==0 || event.body.indexOf("Toffee")==0) {
		var msg = {
				body: "Ye lo chocolate 🍫",
				attachment: fs.createReadStream(__dirname + `/cache/chocolate.jpg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🍫", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

 }
