const express = require('express');
const mongoose = require('mongoose');
const users = require('./routers/api/users');
const profile = require('./routers/api/profile');
const posts = require('./routers/api/posts');
const app = express();

//DB CONFIGURATION
const db = require('./config/keys').mongoURI;

//CONNECT TO MONGODB
mongoose.connect(db)
    .then(()=>console.log('MONGODB CONNECTED'))
    .catch(error=>console.log(error));

app.get('/', (req, res)=>{
    res.send('hello');
})

//ROUTES
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});