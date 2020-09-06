const express = require('express');
const mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');
const kittyRoute = require('./routers/Routes.js');
const app = express();
app.use(express.json())



app.use(kittyRoute);
mongoose.connect('mongodb+srv://testboy:mongo123@cluster0.iqq5a.mongodb.net/Cluster0?retryWrites=true&w=majority', {useNewUrlParser: true});


const db = mongoose.connection;
autoIncrement.initialize(db);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connection Successful!");
});

app.listen(4000, () => { console.log('Server is running...') });


