const express = require('express');
const app = express();
const port = 3000;

const controller = require('./controller');

app.use(express.json());

app.get('/topPosts', controller.topThreePosts);
app.get('/search', controller.search);


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));