const express = require('express');
const fs = require('fs');
const { ppid } = require('process');

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//   // directly send message to client
//   // res.status(200).send('Hello from the server side');
//   // or send json object
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('Cannot Post to this endpoint');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/app/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
});

app.get('/app/v1/tours/:id', (req, res) => {
  // chaining parameter => /app/v1/tours/:id/:else/:else
  // optional parameter => /app/v1/tours/:id/:else?
  const id = req.params.id * 1;
  const tour = tours.find((element) => element.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }

  res.status(200).json({ status: 'success', data: { tour } });
});

app.post('/app/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }
  res.status(200).json({ status: 'success', data: { tour: '<tour updated>' } });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }
  res.status(204).json({ status: 'success', data: { tour: 'null' } });
});

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
