class Messages {
  constructor() {
    this.wordNotFound =
      "Request#%1, word %2 not found";
  }

  wordNotFound(num, word) {
    let result = this.greeting.replace("%1", num);
    return result.replace("%2", word);
  }
}

module.exports = new Messages();
