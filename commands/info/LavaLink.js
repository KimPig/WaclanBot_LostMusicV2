import { Command } from '../../structures/index.js';
export default class LavaLink extends Command {
    constructor(client) {
        super(client, {
            name: 'lavalink',
            description: {
                content: 'Lavalink 상태를 보여줘요',
                examples: ['lavalink'],
                usage: 'lavalink',
            },
            category: 'info',
            aliases: ['ll'],
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
        });
    }
    async run(client, ctx) {
        const embed = this.client.embed();
        embed.setTitle("Lavalink Stats");
        embed.setColor(this.client.color.main);
        embed.setThumbnail(this.client.user.avatarURL({}));
        embed.setTimestamp();
        client.shoukaku.nodes.forEach((node) => {
            try {
                embed.addFields({ name: "이름", value: `${node.name} (${node.stats ? "🟢" : "🔴"})` });
                embed.addFields({ name: "사용중인 서버", value: `${node.stats.players}` });
                embed.addFields({ name: "사용중인 플레이어", value: `${node.stats.playingPlayers}` });
                embed.addFields({ name: "업타임", value: `${client.utils.formatTime(node.stats.uptime)}` });
                embed.addFields({ name: "코어 수", value: `${node.stats.cpu.cores + " Core(s)"}` });
                embed.addFields({ name: "사용중인 램", value: `${client.utils.formatBytes(node.stats.memory.used)}/${client.utils.formatBytes(node.stats.memory.reservable)}` });
                embed.addFields({ name: "시스템 로드율", value: `${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%` });
                embed.addFields({ name: "Lavalink 로드율", value: `${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%` });
            }
            catch (e) {
                console.log(e);
            }
        });
        return await ctx.sendMessage({ embeds: [embed] });
    }
}
