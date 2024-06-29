const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const { updateLeaderboard } = require('../leaderboard');

const playersPath = path.join(__dirname, '../data/players.json');
const profitAllocationChannelName = 'profit-allocation';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register a new user'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const nickname = interaction.user.username;
        const initialBalance = 100000;

        const players = JSON.parse(fs.readFileSync(playersPath));
        if (players.find(p => p.userId === userId)) {
            await interaction.reply('You are already registered.');
            return;
        }

        players.push({ userId, nickname, balance: initialBalance });
        fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));

        await interaction.reply(`User ${nickname} registered successfully with a balance of ${initialBalance}.`);

        const channel = interaction.client.channels.cache.find(channel => channel.name === profitAllocationChannelName);
        if (channel) {
            await channel.send(`User ${nickname} registered with a balance of ${initialBalance}.`);
        }

        await updateLeaderboard(interaction.client);
    },
};
