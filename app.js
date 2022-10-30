const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString;
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res
    .status(200)
    .json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: { tours },
    });
};

const getTourById = (req, res) => {
  // chaining parameter => /app/v1/tours/:id/:else/:else
  // optional parameter => /app/v1/tours/:id/:else?
  const id = req.params.id * 1;
  const tour = tours.find((element) => element.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }

  res.status(200).json({ status: 'success', data: { tour } });
};

const createNewTour = (req, res) => {
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
};

const updateTourById = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }
  res.status(200).json({ status: 'success', data: { tour: '<tour updated>' } });
};

const deleteTourById = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }
  res.status(204).json({ status: 'success', data: { tour: 'null' } });
};

// app.get('/app/v1/tours', getAllTours);
// app.get('/app/v1/tours/:id', getTourById);
// app.post('/app/v1/tours', createNewTour);
// app.patch('/api/v1/tours/:id', updateTourById);
// app.delete('/api/v1/tours/:id', deleteTourById);

// refactoring route above into new syntactic sugar below
app.route('/api/v1/tours').get(getAllTours).post(createNewTour);
app
  .route('/api/v1/tours')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
