import { deleteActive, getActive, getMatch, insertActive, updateActive } from "./db"
import { activematch } from "./struct"
import * as discord from "discord.js"

export function dateBuilder() {
    let d = new Date();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[d.getDay()];
    let date = d.getDate();
    console.log(d.getMonth())
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${day}, ${month} ${date} ${year}`;
  }

export async function running(client: discord.Client): Promise<void> {
    let matches: activematch[] = await getActive()
    for (const match of matches) {
        //console.log(Math.floor(Date.now() / 1000) - match.votetime)
        console.log(Math.floor(Date.now() / 1000) - match.p1.time, "time")
        console.log(Math.floor(Date.now() / 1000) - match.p1.time <= 1260 && Math.floor(Date.now() / 1000) - match.p1.time >= 1200)
        let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)
        let user1 = (await client.users.fetch(match.p1.userid))
        let user2 = (await client.users.fetch(match.p2.userid))
      
        if (match.votingperiod === false) {

            console.log('okk')
            if (!match.exhibition && ((Math.floor(Date.now() / 1000) - match.p1.time <= 1860 && Math.floor(Date.now() / 1000) - match.p1.time >= 1800) 
            && match.p1.memedone === false && match.p1.donesplit && match.p1.halfreminder === false)) {

                console.log("OK")
                match.p1.halfreminder = true

                let embed = new discord.MessageEmbed()
                    .setColor("#d7be26")
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`You have 30 mins left.\nUse \`!submit\` to submit`)
                    .setTimestamp()

                try{
                    user1.send(embed)
                } catch(err) { 
                    await (<discord.TextChannel>client.channels.cache.get("789201298104123414"))
                    .send("```" + err + "```")
                    await (<discord.TextChannel>client.channels.cache.get("789201298104123414"))
                    .send(`Can't send embed to <@${user1.id}>`)
                }
                // matches.splice(matches.indexOf(match), 1)
            }

            else if (!match.exhibition && (Math.floor(Date.now() / 1000) - match.p2.time <= 1860 && Math.floor(Date.now() / 1000) - match.p2.time >= 1800) 
            && match.p2.memedone === false && match.p2.donesplit && match.p2.halfreminder === false) {
                console.log("OK")
                match.p2.halfreminder = true
                let embed = new discord.MessageEmbed()
                    .setColor("#d7be26")
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`You have 30 mins left.\nUse \`!submit\` to submit`)
                    .setTimestamp()
                

                try{
                    user2.send(embed)
                } catch(err) { 
                    await (<discord.TextChannel>client.channels.cache.get("789201298104123414"))
                    .send("```" + err + "```")
                    await (<discord.TextChannel>client.channels.cache.get("789201298104123414"))
                    .send(`Can't send embed to <@${user2.id}>`)
                }
                // matches.splice(matches.indexOf(match), 1)

                
            }

            // else if (((Math.floor(Date.now() / 1000) - match.p1.time <= 2160 && Math.floor(Date.now() / 1000) - match.p1.time >= 2100) 
            // && match.p1.memedone === false && match.p1.donesplit && match.p1.fivereminder === false)) {
            //     match.p1.fivereminder = true
            //     console.log("OK")
            //     let embed = new discord.MessageEmbed()
            //         .setColor("#d7be26")
            //         .setTitle(`Match between ${user1.username} and ${user2.username}`)
            //         .setDescription(`You have 5 mins left.\nUse \`!submit\` to submit`)
            //         .setTimestamp()
                
            //     try{
            //         user1.send(embed)
            //     } catch(err) { 
            //         await (<discord.TextChannel>client.channels.cache.get("789201298104123414"))
            //         .send("```" + err + "```")
            //         await (<discord.TextChannel>client.channels.cache.get("789201298104123414"))
            //         .send(`Can't send embed to <@${user1.id}>`)
            //     }
            //     // matches.splice(matches.indexOf(match), 1)
            // }

            // else if (((Math.floor(Date.now() / 1000) - match.p2.time <= 2160 && Math.floor(Date.now() / 1000) - match.p2.time >= 2100) && match.p2.memedone === false 
            // && match.p2.donesplit && match.p2.fivereminder === false)){
                
            //     match.p2.fivereminder = true
            //     console.log("OK")
            //     let embed = new discord.MessageEmbed()
            //         .setColor("#d7be26")
            //         .setTitle(`Match between ${user1.username} and ${user2.username}`)
            //         .setDescription(`You have 5 mins left.\nUse \`!submit\` to submit`)
            //         .setTimestamp()

            //     try{
            //         user2.send(embed)
            //     } catch(err) { 
            //         await (<discord.TextChannel>client.channels.cache.get("789201298104123414"))
            //         .send("```" + err + "```")
            //         await (<discord.TextChannel>client.channels.cache.get("789201298104123414"))
            //         .send(`Can't send embed to <@${user2.id}>`)
            //     }
            //     // matches.splice(matches.indexOf(match), 1)
            // }

            else if (!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time > 3600) && match.p2.memedone === false)
                && ((Math.floor(Date.now() / 1000) - match.p1.time > 3600) && match.p1.memedone === false)) {
                user1.send("You have lost because did not submit your meme")
                user2.send("You have lost because did not submit your meme")

                let embed = new discord.MessageEmbed()
                    .setColor("#d7be26")
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> & <@${user2.id}> have lost\n for not submitting meme on time`)
                    .setTimestamp()

                channelid.send(embed)
                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
            }

            else if ((Math.floor(Date.now() / 1000) - match.p1.time > 3600)
                && match.p1.memedone === false && match.p1.donesplit) {
                user1.send("You have failed to submit your meme, your opponet is the winner.")

                let embed = new discord.MessageEmbed()
                    .setColor("#d7be26")
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user2.id}> has won!`)
                    .setTimestamp()

                channelid.send(embed)
                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
            }

            else if ((Math.floor(Date.now() / 1000) - match.p2.time > 3600)
                && match.p2.memedone === false && match.p2.donesplit) {
                console.log(Date.now() - match.p2.time)
                user2.send("You have failed to submit your meme, your opponet is the winner.")

                let embed = new discord.MessageEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> has won!`)
                    .setColor("#d7be26")
                    .setTimestamp()

                channelid.send(embed)
                // matches.splice(matches.indexOf(match), 1)
                await deleteActive(match)
            }


            else if ((!(match.split) && ((Math.floor(Date.now() / 1000) - match.p2.time <= 3600) && match.p2.memedone === true)
                && ((Math.floor(Date.now() / 1000) - match.p1.time <= 3600) && match.p1.memedone === true))) {


                if (Math.floor(Math.random() * (5 - 1) + 1) % 2 === 1) {
                    let temp = match.p1

                    match.p1 = match.p2

                    match.p2 = temp

                    //await updateActive(match)
                }

                if(match.template){
                    channelid.send(
                        new discord.MessageEmbed()
                            .setTitle("Template")
                        .setImage(match.template)
                        .setColor("#07da63")
                        .setTimestamp()
                        )
                }

                if(match.theme){
                    channelid.send(
                        new discord.MessageEmbed()
                            .setTitle("Theme")
                        .setDescription(`Theme is: ${match.theme}`)
                        .setColor("#07da63")
                        .setTimestamp()
                        )
                }



                let embed1 = new discord.MessageEmbed()
                    .setDescription("Player 1")
                    .setImage(match.p1.memelink)
                    .setColor("#d7be26")
                    .setTimestamp()
                
                console.log("Player 1 embed done")
                

                let embed2 = new discord.MessageEmbed()
                    .setDescription("Player 2")
                    .setImage(match.p2.memelink)
                    .setColor("#d7be26")
                    .setTimestamp()
                               
                
                let embed3 = new discord.MessageEmbed()
                    .setTitle("Vote for the best meme!")
                    .setColor("#d7be26")
                    .setDescription(`Vote for User 1 reacting with ${emojis[0]}\nVote for User 2 by reacting with ${emojis[1]}`)
                
               

                await channelid.send(embed1)
                await channelid.send(embed2)
                
                await channelid.send(embed3).then(async msg => {
                    match.messageID = msg.id
                    await (msg as discord.Message).react(emojis[0])
                    await (msg as discord.Message).react(emojis[1])
                })

                //await channelid.send("@eveyone")

                match.votingperiod = true
                match.votetime = (Math.floor(Date.now() / 1000))
                
                if(!match.exhibition){
                    await channelid.send(`<@&748899075470000188>`)
                    await channelid.send("You have 2 hours to vote!")
                }


                

                if(match.exhibition){
                    match.votetime = ((Math.floor(Date.now() / 1000)) - 5400)
                    await channelid.send("You have 30 mins to vote!")
                    await channelid.send(`<@&783003389390487582>`)
                }

                await updateActive(match)
            }
            
        }

        if (match.votingperiod === true && !match.split) {
            //7200
            if ((Math.floor(Date.now() / 1000) - match.votetime > 7200) && !match.split) {
                await end(client, match.channelid)
            }
        }

    }
}

export async function start(message: discord.Message, client: discord.Client) {
    //.start @user1 @user2

    //let users: string[] = []
    var args: Array<string> = message.content.slice(".".length).trim().split(/ +/g)

    if (args.length < 3) {
        return message.reply("invalid response. Command is `!start @user1 @user2 template link`\n or `!start @user1 @user2 theme description`")
    }

    let user1 = await message.mentions.users.first()!
    let user2 = await message.mentions.users.array()[1]!



    let newmatch: activematch = {
        _id: message.channel.id,
        channelid: message.channel.id,
        split: false,
        exhibition:false,
        messageID: "",
        template: "",
        theme: "",
        tempfound: false,
        p1: {
            userid: message.mentions.users.array()[0].id,
            memedone: false,
            donesplit: true,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
            halfreminder: false,
            fivereminder: false,
        },
        p2: {
            userid: message.mentions.users.array()[1].id,
            memedone: false,
            donesplit: true,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
            halfreminder: false,
            fivereminder: false,
        },
        votetime: Math.floor(Date.now() / 1000),
        votingperiod: false,
        // votemessage: null,
    }

    let embed = new discord.MessageEmbed()
    .setTitle(`Match between ${user1.username ? user1.username : (await message.guild!.members.fetch(user1.id)).nickname} and ${user2.username ? user2.username :(await message.guild!.members.fetch(user2.id)).nickname}`)
    .setColor("#d7be26")
    .setDescription(`<@${user1.id}> and <@${user2.id}> both have 1 hours to complete your memes.`)
    .setTimestamp()



    await message.channel.send({ embed })


    await insertActive(newmatch)

    await user1.send(`You have 1 hour to complete your meme\nUse \`!submit\` to submit meme`)
    await user2.send(`You have 1 hour to complete your meme\nUse \`!submit\` to submit meme`)
    // // return matches;
}

