const { SlashCommandBuilder } = require('@discordjs/builders');
const trading = require('../trading');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trade')
        .setDescription('Execute a trade')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of trade (buy/sell)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('symbol')
                .setDescription('The symbol to trade')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount to trade')
                .setRequired(true)),
    async execute(interaction) {
        const type = interaction.options.getString('type');
        const symbol = interaction.options.getString('symbol');
        const amount = interaction.options.getInteger('amount');

        const tradeDetails = {
            type,
            symbol,
            amount,
            user: interaction.user.id,
            status: 'open',
            timestamp: new Date().toISOString()
        };

        trading.createTrade(tradeDetails);
        await interaction.reply(`Trade executed: ${type} ${amount} of ${symbol}.`);

        const tradeLog = require('./tradeLog');
        tradeLog(tradeDetails.tradeId, interaction.user.username, type, symbol, amount, tradeDetails.takeProfit, tradeDetails.stopLoss, 'open', tradeDetails.timestamp);

        // After trade close code
        tradeLog(tradeDetails.tradeId, interaction.user.username, 'close', symbol, amount, tradeDetails.takeProfit, tradeDetails.stopLoss, 'closed', new Date().toISOString());
    },
};
