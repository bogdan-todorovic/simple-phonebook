const express = require("express");
const morgan = require("morgan");

morgan.token("body", (req, res) => {
  if (req.method === "POST")
    return JSON.stringify(req.body)
})

const app = express();
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server is up and running.");
});


let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Aden Lovenot",
    "number": "44-44-5323523",
    "id": 3
  }
]

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find(p => p.id === Number(req.params.id));
  
  if (person)
    res.send(person);

  res.status(400).end();
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name)
    return res.status(400).send("Name is missing.");
  
  if (!req.body.number)
    return res.status(400).send("Number is missing.");

  if (!persons.find(p => p.name === req.body.name))
    return res.status(400).send("Name must be unique."); 

  const newPerson = req.body;
  newPerson.id = Math.floor(Math.random() * 10000);
  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.delete("/api/persons/:id", (req, res) => {
  const person = persons.find(p => p.id === Number(req.params.id));
  
  if (!person)
    res.status(400).send("No such person.");

  persons = persons.filter(p => p.id !== Number(req.params.id));
  res.status(204).end();
});

app.get("/info", (req, res) => {
  res.write(`Phonebook has info for ${persons.length} people`);
  res.write(`\n${Date()}`);
  res.end();
});