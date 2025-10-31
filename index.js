import "dotenv/config";
import { createReadStream } from "fs";
import { join } from "path";
import Speaker from "speaker";
import { createServer } from "http";
import { Server } from "socket.io";
import { topic, history, generate_conversation } from "./oai.js";
import setBot from "./bot.js";

const port = process.env.PORT || 8080;

var server = createServer(function(_, res){
	res.writeHead(200, { "Content-Type": "text/html" });
	createReadStream(join(import.meta.dirname, "index.html")).pipe(res);
}).listen(port);
var io = new Server(server);
console.log("here");

var current = await generate_conversation();
run();
console.log("here");


function run(){
	var speaker = new Speaker({ sampleRate: 24000, signed: true, bitDepth: 16, channels: 1 });
	
	var completed = 0;
	
	if(history.length == 1) io.emit("topic", topic.name );
	io.emit("message", current.person, current.message, current.audio.length / 48000);
	
	speaker.end(current.audio);
	speaker.on("flush", () => setTimeout(() => [setBot(false), ++completed == 2 && run()], 2000));

	setBot(true, current.person);

	generate_conversation().then(function(message){
		current = message;
		if(++completed == 2) run();
	});
}