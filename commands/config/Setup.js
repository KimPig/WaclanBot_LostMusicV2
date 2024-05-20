import { Command } from '../../structures/index.js';
import { ApplicationCommandOptionType, OverwriteType, ChannelType, PermissionFlagsBits } from 'discord.js';
import { getButtons } from '../../utils/Buttons.js';
export default class Setup extends Command {
    constructor(client) {
        super(client, {
            name: 'setup',
            description: {
                content: '봇의 설정을 시작해요',
                examples: ['setup create', 'setup delete', 'setup info'],
                usage: 'setup',
            },
            category: 'config',
            aliases: ['setup'],
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
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks', 'ManageChannels'],
                user: ['ManageGuild'],
            },
            slashCommand: true,
            options: [
                {
                    name: 'create',
                    description: '노래 전용 채널을 만들어요',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'delete',
                    description: '노래 전용 채널을 삭제해요',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'info',
                    description: '노래 전용 채널을 보여줘요',
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ],
        });
    }
    async run(client, ctx, args) {
        if (
            !(await client.prisma.guild.findUnique({
                where: {
                    guildId: ctx.guild.id,
                },
            }))
        ) {
            await client.prisma.guild.create({
                data: {
                    guildId: ctx.guild.id,
                    prefix: client.config.prefix,
                },
            });
        }
        let subCommand;
        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
        }
        else {
            subCommand = args[0];
        }
        const embed = client.embed()
            .setColor(client.color.main);
        switch (subCommand) {
            case 'create':
                const data = await client.prisma.setup.findFirst({
                    where: {
                        guildId: ctx.guild.id,
                    },
                });
                if (data)
                    return ctx.sendMessage({
                        embeds: [{
                                description: "이미 노래 전용 채널이 존재해요",
                                color: client.color.red
                            }]
                    });
                const textChannel = await ctx.guild.channels.create({
                    name: `music-${this.client.user.username}`,
                    type: ChannelType.GuildText,
                    topic: "노래 요청 채널!",
                    permissionOverwrites: [
                        {
                            type: OverwriteType.Member,
                            id: this.client.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ReadMessageHistory]
                        },
                        {
                            type: OverwriteType.Role,
                            id: ctx.guild.roles.everyone.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                        }
                    ]
                });
                const player = this.client.queue.get(ctx.guild.id);
                const image = this.client.config.links.img;
                const desc = player && player.queue && player.current ? `[${player.current.info.title}](${player.current.info.uri})` : '아무것도 재생중이지 않아요!';
                embed.setDescription(desc)
                    .setImage(image);
                await textChannel.send({
                    embeds: [embed],
                    components: getButtons()
                }).then(async (msg) => {
                    await client.prisma.setup.create({
                        data: {
                            guildId: ctx.guild.id,
                            textId: textChannel.id,
                            messageId: msg.id
                        }
                    });
                });
                const embed2 = client.embed()
                    .setColor(client.color.main);
                await ctx.sendMessage({
                    embeds: [embed2.setDescription(`노래 전용 채널이 ${textChannel}에 생성되었어요!`)]
                });
                break;
            case 'delete':
                const data2 = await client.prisma.setup.findFirst({
                    where: {
                        guildId: ctx.guild.id,
                    },
                });
                if (!data2)
                    return ctx.sendMessage({
                        embeds: [{
                                description: "노래 전용 채널이 존재하지 않아요",
                                color: client.color.red
                            }]
                    });
                await client.prisma.setup.delete({
                    where: {
                        guildId: ctx.guild.id
                    }
                });
                await ctx.guild.channels.cache.get(data2.textId).delete().catch(() => { });
                await ctx.sendMessage({
                    embeds: [{
                            description: "노래 전용 채널이 삭제되었어요",
                            color: client.color.main
                        }]
                });
                break;
            case 'info':
                const data3 = await client.prisma.setup.findFirst({
                    where: {
                        guildId: ctx.guild.id,
                    },
                });
                if (!data3)
                    return ctx.sendMessage({
                        embeds: [{
                                description: "노래 전용 채널이 존재하지 않아요",
                                color: client.color.red
                            }]
                    });
                const channel = ctx.guild.channels.cache.get(data3.textId);
                embed.setDescription(`노래 전용 채널은 ${channel}이에요!`)
                    .setColor(client.color.main);
                await ctx.sendMessage({
                    embeds: [embed]
                });
                break;
            default:
                break;
        }
    }
}
;
/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */ 
