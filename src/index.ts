const init = (msg: string) => {
    // console.clear();
    console.log(msg);
};

init("설정 불러오는 중");
import config from "./config";

init("모듈 불러오는 중");
import { Intents, Interaction, Message } from "discord.js";
import fs from "fs";
import { Bot, Command } from "./types";

init("봇 생성 중");
const bot: Bot = new Bot({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});

const commands = fs.readdirSync("./commands").filter((file: string) => file.endsWith(".js") || file.endsWith(".ts"));
for (let file of commands) {
    const command: Command = require(`./commands/${file}`);
    init(`명령어 불러오는 중: ${command.data.name}`);
    bot.commands.set(command.data.name, command);
}

const adminCommands = fs
    .readdirSync("./adminCommands")
    .filter((file: string) => file.endsWith(".js") || file.endsWith(".ts"));
for (let file of adminCommands) {
    const command: Command = require(`./adminCommands/${file}`);
    init(`명령어 불러오는 중: ${command.data.name}`);
    bot.adminCommands.set(command.data.name, command);
}

bot.once("ready", async () => {
    init(`준비 완료! 토큰: \x1b[32m${config.token}\x1b[0m`);
});

bot.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const command = bot.commands.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction, bot);
});

bot.on("messageCreate", async (message: Message) => {
    if (!message.content.startsWith(config.adminPrefix)) return;

    const command = bot.adminCommands.get(message.content.split(" ")[1]);
    if (!command) return;

    await command.execute(message, bot);
});

init("로그인 중");
bot.login(config.token);
