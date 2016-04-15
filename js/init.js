var QUOTES = [
  "I am Bid Bot, hear me roar.",
  "Greetings, human.",
  "Did someone knock?",
  "Bidbot, at your service!",
  "Yo yo yo."
];

jQuery(function($) {
  $('#greeting').html(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
});
