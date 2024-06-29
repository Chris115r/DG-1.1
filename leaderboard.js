const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const path = require('path');

// Paths to JSON files
const playersPath = path.join(__dirname, 'data', 'players.json');
const leaderboardMessageIdPath = path.join(__dirname, 'data', 'leaderboardMessageId.json');

// Helper function to read JSON files
const readJsonFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Helper function to write JSON files
const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Function to sort players by balance in descending order
const sortPlayersByBalance = (players) => {
    return players.sort((a, b) => b.balance - a.balance);
};

// Function to format the leaderboard message
const formatLeaderboardMessage = (sortedPlayers) => {
    let description = '';
    sortedPlayers.forEach((player, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const bold = index < 3 ? '**' : '';
        description += `${medal} ${bold}${player.nickname}${bold} - $${player.balance}\n`;
    });

    const embed = new MessageEmbed()
        .setTitle('Leaderboard')
        .setDescription(description)
        .setFooter(`Last update: ${new Date().toLocaleString('en-US', { timeZone: 'UTC', hour12: true })}`)
        .setColor('#FFD700');
    
    return embed;
};

// Function to update the leaderboard message
const updateLeaderboard = async (client) => {
    const players = readJsonFile(playersPath);
    const sortedPlayers = sortPlayersByBalance(players);

    const leaderboardMessageId = readJsonFile(leaderboardMessageIdPath).id;

    const channel = client.channels.cache.find(channel => channel.name === 'leaderboards');
    if (!channel) return;

    const embed = formatLeaderboardMessage(sortedPlayers);

    if (leaderboardMessageId) {
        try {
            const message = await channel.messages.fetch(leaderboardMessageId);
            if (message) {
                await message.edit({ embeds: [embed] });
                return;
            }
        } catch (error) {
            console.error('Failed to fetch or edit leaderboard message:', error);
        }
    }

    // If no valid message ID, create a new message
    const newMessage = await channel.send({ embeds: [embed] });
    writeJsonFile(leaderboardMessageIdPath, { id: newMessage.id });
};

module.exports = {
    updateLeaderboard,
};
