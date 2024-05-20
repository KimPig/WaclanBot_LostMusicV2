import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
function getButtons() {
    let pausebut = new ButtonBuilder()
        .setCustomId(`PAUSE_BUT`)
        .setEmoji("<:pause:1154410027600322582>" )
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let previousbut = new ButtonBuilder()
        .setCustomId(`PREV_BUT`)
        .setEmoji("<:prev:1154805750879760465>" )
		.setLabel('이전 곡')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let skipbut = new ButtonBuilder()
        .setCustomId(`SKIP_BUT`)
        .setEmoji("<:skip:1154410198237200394>" )
		.setLabel('다음 곡')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let highvolumebut = new ButtonBuilder()
        .setCustomId(`HIGH_VOL_BUT`)
        .setEmoji("<:volumeup:1154807747670446121>" )
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let lowvolumebut = new ButtonBuilder()
        .setCustomId(`LOW_VOL_BUT`)
        .setEmoji("<:volumedown:1154807736261955676>" )
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let forwardbut = new ButtonBuilder()
        .setCustomId(`FORWARD_BUT`)
        .setEmoji("<:forward:1154805984410210386>")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let stopbut = new ButtonBuilder()
        .setCustomId(`STOP_BUT`)
        .setEmoji("<:stop:1154410048953524284>" )
		.setLabel('정지')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let loopbut = new ButtonBuilder()
        .setCustomId(`LOOP_BUT`)
        .setEmoji(":loop:1154410921813364766>" )
		.setLabel('반복')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let shufflebut = new ButtonBuilder()
        .setCustomId(`SHUFFLE_BUT`)
        .setEmoji("<:shuffle:1154411274436890727>" )
		.setLabel('셔플')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let rewindbut = new ButtonBuilder()
        .setCustomId(`REWIND_BUT`)
        .setEmoji("<:rewind:1154806045336666123>" )
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
	let queuebut = new ButtonBuilder()
        .setCustomId(`QUEUE_BUT`)
        .setEmoji("<:queue:1154425214634041467>" )
		.setLabel('대기열')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);
    let row = new ActionRowBuilder().addComponents(lowvolumebut, previousbut, pausebut, skipbut, highvolumebut);
    let row2 = new ActionRowBuilder().addComponents(rewindbut, queuebut, stopbut, shufflebut, forwardbut);
    return [row, row2];
}
export { getButtons };
