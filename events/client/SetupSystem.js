import { Event } from '../../structures/index.js';
import { PermissionsBitField } from 'discord.js';
import { oops, setupStart } from '../../utils/SetupSystem.js';
export default class SetupSystem extends Event {
    constructor(client, file) {
        super(client, file, {
            name: 'setupSystem',
        });
    }
    async run(message) {
        if (!message.member.voice.channel) {
            await oops(message.channel, `노래를 재생하려면 통화방에 연결되어 있어야 해요`);
            if (message)
                await message.delete().catch(() => { });
            return;
        }
        ;
        if (!message.member.voice.channel.permissionsFor(this.client.user).has(PermissionsBitField.resolve(['Connect', 'Speak']))) {
            await oops(message.channel, `${message.member.voice.channel} 에 접속할 권한이 없어요`);
            if (message)
                await message.delete().catch(() => { });
            return;
        }
        ;
        if (message.guild.members.cache.get(this.client.user.id).voice.channel && message.guild.members.cache.get(this.client.user.id).voice.channelId !== message.member.voice.channelId) {
            await oops(message.channel, `<#${message.guild.members.cache.get(this.client.user.id).voice.channelId}> 에 연결되어 있어야 노래를 재생할 수 있어요`);
            if (message)
                await message.delete().catch(() => { });
            return;
        }
        ;
        let player = this.client.queue.get(message.guildId);
        if (!player) {
            player = await this.client.queue.create(message.guild, message.member.voice.channel, message.channel, this.client.shoukaku.getNode());
        }
        await setupStart(this.client, message.content, player, message);
        if (message)
            await message.delete().catch(() => { });
    }
}
/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */ 
