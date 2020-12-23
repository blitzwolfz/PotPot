"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const db_1 = require("./db");
const running_1 = require("./running");
require("dotenv").config();
const express = require('express');
const app = express();
app.use(express.static('public'));
const http = require('http');
var _server = http.createServer(app);
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
app.get('/', (_request, response) => {
    response.sendFile(__dirname + "/index.html");
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});
const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});
client.on('ready', async () => {
    var _a;
    await db_1.connectToDB();
    client.user.setActivity(`Warming up`);
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    console.log("OK");
    let matches = await db_1.getActive();
    if (matches) {
        for (const match of matches) {
            if (match.votingperiod) {
                let channel = client.channels.cache.get(match.channelid);
                channel.messages.fetch(match.messageID).then(async (msg) => {
                    if (msg.partial) {
                        await msg.fetch();
                    }
                });
            }
        }
    }
    setInterval(async function () {
        await running_1.running(client);
    }, 15000);
    client.user.setActivity(`Let the games begin`);
});
client.on("messageReactionAdd", async function (messageReaction, user) {
    if (user.bot)
        return;
    if ((messageReaction.emoji.name === running_1.emojis[1] || messageReaction.emoji.name === running_1.emojis[0])
        && await db_1.getMatch(messageReaction.message.channel.id)) {
        let match = await db_1.getMatch(messageReaction.message.channel.id);
        if (messageReaction.partial)
            await messageReaction.fetch();
        if (messageReaction.message.partial)
            await messageReaction.message.fetch();
        if (!match)
            return;
        if (user.id !== match.p1.userid && user.id !== match.p2.userid) {
            console.log("checkq1");
            if (messageReaction.emoji.name === running_1.emojis[0]) {
                console.log("checkq2");
                if (match.p1.voters.includes(user.id)) {
                    await user.send("You can't vote on the same meme twice");
                    await messageReaction.users.remove(user.id);
                    await messageReaction.message.react(running_1.emojis[0]);
                }
                else {
                    match.p1.votes += 1;
                    match.p1.voters.push(user.id);
                    if (match.p2.voters.includes(user.id)) {
                        match.p2.votes -= 1;
                        match.p2.voters.splice(match.p2.voters.indexOf(user.id), 1);
                    }
                    await messageReaction.users.remove(user.id);
                    await messageReaction.message.react(running_1.emojis[0]);
                    if (!match.exhibition) {
                        await user.send(`Vote counted for Player 1's memes in <#${match.channelid}>. You gained 2 points for voting`);
                    }
                    else {
                        await user.send(`Vote counted for Player 1's memes in <#${match.channelid}>.`);
                    }
                    console.log("checkq3");
                }
            }
            else if (messageReaction.emoji.name === running_1.emojis[1]) {
                console.log("checkq4");
                if (match.p2.voters.includes(user.id)) {
                    await user.send("You can't vote on the same meme twice");
                    await messageReaction.users.remove(user.id);
                    await messageReaction.message.react(running_1.emojis[1]);
                }
                else {
                    match.p2.votes += 1;
                    match.p2.voters.push(user.id);
                    if (match.p1.voters.includes(user.id)) {
                        match.p1.votes -= 1;
                        match.p1.voters.splice(match.p1.voters.indexOf(user.id), 1);
                    }
                    await messageReaction.users.remove(user.id);
                    await messageReaction.message.react(running_1.emojis[1]);
                    if (!match.exhibition) {
                        await user.send(`Vote counted for Player 2's memes in <#${match.channelid}>. You gained 2 points for voting`);
                    }
                    else {
                        await user.send(`Vote counted for Player 2's memes in <#${match.channelid}>.`);
                    }
                    console.log("checkq5");
                }
            }
            await db_1.updateActive(match);
        }
        else {
            await user.send("You can't vote in your own match");
            await messageReaction.users.remove(user.id);
        }
    }
    ;
});
client.on("message", async (message) => {
    var _a;
    if (message.content.indexOf(process.env.PREFIX) !== 0 || message.author.bot) {
        if (message.author.id !== "688558229646475344")
            return;
    }
    var args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    if (!args || args.length === 0) {
        return;
    }
    ;
    const command = (_a = args === null || args === void 0 ? void 0 : args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (command === "start") {
        if (!message.member.roles.cache.find(x => x.name.toLowerCase().includes("mod")))
            return message.reply("You don't have those premissions");
        await running_1.start(message, client);
    }
    else if (command === "submit") {
        await running_1.submit(message, client);
    }
    else if (command === "cancel") {
        if (!message.member.roles.cache.find(x => x.name.toLowerCase().includes("mod")))
            return message.reply("You don't have those premissions");
        await running_1.cancelmatch(message);
    }
});
client.login(process.env.TOKEN);
