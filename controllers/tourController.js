const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }
  next();
};

// checkBody middleware for post request, if body not contain name and price property send 400
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'name or price is requires' });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

exports.getTourById = (req, res) => {
  // chaining parameter => /app/v1/tours/:id/:else/:else
  // optional parameter => /app/v1/tours/:id/:else?
  const id = req.params.id * 1;
  const tour = tours.find((element) => element.id === id);

  res.status(200).json({ status: 'success', data: { tour } });
};

exports.createNewTour = (req, res) => {
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

exports.updateTourById = (req, res) => {
  res.status(200).json({ status: 'success', data: { tour: '<tour updated>' } });
};

exports.deleteTourById = (req, res) => {
  res.status(204).json({ status: 'success', data: { tour: 'null' } });
};
