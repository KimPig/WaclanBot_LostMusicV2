import { Event } from '../../structures/index.js';
import { buttonReply, QueueReply } from '../../utils/SetupSystem.js';
export default class SetupButtons extends Event {
    constructor(client, file) {
        super(client, file, {
            name: 'setupButtons',
        });
    }
    async run(interaction) {
        if (!interaction.replied)
            await interaction.deferReply().catch(() => { });
        if (!interaction.member.voice.channel)
            return await buttonReply(interaction, `통화방에 연결되어 있어야 조작할 수 있어요`, this.client.color.red);
        if (interaction.guild.members.cache.get(this.client.user.id).voice.channel && interaction.guild.members.cache.get(this.client.user.id).voice.channelId !== interaction.member.voice.channelId)
            return await buttonReply(interaction, `${interaction.guild.me.voice.channel}에 연결되어 있어야 조작할 수 있어요`, this.client.color.red);
        const player = this.client.queue.get(interaction.guildId);
        if (!player)
            return await buttonReply(interaction, `재생중인 노래가 없어요`, this.client.color.red);
        if (!player.queue)
            return await buttonReply(interaction, `재생중인 노래가 없어요`, this.client.color.red);
        if (!player.current)
            return await buttonReply(interaction, `재생중인 노래가 없어요`, this.client.color.red);
        const data = await this.client.prisma.setup.findUnique({
            where: {
                guildId: interaction.guildId,
            },
        });
        const { title, uri, length } = player.current.info;
        let message;
        try {
            message = await interaction.channel.messages.fetch(data.messageId, { cache: true });
        }
        catch (e) { }
        ;
        const icon = player ? player.current.info.thumbnail : this.client.user.displayAvatarURL({ extension: 'png' });
        let iconUrl = this.client.config.icons[player.current.info.sourceName];
        if (!iconUrl)
            iconUrl = this.client.user.displayAvatarURL({ extension: 'png' });
        const embed = this.client.embed()
            .setAuthor({ name: `재생 중...`, iconURL: iconUrl })
            .setDescription(`[${title}](${uri}) - ${player.current.info.isStream ? 'LIVE' : this.client.utils.formatTime(length)} - <@${player.current.info.requester.id}>`)
            .setImage(icon);
        if (message) {
            switch (interaction.customId) {
                case 'LOW_VOL_BUT':
                    const vol = player.volume * 100 - 10;
                    player.player.setVolume(vol / 100);
                    await buttonReply(interaction, `음량이 ${vol.toFixed()}%로 설정되었어요`, this.client.color.main);
                    await message.edit({ embeds: [embed.setFooter({ text: `음량: ${vol.toFixed()}%`, iconURL: interaction.member.displayAvatarURL({}) })] });
                    break;
                case 'HIGH_VOL_BUT':
                    const vol2 = player.volume * 100 + 10;
                    player.player.setVolume(vol2 / 100);
                    await buttonReply(interaction, `음량이 ${vol2.toFixed()}%로 설정되었어요`, this.client.color.main);
                    await message.edit({ embeds: [embed.setFooter({ text: `음량: ${vol2.toFixed()}%`, iconURL: interaction.member.displayAvatarURL({}) })] });
                    break;
                case 'PAUSE_BUT':
                    const name = player.player.paused ? `재생` : `일시 중지`;
                    player.pause();
                    await buttonReply(interaction, `노래를 ${name}했어요`, this.client.color.main);
                    await message.edit({ embeds: [embed.setFooter({ text: `${interaction.member.displayName}님이 노래를 ${name}했어요`, iconURL: interaction.member.displayAvatarURL({}) })] });
                    break;
                case 'SKIP_BUT':
                    if (player.queue.length === 0)
                        return await buttonReply(interaction, `다음 노래가 없어요`, this.client.color.main);
                    player.skip();
                    await buttonReply(interaction, `${interaction.member.displayName}님이 다음 노래를 틀었어요`, this.client.color.main);
                    break;
                case 'STOP_BUT':
				    player.stop();
                    await buttonReply(interaction, `${interaction.member.displayName}님이 노래를 멈췄어요`, this.client.color.main);
                    break;
                case 'LOOP_BUT':
                    const random = ["off", "queue", "repeat"];
                    const loop = random[Math.floor(Math.random() * random.length)];
                    if (player.loop === loop)
                        return await buttonReply(interaction, `Loop is already ${player.loop}.`, this.client.color.main);
                    player.setLoop(loop);
                    await buttonReply(interaction, `Loop set to ${player.loop}.`, this.client.color.main);
                    await message.edit({ embeds: [embed.setFooter({ text: `Loop set to ${player.loop} by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL({}) })] });
                    break;
                case 'SHUFFLE_BUT':
                    player.setShuffle(player.shuffle ? false : true);
                    await buttonReply(interaction, `셔플이 ${player.shuffle ? `켜졌어요` : `꺼졌어요`}`, this.client.color.main);
                    await message.edit({ embeds: [embed.setFooter({ text: `${interaction.member.displayName}님이 셔플을 ${player.shuffle ? `켰어요` : `껐어요`} `, iconURL: interaction.member.displayAvatarURL({}) })] });
                    break;
                case 'PREV_BUT':
                    if (!player.previous)
                        return await buttonReply(interaction, `이전 노래가 없어요`, this.client.color.main);
                    player.previousTrack();
                    await buttonReply(interaction, `${interaction.member.displayName}님이 이전 노래를 틀었어요`, this.client.color.main);
                    break;
                case 'REWIND_BUT':
                    const time = player.player.position - 10000;
                    if (time < 0)
                        return await buttonReply(interaction, `더 이전으로 되돌릴 수 없어요`, this.client.color.main);
                    player.seek(time);
                    await buttonReply(interaction, `10초 전으로 되돌렸어요`, this.client.color.main);
                    await message.edit({ embeds: [embed.setFooter({ text: `${interaction.member.displayName}님이 노래를 10초 전으로 되돌렸어요`, iconURL: interaction.member.displayAvatarURL({}) })] });
                    break;
                case 'FORWARD_BUT':
                    const time2 = player.player.position + 10000;
                    if (time2 > player.current.info.length)
                        return await buttonReply(interaction, `더 앞으로 돌릴수 없어요`, this.client.color.main);
                    player.seek(time2);
                    await buttonReply(interaction, `10초 뒤로 건너뛰었어요`, this.client.color.main);
                    await message.edit({ embeds: [embed.setFooter({ text: `${interaction.member.displayName}님이 노래를 10초 뒤로 건너뛰었어요`, iconURL: interaction.member.displayAvatarURL({}) })] });
                    break;
				case 'QUEUE_BUT':
					const queuePlayer = this.client.queue.get(interaction.guildId);
					const prefixText = `재생 중: [${queuePlayer.current.info.title}](${queuePlayer.current.info.uri}) - <@${queuePlayer.current?.info.requester.id}> - 길이: ${queuePlayer.current.info.isStream ? 'LIVE' : this.client.utils.formatTime(queuePlayer.current.info.length)}`;
					if (!queuePlayer || queuePlayer.queue.length === 0) {
						await QueueReply(interaction, prefixText, this.client.color.main);
					} else {
						const queueSlice = player.queue.slice(0, 10);
						const remainingQueueCount = Math.max(player.queue.length - 10, 0);
						const remainingQueueText = remainingQueueCount > 0 ? `외 ${remainingQueueCount}개의 노래가 대기열에 있어요` : '';
						const queue = queueSlice.map((track, index) => `${index + 1}. [${track.info.title}](${track.info.uri}) - <@${track?.info.requester.id}> - 길이: ${track.info.isStream ? 'LIVE' : this.client.utils.formatTime(track.info.length)}`);
						
						const embedText = `${prefixText}\n\n${queue.join('\n')}${remainingQueueText ? `\n\n${remainingQueueText}` : ''}`;
						await QueueReply(interaction, embedText, this.client.color.main);
					}
					break;
                default:
                    await buttonReply(interaction, `사용 불가능한 버튼이에요.`, this.client.color.main);
                    break;
            }
        }
    }
}
