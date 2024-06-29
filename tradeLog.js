const fs = require('fs');
const tradeLog = (tradeId, user, type, symbol, amount, takeProfit, stopLoss, status, time) => {
    const logEntry = {
        tradeId,
        user,
        type,
        symbol,
        amount,
        takeProfit,
        stopLoss,
        status,
        time
    };
    fs.appendFile('./data/trade_log.json', JSON.stringify(logEntry, null, 2) + ',\n', (err) => {
        if (err) console.error('Failed to log trade:', err);
    });
};
module.exports = tradeLog;
