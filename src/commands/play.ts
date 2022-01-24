import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Bot, Command } from "../types";
import { Queue } from "../modules/player";

module.exports = new Command(
    new SlashCommandBuilder().setName("재생").setDescription("노래를 재생합니다."),
    async (interaction: CommandInteraction, bot: Bot) => {
        await interaction.deferReply();
        let author: GuildMember = interaction.member as GuildMember;
        if (!author.voice.channel) return await interaction.editReply("먼저 음성 채널에 참가하세요.");
        if (!interaction.guildId || !interaction.channel || !interaction.member) return;
        let guildQueue = bot.player.queue.get(interaction.guildId);
        if (!guildQueue) {
            bot.player.queue.set(interaction.guildId, new Queue(interaction.channel, author.voice.channel));
            guildQueue = bot.player.queue.get(interaction.guildId);
        }
        if (!guildQueue) return;
        if (!guildQueue.isPlaying) {
            await guildQueue.play();
        }
        await interaction.editReply({
            embeds: [new MessageEmbed().setColor("#008000").setTitle(":white_check_mark:")],
        });
    }
);
