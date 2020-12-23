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
exports.deleteActive = exports.getMatch = exports.getActive = exports.updateActive = exports.insertActive = exports.connectToDB = void 0;
const mongo = __importStar(require("mongodb"));
require("dotenv").config();
const MongoClient = mongo.MongoClient;
const client = new MongoClient(process.env.DBURL, { useUnifiedTopology: true });
async function connectToDB() {
    return new Promise(resolve => {
        client.connect(async (err) => {
            if (err)
                throw err;
            console.log("Successfully connected");
            await resolve();
        });
    });
}
exports.connectToDB = connectToDB;
async function insertActive(activematch) {
    await client.db(process.env.DBNAME).collection("activematch").insertOne(activematch);
    console.log("Inserted ActiveMatches!");
}
exports.insertActive = insertActive;
async function updateActive(activematch) {
    let _id = activematch.channelid;
    await client.db(process.env.DBNAME).collection("activematch").updateOne({ _id }, { $set: activematch });
    console.log("Updated Match!");
}
exports.updateActive = updateActive;
async function getActive() {
    console.log("Getting ActiveMatches");
    return await client.db(process.env.DBNAME).collection("activematch").find({}, { projection: { _id: 0 } }).toArray();
}
exports.getActive = getActive;
async function getMatch(_id) {
    let e = await client.db(process.env.DBNAME).collection("activematch").findOne({ _id });
    console.log(e);
    return e;
}
exports.getMatch = getMatch;
async function deleteActive(match) {
    let _id = match.channelid;
    await client.db(process.env.DBNAME).collection("activematch").deleteOne({ _id });
    console.log("deleted active match");
}
exports.deleteActive = deleteActive;
