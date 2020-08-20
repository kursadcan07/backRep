const express = require('express');
const mongoose = require('mongoose');
const foodRouter = require('./routers/foodRoutes.js');

const app = express();
app.use(express.json()); // Make sure it comes back as json
const uri = "mongodb+srv://testboy:mongo123@cluster0.iqq5a.mongodb.net/Cluster0?retryWrites=true&w=majority";

mongoose.connect(uri, {
    useNewUrlParser: true
});
app.use(foodRouter);



app.listen(3000, () => { console.log('Server is running...') });


