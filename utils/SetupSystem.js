import { EmbedBuilder } from "discord.js";
import { getButtons } from "./Buttons.js";
function neb(embed, player, client) {
    let iconUrl = client.config.icons[player.current.info.sourceName];
    if (!iconUrl)
        iconUrl = client.user.displayAvatarURL({ extension: 'png', });
    let icon = player.current ? player.current.info.thumbnail : client.config.links.img;
    return embed
        .setAuthor({ name: '재생 중...', iconURL: iconUrl })
        .setDescription(`[${player.current.info.title}](${player.current.info.uri}) by ${player.current.info.author} • \`[${client.utils.formatTime(player.current.info.length)}]\` - <@${player.current.info.requester.id}>`)
        .setImage(icon)
        .setColor(client.color.main);
}
async function setupStart(client, query, player, message) {
    let m;
    const embed = client.embed();
    let n = client.embed().setColor(client.color.main);
    const data = await client.prisma.setup.findFirst({
        where: {
            guildId: message.guild.id,
        },
    });
    try {
        if (data)
            m = await message.channel.messages.fetch({ message: data.messageId, cache: true });
    }
    catch (error) {
        client.logger.error(error);
    }
    if (m) {
        try {
            let res = await client.queue.search(query);
            switch (res.loadType) {
                case 'LOAD_FAILED':
                    await message.channel.send({ embeds: [embed.setColor(client.color.red).setDescription('검색 중 오류가 발생했어요')] }).then((msg) => { setTimeout(() => { msg.delete(); }, 5000); });
                    break;
                case 'NO_MATCHES':
                    await message.channel.send({ embeds: [embed.setColor(client.color.red).setDescription('검색 결과가 없어요')] }).then((msg) => { setTimeout(() => { msg.delete(); }, 5000); });
                    break;
                case 'TRACK_LOADED':
                    const track = player.buildTrack(res.tracks[0], message.author);
                    if (player.queue.length > client.config.maxQueueSize) {
                        await message.channel.send({ embeds: [embed.setColor(client.color.red).setDescription(`대기열에 너무 많은 노래가 있어요 - 최대는 ${client.config.maxQueueSize}곡이에요`)] }).then((msg) => { setTimeout(() => { msg.delete(); }, 5000); });
                        return;
                    }
                    player.queue.push(track);
                    await player.isPlaying();
                    await message.channel.send({ embeds: [embed.setColor(client.color.main).setDescription(`[${res.tracks[0].info.title}](${res.tracks[0].info.uri})를 대기열에 추가했어요!`)] }).then((msg) => { setTimeout(() => { msg.delete(); }, 5000); });
                    neb(n, player, client);
                    if (m)
                        await m.edit({ embeds: [n] }).catch(() => { });
                    break;
                case 'PLAYLIST_LOADED':
                    if (res.length > client.config.maxPlaylistSize) {
                        await message.channel.send({ embeds: [embed.setColor(client.color.red).setDescription(`플레이리스트가 너무 길어요 - 최대는 ${client.config.maxPlaylistSize}곡이에요`)] }).then((msg) => { setTimeout(() => { msg.delete(); }, 5000); });
                        return;
                    }
                    for (const track of res.tracks) {
                        const pl = player.buildTrack(track, message.author);
                        if (player.queue.length > client.config.maxQueueSize) {
                            await message.channel.send({ embeds: [embed.setColor(client.color.red).setDescription(`대기열에 너무 많은 노래가 있어요 - 최대는 ${client.config.maxQueueSize}곡이에요`)] }).then((msg) => { setTimeout(() => { msg.delete(); }, 5000); });
                            return;
                        }
                        player.queue.push(pl);
                    }
                    await player.isPlaying();
                    await message.channel.send({ embeds: [embed.setColor(client.color.main).setDescription(`[플레이리스트 안의 ${res.tracks.length}](${res.tracks[0].info.uri})개의 노래를 대기열에 추가했어요!`)] }).then((msg) => { setTimeout(() => { msg.delete(); }, 5000); });
                    neb(n, player, client);
                    if (m)
                        await m.edit({ embeds: [n] }).catch(() => { });
                    break;
                case 'SEARCH_RESULT':
                    const track2 = player.buildTrack(res.tracks[0], message.author);
                    if (player.queue.length > client.config.maxQueueSize) {
                        await message.channel.send({ embeds: [embed.setColor(client.color.red).setDescription(`대기열에 너무 많은 노래가 있어요 - 최대는 ${client.config.maxQueueSize}곡이에요`)] }).then((msg) => { setTimeout(() => { msg.delete(); }, 5000); });
                        return;
                    }
                    player.queue.push(track2);
                    await player.isPlaying();
                    await message.channel.send({ embeds: [embed.setColor(client.color.main).setDescription(`[${res.tracks[0].info.title}](${res.tracks[0].info.uri})를 대기열에 추가했어요!`)] }).then((msg) => { setTimeout(() => { msg.delete(); }, 5000); });
                    neb(n, player, client);
                    if (m)
                        await m.edit({ embeds: [n] }).catch(() => { });
                    break;
            }
        }
        catch (error) {
            client.logger.error(error);
        }
    }
}
async function trackStart(msgId, channel, player, track, client) {
    let icon = player.current ? player.current.info.thumbnail : client.config.links.img;
    let m;
    try {
        m = await channel.messages.fetch({ message: msgId, cache: true });
    }
    catch (error) {
        client.logger.error(error);
    }
    if (m) {
        let iconUrl = client.config.icons[player.current.info.sourceName];
        if (!iconUrl)
            iconUrl = client.user.displayAvatarURL({ extension: 'png', });
        const embed = client.embed()
            .setAuthor({ name: `재생 중...`, iconURL: iconUrl })
            .setColor(client.color.main)
            .setDescription(`[${track.info.title}](${track.info.uri}) - \`[${client.utils.formatTime(track.info.length)}]\` - <@${track.info.requester.id}>`)
            .setImage(icon);
        await m.edit({
            embeds: [embed],
            components: getButtons().map((b) => {
                b.components.forEach((c) => {
                    c.setDisabled(player && player.current ? false : true);
                });
                return b;
            })
        }).catch(() => { });
    }
    else {
        let iconUrl = client.config.icons[player.current.info.sourceName];
        if (!iconUrl)
            iconUrl = client.user.displayAvatarURL({ extension: 'png', });
        const embed = client.embed()
            .setColor(client.color.main)
            .setAuthor({ name: `재생 중...`, iconURL: iconUrl })
            .setDescription(`[${track.info.title}](${track.info.uri}) - \`[${client.utils.formatTime(track.info.length)}]\` - <@${track.info.requester.id}>`)
            .setImage(icon);
        await channel.send({
            embeds: [embed],
            components: getButtons().map((b) => {
                b.components.forEach((c) => {
                    c.setDisabled(player && player.current ? false : true);
                });
                return b;
            })
        }).then(async (msg) => {
            await client.prisma.setup.update({
                where: {
                    guildId: channel.guild.id,
                },
                data: {
                    messageId: msg.id,
                },
            });
        }).catch(() => { });
    }
}
async function updateSetup(client, guild) {
    let setup = await client.prisma.setup.findUnique({
        where: {
            guildId: guild.id,
        },
    });
    let m;
    if (setup && setup.textId) {
        const textChannel = guild.channels.cache.get(setup.textId);
        if (!textChannel)
            return;
        try {
            m = await textChannel.messages.fetch({ message: setup.messageId, cache: true });
        }
        catch (error) {
            client.logger.error(error);
        }
    }
    if (m) {
        const player = client.queue.get(guild.id);
        if (player && player.current) {
            let iconUrl = client.config.icons[player.current.info.sourceName];
            if (!iconUrl)
                iconUrl = client.user.displayAvatarURL({ extension: 'png', });
            const embed = client.embed()
                .setAuthor({ name: `재생 중...`, iconURL: iconUrl })
                .setColor(client.color.main)
                .setDescription(`[${player.current.info.title}](${player.current.info.uri}) - \`[${client.utils.formatTime(player.current.info.length)}]\` - <@${player.current.info.requester.id}>`)
                .setImage(player.current.info.thumbnail);
            await m.edit({
                embeds: [embed],
                components: getButtons().map((b) => {
                    b.components.forEach((c) => {
                        c.setDisabled(player && player.current ? false : true);
                    });
                    return b;
                })
            }).catch(() => { });
        }
        else {
            const embed = client.embed()
                .setColor(client.color.main)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ extension: 'png', }) })
                .setDescription(`아무것도 재생중이지 않아요!`)
                .setImage(client.config.links.img);
            await m.edit({
                embeds: [embed],
                components: getButtons().map((b) => {
                    b.components.forEach((c) => {
                        c.setDisabled(true);
                    });
                    return b;
                })
            }).catch(() => { });
        }
    }
}
async function buttonReply(int, args, color) {
    const embed = new EmbedBuilder();
    let m;
    if (int.replied) {
        m = await int.editReply({ embeds: [embed.setColor(color).setDescription(args)] }).catch(() => { });
    }
    else {
        m = await int.followUp({ embeds: [embed.setColor(color).setDescription(args)] }).catch(() => { });
    }
    setTimeout(async () => {
        if (int && !int.ephemeral) {
            await m.delete().catch(() => { });
        }
    }, 2000);
}
async function QueueReply(int, args, color) {
    const embed = new EmbedBuilder();
    let m;
    if (int.replied) {
        m = await int.editReply({ embeds: [embed.setColor(color).setDescription(args)] }).catch(() => { });
    }
    else {
        m = await int.followUp({ embeds: [embed.setColor(color).setDescription(args)] }).catch(() => { });
    }
    setTimeout(async () => {
        if (int && !int.ephemeral) {
            await m.delete().catch(() => { });
        }
    }, 10000);
}
async function oops(channel, args) {
    try {
        let embed1 = new EmbedBuilder().setColor("Red").setDescription(`${args}`);
        const m = await channel.send({
            embeds: [embed1],
        });
        setTimeout(async () => await m.delete().catch(() => { }), 12000);
    }
    catch (e) {
        return console.error(e);
    }
}
export { setupStart, trackStart, buttonReply, QueueReply, updateSetup, oops };
/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */ 
