const fs = require('fs');
const logError = (error, commandName) => {
    const errorLog = {
        command: commandName,
        error: error.message,
        stack: error.stack,
        time: new Date().toISOString()
    };
    fs.appendFile('./data/error_log.json', JSON.stringify(errorLog, null, 2) + ',\n', (err) => {
        if (err) console.error('Failed to log error:', err);
    });
};
module.exports = logError;
