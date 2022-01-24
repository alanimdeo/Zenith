"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = exports.Player = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const m3u8stream_1 = __importDefault(require("m3u8stream"));
class Player {
    // radio: Radio[];
    constructor() {
        this.queue = new discord_js_1.Collection();
    }
}
exports.Player = Player;
class Queue {
    constructor(textChannel, voiceChannel) {
        this.textChannel = textChannel;
        this.voiceChannel = voiceChannel;
        this.audioPlayer = (0, voice_1.createAudioPlayer)({ behaviors: { noSubscriber: voice_1.NoSubscriberBehavior.Pause } });
        this.connection = (0, voice_1.joinVoiceChannel)({
            guildId: voiceChannel.guildId,
            channelId: voiceChannel.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        this.isPlaying = false;
        this.stream = null;
    }
    async play() {
        this.stream = (0, m3u8stream_1.default)("https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8");
        console.log(this.stream);
        let probe = await (0, voice_1.demuxProbe)(this.stream);
        console.log(probe);
        this.audioPlayer.play((0, voice_1.createAudioResource)(probe.stream, { inputType: probe.type }));
        this.connection.subscribe(this.audioPlayer);
        this.isPlaying = true;
    }
}
exports.Queue = Queue;
// export class Radio {
// }
