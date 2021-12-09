//Import modules
const { format } = require('date-fns');

module.exports = dateOb => {
    const output = format(dateOb, 'E, MMM d, y');
    return output;
};