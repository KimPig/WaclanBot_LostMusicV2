import { Command } from '../../structures/index.js';
import os from 'os';
import { version } from 'discord.js';
export default class Info extends Command {
    constructor(client) {
        super(client, {
            name: 'info',
            description: {
                content: '봇을 운영하는 서버에 대한 정보를 보여줘요',
                examples: ['info'],
                usage: 'info',
            },
            category: 'info',
            aliases: ['botinfo', 'bi'],
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
        const osType = os.type();
        const osRelease = os.release();
        const osUptime = os.uptime();
        const osHostname = os.hostname();
        const cpuArch = os.arch();
        const cpuCores = os.cpus().length;
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const nodeVersion = process.version;
        const discordJsVersion = version;
        const botGuilds = client.guilds.cache.size;
        const botChannels = client.channels.cache.size;
        const botUsers = client.users.cache.size;
        const botCommands = client.commands.size;
        const botInfo = `Bot Information:
- **서버 OS**: ${osType} ${osRelease}
- **업타임**: ${client.utils.formatTime(osUptime)}
- **서버 호스트 이름**: ${osHostname}
- **CPU 아키텍쳐**: ${cpuArch} (${cpuCores} cores)
- **사용중인 램**: ${client.utils.formatBytes(usedMem)} / ${client.utils.formatBytes(totalMem)} (${Math.round((usedMem / totalMem) * 100)}%)
- **Node.js 버전**: ${nodeVersion}
- **Discord.js 버전**: ${discordJsVersion}
- **사용중인 서버** ${botGuilds} 서버, ${botChannels} 채널, ${botUsers} 유저
- **총 명령어 수**: ${botCommands}
  `;
        const embed = this.client.embed();
        return ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription(botInfo)],
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
