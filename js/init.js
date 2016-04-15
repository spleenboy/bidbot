var QUOTES = [
  "I am Bid Bot, hear me roar.",
  "Greetings, human.",
  "Did someone knock?",
  "Bidbot, at your service!",
  "Yo yo yo.",
  "Hey (is for horses)",
  "Money money money money money. Am I right?"
];

jQuery(function($) {
  var lastQuote = null;
  function swap() {
    var quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    if (quote !== lastQuote) {
      var greet = $('#greeting');
      greet.fadeTo('fast', 0.1, function() {
        greet.html(quote).fadeTo('slow', 1.0);
      });
      lastQuote = quote;
    }
    setTimeout(swap, 5000);
  }

  swap();
});
