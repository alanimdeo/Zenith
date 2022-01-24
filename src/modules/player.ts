import {
    AudioPlayer,
    createAudioPlayer,
    createAudioResource,
    demuxProbe,
    DiscordGatewayAdapterCreator,
    joinVoiceChannel,
    NoSubscriberBehavior,
    VoiceConnection,
} from "@discordjs/voice";
import { Collection, TextBasedChannel, VoiceBasedChannel } from "discord.js";
import m3u8stream from "m3u8stream";

export class Player {
    queue: Collection<string, Queue>;
    // radio: Radio[];

    constructor() {
        this.queue = new Collection<string, Queue>();
    }
}

export class Queue {
    textChannel: TextBasedChannel;
    voiceChannel: VoiceBasedChannel;
    connection: VoiceConnection;
    audioPlayer: AudioPlayer;
    stream: m3u8stream.Stream | null;
    isPlaying: boolean;
    async play() {
        this.stream = m3u8stream(
            "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8"
        );
        console.log(this.stream);
        let probe = await demuxProbe(this.stream);
        console.log(probe);
        this.audioPlayer.play(createAudioResource(probe.stream, { inputType: probe.type }));
        this.connection.subscribe(this.audioPlayer);
        this.isPlaying = true;
    }

    constructor(textChannel: TextBasedChannel, voiceChannel: VoiceBasedChannel) {
        this.textChannel = textChannel;
        this.voiceChannel = voiceChannel;
        this.audioPlayer = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
        this.connection = joinVoiceChannel({
            guildId: voiceChannel.guildId,
            channelId: voiceChannel.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        });
        this.isPlaying = false;
        this.stream = null;
    }
}

// export class Radio {

// }