export async function end(client: discord.Client, id: string) {
    let match: activematch = await getMatch(id)

    // if(!match.exhibition){

    //     for(let s = 0; s <  match.p1.voters.length; s++){
    //         await await updateProfile(match.p1.voters[s], "points", 2)
    //         await await updateProfile(match.p1.voters[s], "memesvoted", 1)
    //     }

    //     for(let t = 0; t <  match.p2.voters.length; t++){
    //         await await updateProfile(match.p2.voters[t], "points", 2)
    //         await await updateProfile(match.p2.voters[t], "memesvoted", 1)
    //     }
    // }

    await deleteActive(match)

    console.log(match)

    let channelid = <discord.TextChannel>client.channels.cache.get(match.channelid)
    let user1 = (await client.users.fetch(match.p1.userid))
    let user2 = (await client.users.fetch(match.p2.userid))

    console.log(Math.floor(Date.now() / 1000) - match.votetime)
    console.log((Math.floor(Date.now() / 1000) - match.votetime) >= 35)
    if ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false) {
        user1.send("You have failed to submit your meme, your opponet is the winner.")

        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user2.id}> has won!`)
            .setFooter(dateBuilder())

        await channelid.send(embed)
    }

    else if ((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) {
        console.log(Date.now() - match.p2.time)
        user2.send("You have failed to submit your meme, your opponet is the winner.")


        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> has won!`)
            .setFooter(dateBuilder())

        await channelid.send(embed)

    }

    else if (((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) && ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false)) {
        user1.send("You have failed to submit your meme")
        user2.send("You have failed to submit your meme")

        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> & ${user2.id}have lost\n for not submitting meme on time`)
            .setFooter(dateBuilder())

        await channelid.send(embed)
    }

    else if (match.p1.votes > match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user1.id}> has won with image A!\n The final votes were ${match.p1.votes} to ${match.p2.votes}`)
            .setFooter(dateBuilder())

        if (!match.exhibition) {
            await user1.send(`Your match is over, here is the final result. You gained 25 points for winning your match, and ${(match.p1.votes * 5)} points from your votes.`, { embed: embed })
            await user2.send(`Your match is over, here is the final result. You gained ${(match.p2.votes * 5)} points from your votes.`, { embed: embed })
        }

        // let d = new Date()

        if (match.exhibition === false) {
            await (<discord.TextChannel>client.channels.cache.get("734565012378746950")).send((new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(match.p1.memelink)
                .setDescription(`${(await (await channelid.guild!.members.fetch(user1.id)).nickname) || await (await client.users.fetch(user1.id)).username} won with ${match.p1.votes} votes!`)
                .setFooter(dateBuilder())
            ))
        }

        else if (match.exhibition === true) {
            await (<discord.TextChannel>client.channels.cache.get("780774797273071626")).send((new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(match.p1.memelink)
                .setDescription(`<@${user1.id}> beat <@${user2.id}>.\nThe final score was ${match.p1.votes} to ${match.p2.votes} votes!`)
                .setFooter(dateBuilder())
            ))
        }



    }

    else if (match.p1.votes < match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setColor("#d7be26")
            .setDescription(`<@${user2.id}> has won with image B!\n The final votes were ${match.p1.votes} to ${match.p2.votes}`)
            .setFooter(dateBuilder())

        // let d = new Date()

        if (match.exhibition === false) {
            await (<discord.TextChannel>client.channels.cache.get("734565012378746950")).send((new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(match.p2.memelink)
                .setDescription(`${(await (await channelid.guild!.members.fetch(user2.id)).nickname) || await (await client.users.fetch(user2.id)).username} won with ${match.p2.votes} votes!`)
                .setFooter(dateBuilder())
            ))
        }

        else if (match.exhibition === true) {
            await (<discord.TextChannel>client.channels.cache.get("780774797273071626")).send((new discord.MessageEmbed()
                .setColor("#d7be26")
                .setImage(match.p2.memelink)
                .setDescription(`<@${user2.id}> beat <@${user1.id}>.\nThe final score was ${match.p2.votes} to ${match.p1.votes} votes!`)
                .setFooter(dateBuilder())
            ))
        }

        if (!match.exhibition) {
            await user1.send(`Your match is over, here is the final result. You gained ${(match.p1.votes * 5)} points from your votes.`, { embed: embed })
            await user2.send(`Your match is over, here is the final result. You gained 25 points for winning your match, and gained ${(match.p2.votes * 5)} points from your votes.`, { embed: embed })
        }
    }

    else if (match.p1.votes === match.p2.votes) {
        let embed = new discord.MessageEmbed()
            .setColor("#d7be26")
            .setTitle(`Match between ${user1.username} and ${user2.username}`)
            .setDescription(`Both users have gotten ${match.p1.votes} vote(s). Both users came to a draw.\nPlease find a new time for your rematch.`)
            .setFooter(dateBuilder())

        await channelid.send(embed)
        await user1.send(`Your match is over,both of you ended in a tie of ${match.p1.votes}`)
        await user2.send(`Your match is over, both of you ended in a tie of ${match.p1.votes}`)
    }

    return;
}


