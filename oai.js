import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import * as schemas from "./schemas.js";
import { readFileSync } from "fs";
import { join } from "path";

export var topic;
export var history = [];
var prompts = JSON.parse(readFileSync(join(import.meta.dirname, "prompts.json")));

const model = process.env.MODEL || "gpt-4o-2024-08-06";
const client = new OpenAI();

export async function generate_message(person){
	var chat_completion = await client.chat.completions.create({
		model,
		messages: [
			{ "role": "system", "content": prompts[person] },
			{ "role": "system", "content": `Topic: ${topic.name}` },
			...history.map((i) => ({ role: i.person == person ? "system" : "user", content: i.message }))
		]
	});
	var message = chat_completion.choices[0].message.content.replaceAll("\n\n", "\n").replaceAll("\n", " ");

	return message;
}

export async function generate_audio(voice, input){
	var audio = await client.audio.speech.create({ model: "tts-1", voice, input, response_format: "pcm" });
	return Buffer.from(await audio.arrayBuffer());
}

export async function generate_topic(){
	var chat_completion = await client.beta.chat.completions.parse({
		model: model,
		messages: [{ "role": "system", "content": prompts["topic"] }],
		response_format: zodResponseFormat(schemas.Topic, "topic")
	});
	topic = chat_completion.choices[0].message.parsed;

	return topic;
}

export async function generate_conversation(){
	if(history.length % 10 == 0){
		topic = await generate_topic();
		history = [];
	}

	if(history.length){
		var person = history[history.length - 1].person == "socrates" ? "kant" : "socrates";
	}else{
		var person = ["socrates", "kant"][Math.round(Math.random())];
	}
	
	var message = await generate_message(person, history)
	history.push({ person, message });

	var audio = await generate_audio(person == "socrates" ? "onyx" : "echo", message);
	
	return { person, audio, message };
}