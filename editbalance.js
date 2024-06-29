const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const { updateLeaderboard } = require('../leaderboard');

const playersPath = path.join(__dirname, '../data/players.json');
const profitAllocationChannelName = 'profit-allocation';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editbalance')
        .setDescription('Edit a user\'s balance')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user whose balance you want to edit')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount to edit the balance by')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const amount = interaction.options.getInteger('amount');

        const players = JSON.parse(fs.readFileSync(playersPath));
        const player = players.find(p => p.userId === target.id);

        if (player) {
            player.balance += amount;
            fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));

            await interaction.reply(`User ${target.username}'s balance updated by ${amount}. New balance: ${player.balance}.`);

            const channel = interaction.client.channels.cache.find(channel => channel.name === profitAllocationChannelName);
            if (channel) {
                await channel.send(`Admin ${interaction.user.username} edited ${target.username}'s balance by ${amount}. New balance: ${player.balance}.`);
            }

            await updateLeaderboard(interaction.client);
        } else {
            await interaction.reply('User not found.');
        }
    },
};
