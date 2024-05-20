import { Command } from '../../structures/index.js';
export default class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: {
                content: '도움말을 보여줘요',
                examples: ['help'],
                usage: 'help',
            },
            category: 'info',
            aliases: ['h'],
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
            options: [
                {
                    name: 'command',
                    description: '특정 명령어에 대한 도움말을 보여줘요',
                    type: 3,
                    required: false,
                },
            ],
        });
    }
    async run(client, ctx, args) {
        const embed = this.client.embed();
        let prefix = (await this.client.prisma.guild.findUnique({
            where: {
                guildId: ctx.guild.id,
            },
        }));
        if (!prefix) {
            prefix = this.client.config.prefix;
        }
        else {
            prefix = prefix.prefix;
        }
        const commands = this.client.commands.filter((cmd) => cmd.category !== 'dev');
        const categories = commands
            .map((cmd) => cmd.category)
            .filter((value, index, self) => self.indexOf(value) === index);
        if (!args[0]) {
            const fildes = [];
            categories.forEach((category) => {
                fildes.push({
                    name: category,
                    value: commands
                        .filter((cmd) => cmd.category === category)
                        .map((cmd) => `\`${cmd.name}\``)
                        .join(', '),
                    inline: false,
                });
            });
            const helpEmbed = embed
                .setColor(this.client.color.main)
                .setTitle('Help Menu')
                .setDescription(`안녕하세요!, 전 ${this.client.user.username} 이에요. \`${prefix}help <명령어>\` 를 통해 더 자세한 도움말을 볼 수 있어요.`)
                .setFooter({
                text: `${prefix}help <명령어> 를 사용해 더 자세한 도움말을 보세요!`,
            });
            fildes.forEach((field) => helpEmbed.addFields(field));
            ctx.sendMessage({ embeds: [helpEmbed] });
        }
        else {
            const command = this.client.commands.get(args[0].toLowerCase());
            if (!command)
                return ctx.sendMessage({
                    embeds: [client.embed().setColor(client.color.red).setDescription(`\`${args[0]}\` 라는 명령어는 존재하지 않아요.`)],
                });
            const embed = this.client.embed();
            const helpEmbed = embed.setColor(this.client.color.main).setTitle(`Help Menu - ${command.name}`)
                .setDescription(`**설명:** ${command.description.content}
**사용법:** ${prefix}${command.description.usage}
**예시:** ${command.description.examples.map((example) => `${prefix}${example}`).join(', ')}
**쿨타임:** ${command.cooldown} 초
**필요 권한:** ${command.permissions.user.length > 0 ? command.permissions.user.map((perm) => `\`${perm}\``).join(', ') : 'None'}
**봇 권한:** ${command.permissions.client.map((perm) => `\`${perm}\``).join(', ')}
**개발자 전용:** ${command.permissions.dev ? 'Yes' : 'No'}
**슬래쉬 명렁어:** ${command.slashCommand ? 'Yes' : 'No'}`);
            ctx.sendMessage({ embeds: [helpEmbed] });
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
