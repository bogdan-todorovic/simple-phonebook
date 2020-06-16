const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide password for the mongodb as command line argument");
  process.exit(1);
}

const password = process.argv[2];
const url =
  `mongodb+srv://boskela-mongo:${password}@cluster0-eb4gf.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person
    .find({})
    .then(persons => {
      console.log("Phonebook:");
      persons.forEach(p => console.log(p.name, p.number));
      mongoose.connection.close();
    });
}
else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });

  person
    .save()
    .then(addedPerson => {
      console.log(`Added ${addedPerson.name} ${addedPerson.number} to phonebook`);
      mongoose.connection.close();
    });
}