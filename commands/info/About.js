import { Command } from '../../structures/index.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
export default class About extends Command {
    constructor(client) {
        super(client, {
            name: 'about',
            description: {
                content: '봇에 관한 정보를 보여줘요',
                examples: ['about'],
                usage: 'about',
            },
            category: 'info',
            aliases: ['ab'],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }
    async run(client, ctx, args) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('웹사이트 보기')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://waclan.net`));
        const embed = this.client
            .embed()
            .setAuthor({
                name: 'WaclanBot',
                iconURL: `https://cdn.discordapp.com/attachments/679225050389544979/1155089851360743485/profile.png`,
            })
            .setThumbnail('https://cdn.discordapp.com/attachments/679225050389544979/1155089851360743485/profile.png')
            .setColor(this.client.color.main)
            .addFields([
                {
                    name: '개발자',
                    value: '[KimPig](https://github.com/KimPig)',
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: `물론 전체 개발은 하지 않았지만요.`,
                    inline: true,
                },
            ]);
        return await ctx.sendMessage({
            content: '',
            embeds: [embed],
            components: [row],
        });
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
