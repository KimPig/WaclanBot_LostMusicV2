import { Command } from '../../structures/index.js';
export default class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: {
                content: "핑을 표시해요",
                examples: ['ping'],
                usage: 'ping',
            },
            category: 'general',
            aliases: ['pong'],
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
        const msg = await ctx.sendDeferMessage('Pinging...');
        const embed = client
            .embed()
            .setAuthor({ name: 'Pong', iconURL: this.client.user.displayAvatarURL() })
            .setColor(this.client.color.main)
            .addFields([
            {
                name: '봇 지연율',
                value: `\`\`\`ini\n[ ${msg.createdTimestamp - ctx.createdTimestamp}ms ]\n\`\`\``,
                inline: true,
            },
            {
                name: 'API 지연율',
                value: `\`\`\`ini\n[ ${Math.round(ctx.client.ws.ping)}ms ]\n\`\`\``,
                inline: true,
            },
        ])
            .setFooter({
            text: `Requested by ${ctx.author.tag}`,
            iconURL: ctx.author.avatarURL({}),
        })
            .setTimestamp();
        return await ctx.editMessage({ content: '', embeds: [embed] });
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
