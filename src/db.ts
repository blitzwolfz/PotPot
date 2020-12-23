import * as mongo from "mongodb"

require("dotenv").config();

import { activematch } from "./struct";

const MongoClient = mongo.MongoClient
//const assert = require("assert")

const client = new MongoClient(process.env.DBURL!, { useUnifiedTopology: true })

export async function connectToDB(): Promise<void> {
    return new Promise(resolve => {
        client.connect(async (err: any) => {
            if (err) throw err;
            console.log("Successfully connected");
            // await client.db(process.env.DBNAME).createCollection("activematch").catch();
            // await client.db(process.env.DBNAME).createCollection("quals");
            // await client.db(process.env.DBNAME).createCollection("users");
            // await client.db(process.env.DBNAME).createCollection("signup")
            // await client.db(process.env.DBNAME).createCollection("cockrating")
            // await client.db(process.env.DBNAME).createCollection("modprofiles")
            await resolve();
        });
    });
}

export async function insertActive(activematch: activematch): Promise<void> {
    await client.db(process.env.DBNAME).collection("activematch").insertOne(activematch);
    console.log("Inserted ActiveMatches!")
}

export async function updateActive(activematch: activematch): Promise<void> {
    let _id = activematch.channelid
    await client.db(process.env.DBNAME).collection("activematch").updateOne({_id}, {$set: activematch});
    console.log("Updated Match!")
}

export async function getActive(): Promise<activematch[]>{
    console.log("Getting ActiveMatches")
    // return await client.db(process.env.DBNAME).collection("activematch").find({}, {projection:{ _id: 0 }}).select(['activematch']).toArray();
    return await client.db(process.env.DBNAME).collection("activematch").find({}, {projection:{_id:0}}).toArray();
}


export async function getMatch(_id:string): Promise<activematch>{
    let e = await client.db(process.env.DBNAME).collection("activematch").findOne({_id})!;
    console.log(e)
    return e;
}

export async function deleteActive(match: activematch): Promise<void>{
    let _id = match.channelid
    await client.db(process.env.DBNAME).collection("activematch").deleteOne({_id})
    console.log("deleted active match")
}