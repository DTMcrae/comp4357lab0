class Messages {
  constructor() {
    this.greeting =
      "Hello %1, it's a beautiful day today. Server current date and time is";
    this.fileNotFound = "File not found";
  }

  getGreeting(name) {
    return this.greeting.replace("%1", name);
  }
}

module.exports = new Messages();
