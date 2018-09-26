var config = {
    'channelID':    '479927821678936074',
    'token':        "NDc5MDI1NDEwNzQ3NzkzNDA4.DldsXQ.iXFcHftUwqZtLVDnkJ6h4rWMcSM"
};

const Discord   =   require('discord.js');
const bot       =   new Discord.Client({disableEveryone: true});
const Parser    =   require('rss-parser');
const fs		=	require("fs");

var parser      =   new Parser();
var announce    =   null;
var schedule 	= 	require("node-schedule");

bot.login(config.token);


bot.on("message", async message => {
    bot.user.setActivity("Duck, Duck, Blob"); // Game bot is playing
    if (message.author.bot) return; // bot ignores other bot's messages
    if (message.channel.type === "dm") return; // bot ignores dm's
    if (message.channel.id !== config.channelID) return; // bot reacts only in his channel

    var messageArray = message.content.split(" ");
    var command = messageArray[0];
    var args = messageArray.slice(1);

    if (command == "!test") {
        message.channel.send("Quack!");
    }
     // end of if statement
}); //end of bot commands


bot.on('ready', async () => {
	//create latest.txt
	fs.readFile("latest.txt",  {'flag' :'w+'}, (err, data) => {
	if (err) throw err;
	if (data.toString() !== ""){
		latest = data.toString();
		console.log(latest);
		}
	});
    announce = bot.channels.get(config.channelID);
    sendMessage();
});

async function initPaser() {
    return await parser.parseURL("https://www.youtube.com/feeds/videos.xml?channel_id=UCQSLmtCtm7VuRRG8bxDRt_Q");
};

async function initFile() {
	
	/**
	Making a file with latest date
	*/
	
	if (latest === 0){
	latest = new Date(feed.items[0].pubDate).getTime(); //wrote the latest title and link and convert it to Unix time
	fs.writeFile("latest.txt", latest, (err) => {
		if (err) throw err;
		console.log('The file has been updated!');
	});
	}
};

async function checkFile(){
	/**
	Comparing the dates
	*/
    fs.readFile("latest.txt", { 'flag': 'w+' }, (err, data) => {
        if (err) throw err;
        var compare = (data.toString() === latest);

        Boolean(compare)
    }
};


async function sendMessage() {

    /**
     * Waiting for @var `feed` and rock'n'roll!
     */
    feed = await initPaser();
	
	
	var rule = new schedule.RecurrenceRule();
	rule.minute = 42;
	
	var checkUp = schedule.scheduleJob(rule, function(){
		checkFile(latest);
		if (checkFile() = true){
		announce.send( feed.items[0].title + " " + feed.items[0].link);
		latest = new Date(feed.items[0].pubDate).getTime(); //wrote the latest title and link and convert it to Unix time
		fs.writeFile("latest.txt", latest, (err) => {
		if (err) throw err;
		console.log('The file has been updated!');
	});
		
		}
	});
	
    /**
     * Send only the lastest news
     */

    //announce.send( feed.items[0].title + " " + feed.items[0].link);

    /**
     * --==OR==--
     */

    /**
     * Send ALL news one by one
     */

    /*feed.items.forEach(item => {
        announce.send(item.title + " " + item.link);
    });*/
}