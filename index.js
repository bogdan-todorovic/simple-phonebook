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

app.get("/api/persons/:id", (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => res.json(person))
    .catch(error => res.status(400).end());
});

app.post("/api/persons", (req, res) => {
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
    .then(savedPerson => res.json(savedPerson));
});

app.delete("/api/persons/:id", (req, res) => {
  Person
    .findOneAndDelete({ _id: req.params.id })
    .then(deleted => res.status(204).end())
    .catch(error => res.status(400).send("Unable to delete."));
});

app.get("/info", (req, res) => {
  res.write(`Phonebook has info for ${persons.length} people`);
  res.write(`\n${Date()}`);
  res.end();
});