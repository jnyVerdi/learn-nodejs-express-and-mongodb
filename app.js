const express = require('express');

const app = express();

app.get('/', (req, res) => {
  // directly send message to client
  // res.status(200).send('Hello from the server side');
  // or send json object
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('Cannot Post to this endpoint');
});

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
