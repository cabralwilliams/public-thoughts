//Test the format util function
// const format = require('./utils/dateFormatter');

// console.log(format(new Date()));
//Import modules
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3050;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/public-thoughts', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('debug', true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
