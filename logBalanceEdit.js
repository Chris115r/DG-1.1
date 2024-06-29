const logBalanceEdit = (admin, trader, amount) => {
    const logMessage = `Admin ${admin} has edited Trader ${trader}'s balance amount: ${amount}`;
    const profitAllocationChannel = client.channels.cache.find(channel => channel.name === 'profit-allocation');
    if (profitAllocationChannel) {
        profitAllocationChannel.send(logMessage);
    }
};
module.exports = logBalanceEdit;
