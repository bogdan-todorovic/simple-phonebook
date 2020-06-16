const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const Person = require("./models/person");

morgan.token("body", (req, res) => {
  if (req.method === "POST")
    return JSON.stringify(req.body)
})

const app = express();
app.use(express.static("build"));
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(cors());

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});

app.get("/api/persons", (req, res) => {
  Person
    .find({})
    .then(people => res.json(people));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) res.json(person);
      res.status(404).end();
    })
    .catch(error => next(error));
});

app.post("/api/persons", (req, res, next) => {
  if (!req.body.name)
    return res.status(400).json({"error": "Name is missing"});

  if (!req.body.number) {
    return res.status(400).json({"error": "Number is missing"});
  }

  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
  });
  
  newPerson
    .save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  Person
    .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true, context: "query" })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person
    .findOneAndDelete({ _id: req.params.id })
    .then(deleted => {
      if (deleted) res.status(204).end();
      res.status(404).end();
    })
    .catch(error => next(error));
});

app.get("/info", (req, res) => {
  Person
    .count()
    .then(count => {
      res.write(`Phonebook has info for ${count} people`);
      res.write(`\n${Date()}`);
      res.end();
    });
  
});

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === "CastError")
    res.status(400).send({ error: "Malformatted id" });
  if (err.name === "ValidationError")
    res.status(400).send({ error: err.message });
  
  next(err);
};
app.use(errorHandler);