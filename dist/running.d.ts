import * as discord from "discord.js";
export declare function dateBuilder(): string;
export declare function running(client: discord.Client): Promise<void>;
export declare function start(message: discord.Message, client: discord.Client): Promise<discord.Message | undefined>;
export declare function end(client: discord.Client, id: string): Promise<void>;
export declare function submit(message: discord.Message, client: discord.Client): Promise<discord.Message | undefined>;
export declare function cancelmatch(message: discord.Message): Promise<discord.Message>;
export declare let emojis: string[];
