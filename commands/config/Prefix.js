import { Command } from '../../structures/index.js';
export default class Prefix extends Command {
    constructor(client) {
        super(client, {
            name: 'prefix',
            description: {
                content: "봇의 접두사 관련 명령어에요",
                examples: ['prefix set', 'prefix reset', 'prefix set !'],
                usage: 'prefix set, prefix reset, prefix set !',
            },
            category: 'general',
            aliases: ['prefix'],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: ['ManageGuild'],
            },
            slashCommand: true,
            options: [
                {
                    name: 'set',
                    description: '봇의 접두사를 설정해요',
                    type: 1,
                    options: [
                        {
                            name: 'prefix',
                            description: '사용하고싶은 접두사를 설정해요',
                            type: 3,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'reset',
                    description: '접두사를 기본 설정으로 되돌려요',
                    type: 1,
                },
            ],
        });
    }
    async run(client, ctx, args) {
        const embed = client.embed().setColor(client.color.main);
        let prefix = (await this.client.prisma.guild.findUnique({
            where: {
                guildId: ctx.guild.id,
            },
        }));
        let subCommand;
        let pre;
        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
            pre = ctx.interaction.options.data[0].options[0]?.value.toString();
        }
        else {
            subCommand = args[0];
            pre = args[1];
        }
        switch (subCommand) {
            case 'set':
                if (!pre) {
                    embed.setDescription(`이 서버의 접두사는 \`${prefix ? prefix.prefix : client.config.prefix}\` 이에요!`);
                    return await ctx.sendMessage({ embeds: [embed] });
                }
                if (pre.length > 3)
                    return await ctx.sendMessage({
                        embeds: [embed.setDescription(`접두사는 3문자보다 길 수 없어요`)],
                    });
                if (!prefix) {
                    prefix = await this.client.prisma.guild.create({
                        data: {
                            guildId: ctx.guild.id,
                            prefix: pre,
                        },
                    });
                    return await ctx.sendMessage({
                        embeds: [embed.setDescription(`이 서버의 접두사는 이제 \`${prefix.prefix}\` 이에요!`)],
                    });
                }
                else {
                    prefix = await this.client.prisma.guild.update({
                        where: {
                            guildId: ctx.guild.id,
                        },
                        data: {
                            prefix: pre,
                        },
                    });
                    return await ctx.sendMessage({
                        embeds: [embed.setDescription(`이 서버의 접두사는 이제 \`${prefix.prefix}\` 이에요!`)],
                    });
                }
            case 'reset':
                if (!prefix)
                    return await ctx.sendMessage({
                        embeds: [embed.setDescription(`이 서버의 접두사는 \`${client.config.prefix}\` 이에요!`)],
                    });
                prefix = await this.client.prisma.guild.update({
                    where: {
                        guildId: ctx.guild.id,
                    },
                    data: {
                        prefix: client.config.prefix,
                    },
                });
                return await ctx.sendMessage({
                    embeds: [embed.setDescription(`이 서버의 접두사는 이제 \`${client.config.prefix}\` 이에요!`)],
                });
        }
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
