const express = require('express');
const path = require('path');

const app = express();

app.use(express.json({ extended: false }));

app.use('/spotify', require('./routes/api/spotify'));

const pathToStatic = __dirname + '/client/build/';

app.use(express.static(pathToStatic));

app.get('*', function (req,res) {
  res.sendFile(pathToStatic + "index.html");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