export async function submit(message: discord.Message, client: discord.Client) {
    
    if(message.content.includes("imgur")){
        return message.reply("You can't submit imgur links")
    }

    if (message.attachments.size > 1){
        return message.reply("You can't submit more than one image")
    }
    
    else if(message.attachments.size <= 0){
        return message.reply("Your image was not submitted properly. Contact a mod")
    }

    else if(message.channel.type !== "dm"){
        return message.reply("You didn't not submit this in the DM with the bot.\nPlease delete and try again.")
    }


    else{
        if(message.attachments.array()[0].url.toString().includes("mp4")) return message.reply("Video submissions aren't allowed")

        let matches: activematch[] = await getActive()

        for (const match of matches){
            if((match.p1.userid === message.author.id) && !match.p1.memedone && !match.p1.memelink.length){
                match.p1.memelink = (message.attachments.array()[0].url)
                match.p1.memedone = true

                if(match.split){
                    match.p1.donesplit = true
                }
                await (<discord.TextChannel>client.channels.cache.get("789201298104123414")).send({
                    embed:{
                        description: `<@${message.author.id}> has submitted their meme\nChannel: <#${match.channelid}>`,
                        color: "#d7be26",
                        timestamp: new Date()
                    }
                });
                message.reply("Your meme has been attached!")

                if(match.p1.donesplit && match.p2.donesplit && match.split){
                    console.log("not a split match")
                    match.split = false
                    match.p1.time = Math.floor(Date.now() / 1000) - 3200
                    match.p2.time = Math.floor(Date.now() / 1000) - 3200
                    // match.votingperiod = true
                    // match.votetime = Math.floor(Date.now() / 1000)
                }
                await updateActive(match)
                return;
            }

            if((match.p2.userid === message.author.id) && !match.p2.memedone && !match.p2.memelink.length){

                match.p2.memelink = (message.attachments.array()[0].url)
                match.p2.memedone = true

                if(match.split){
                    match.p2.donesplit = true
                }
                
                await (<discord.TextChannel>client.channels.cache.get("789201298104123414")).send({
                    embed:{
                        description: `<@${message.author.id}> has submitted their meme\nChannel: <#${match.channelid}>`,
                        color: "#d7be26",
                        timestamp: new Date()
                    }
                });
                message.reply("Your meme has been attached!")

                if(match.p1.donesplit && match.p2.donesplit && match.split){
                    console.log("not a split match")
                    match.split = false
                    match.p1.time = Math.floor(Date.now() / 1000) - 3200
                    match.p2.time = Math.floor(Date.now() / 1000) - 3200
                    // match.votingperiod = true
                    // match.votetime = Math.floor(Date.now() / 1000)
                }
                
                await updateActive(match)
                return;
            }
        }
    }
}

export async function cancelmatch(message: discord.Message) {
    if (await getMatch(message.channel.id)) {
        await deleteActive(await getMatch(message.channel.id))
        return await message.reply("this match has been cancelled")
    }

    else {
        return await message.reply("there are no matches")
    }
}

export let emojis = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "♻️",
    "✅",
    "❌",
    "🌀"
];