"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const types_1 = require("../types");
const player_1 = require("../modules/player");
module.exports = new types_1.Command(new builders_1.SlashCommandBuilder().setName("재생").setDescription("노래를 재생합니다."), async (interaction, bot) => {
    await interaction.deferReply();
    let author = interaction.member;
    if (!author.voice.channel)
        return await interaction.editReply("먼저 음성 채널에 참가하세요.");
    if (!interaction.guildId || !interaction.channel || !interaction.member)
        return;
    let guildQueue = bot.player.queue.get(interaction.guildId);
    if (!guildQueue) {
        bot.player.queue.set(interaction.guildId, new player_1.Queue(interaction.channel, author.voice.channel));
        guildQueue = bot.player.queue.get(interaction.guildId);
    }
    if (!guildQueue)
        return;
    if (!guildQueue.isPlaying) {
        await guildQueue.play();
    }
    await interaction.editReply({
        embeds: [new discord_js_1.MessageEmbed().setColor("#008000").setTitle(":white_check_mark:")],
    });
});
