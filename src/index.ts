import * as Discord from "discord.js";
import { connectToDB, getActive, getMatch, updateActive } from "./db";
import { cancelmatch, running, start, submit, emojis } from "./running";
import { activematch } from "./struct";
require("dotenv").config();


const express = require('express');
const app = express();
app.use(express.static('public'));
const http = require('http');
//@ts-ignore
var _server = http.createServer(app);
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

app.get('/', (_request: any, response: any) => {
  response.sendFile(__dirname + "/index.html");
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});


const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

client.on('ready', async () => {
  await connectToDB()
  client.user!.setActivity(`Warming up`);
  console.log(`Logged in as ${client.user?.tag}`);
  console.log("OK")
  // for(let i = 0; i < 2; i++) console.log(i)



  let matches: activematch[] = await getActive();

  if (matches) {
    for (const match of matches) {
      if (match.votingperiod) {
        let channel = <Discord.TextChannel>client.channels.cache.get(match.channelid)

        channel.messages.fetch(match.messageID).then(async msg => {
          if (msg.partial) {
            await msg.fetch();
          }
        })
      }
    }
  }

  setInterval(async function () {
    // console.log("A Kiss every 5 seconds");
    await running(client)
  }, 15000);

  client.user!.setActivity(`Let the games begin`);
});




client.on("messageReactionAdd", async function (messageReaction, user) {
    //console.log(messageReaction.message.member!.roles.cache.has('719936221572235295'))
    if (user.bot) return;
    if ((messageReaction.emoji.name === emojis[1] || messageReaction.emoji.name === emojis[0])
        && await getMatch(messageReaction.message.channel.id)) {
        let match = await getMatch(messageReaction.message.channel.id)

        if (messageReaction.partial) await messageReaction.fetch();
        if (messageReaction.message.partial) await messageReaction.message.fetch();
        if (!match) return;

        if (user.id !== match.p1.userid && user.id !== match.p2.userid) { // != match.p1.userid || user.id != match.p2.userid
            console.log("checkq1")
            if (messageReaction.emoji.name === emojis[0]) {
                console.log("checkq2")
                if (match.p1.voters.includes(user.id)) {
                    await user.send("You can't vote on the same meme twice")
                    await messageReaction.users.remove(user.id)
                    await messageReaction.message.react(emojis[0])
                }

                else {
                    match.p1.votes += 1
                    match.p1.voters.push(user.id)

                    if (match.p2.voters.includes(user.id)) {
                        match.p2.votes -= 1
                        match.p2.voters.splice(match.p2.voters.indexOf(user.id), 1)
                    }
                    await messageReaction.users.remove(user.id)
                    await messageReaction.message.react(emojis[0])
                    if (!match.exhibition) {
                        await user.send(`Vote counted for Player 1's memes in <#${match.channelid}>. You gained 2 points for voting`)
                    }

                    else {
                        await user.send(`Vote counted for Player 1's memes in <#${match.channelid}>.`)
                    }
                    console.log("checkq3")

                }
            }

            else if (messageReaction.emoji.name === emojis[1]) {
                console.log("checkq4")

                if (match.p2.voters.includes(user.id)) {
                    await user.send("You can't vote on the same meme twice")
                    await messageReaction.users.remove(user.id)
                    await messageReaction.message.react(emojis[1])
                }

                else {
                    match.p2.votes += 1
                    match.p2.voters.push(user.id)


                    if (match.p1.voters.includes(user.id)) {
                        match.p1.votes -= 1
                        match.p1.voters.splice(match.p1.voters.indexOf(user.id), 1)
                    }
                    await messageReaction.users.remove(user.id)
                    await messageReaction.message.react(emojis[1])
                    if (!match.exhibition) {
                        await user.send(`Vote counted for Player 2's memes in <#${match.channelid}>. You gained 2 points for voting`)
                    }

                    else {
                        await user.send(`Vote counted for Player 2's memes in <#${match.channelid}>.`)
                    }
                    console.log("checkq5")
                }
            }

            await updateActive(match)
        }

        else{
          await user.send("You can't vote in your own match")
          await messageReaction.users.remove(user.id)
        }

    };
});

client.on("message", async message => {
  //const gamemaster = message.guild.roles.get("719936221572235295");


  // if(message.content.includes("!speedrun")){
  //   await qualrunning(client);
  //   await running(client);
  //   console.log("Ran!")
  // }
  let answers:string[] = ["MUESLI IS CRINGE", "muesli is cringe", "Muesli is cringe"]

  if(message.author.id !== "756698066320490558" && ["meme", "muesli"].includes(message.content.toLowerCase()) || message.content.toLowerCase().includes("meme") || message.content.toLowerCase().includes("muesli")){
    if(message.author.bot) return;
    await message.channel.send(answers[Math.floor(Math.random() * answers.length)])
  }

  if (message.content.indexOf(process.env.PREFIX!) !== 0 || message.author.bot) {
    if (message.author.id !== "688558229646475344") return;
  }

  var args: Array<string> = message.content.slice(process.env.PREFIX!.length).trim().split(/ +/g);

  if (!args || args.length === 0) {
    return
  };



  const command: string | undefined = args?.shift()?.toLowerCase();

  if (command === "start") {
    if (!message.member!.roles.cache.find(x => x.name.toLowerCase().includes("mod"))) return message.reply("You don't have those premissions")
    await start(message, client)
  }

  else if(command === "ping"){
    await message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  }

  else if(command === "submit"){
      await submit(message, client)
  }

  else if(command === "cancel"){
    if (!message.member!.roles.cache.find(x => x.name.toLowerCase().includes("mod"))) return message.reply("You don't have those premissions")
    await cancelmatch(message)
  }

});

client.login(process.env.TOKEN);