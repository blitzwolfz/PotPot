import { activematch } from "./struct";
export declare function connectToDB(): Promise<void>;
export declare function insertActive(activematch: activematch): Promise<void>;
export declare function updateActive(activematch: activematch): Promise<void>;
export declare function getActive(): Promise<activematch[]>;
export declare function getMatch(_id: string): Promise<activematch>;
export declare function deleteActive(match: activematch): Promise<void>;
