"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init = (msg) => {
    // console.clear();
    console.log(msg);
};
init("설정 불러오는 중");
const config_1 = __importDefault(require("./config"));
init("모듈 불러오는 중");
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const types_1 = require("./types");
init("봇 생성 중");
const bot = new types_1.Bot({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES],
});
const commands = fs_1.default.readdirSync("./commands").filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
for (let file of commands) {
    const command = require(`./commands/${file}`);
    init(`명령어 불러오는 중: ${command.data.name}`);
    bot.commands.set(command.data.name, command);
}
const adminCommands = fs_1.default
    .readdirSync("./adminCommands")
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
for (let file of adminCommands) {
    const command = require(`./adminCommands/${file}`);
    init(`명령어 불러오는 중: ${command.data.name}`);
    bot.adminCommands.set(command.data.name, command);
}
bot.once("ready", async () => {
    init(`준비 완료! 토큰: \x1b[32m${config_1.default.token}\x1b[0m`);
});
bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand())
        return;
    const command = bot.commands.get(interaction.commandName);
    if (!command)
        return;
    await command.execute(interaction, bot);
});
bot.on("messageCreate", async (message) => {
    if (!message.content.startsWith(config_1.default.adminPrefix))
        return;
    const command = bot.adminCommands.get(message.content.split(" ")[1]);
    if (!command)
        return;
    await command.execute(message, bot);
});
init("로그인 중");
bot.login(config_1.default.token);
