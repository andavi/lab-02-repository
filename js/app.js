'use strict';

function Card(obj) {
  this.url = obj.image_url;
  this.title = obj.title;
  this.description = obj.description;
  this.keyword = obj.keyword;
  this.horns = obj.horns;

  allCards.push(this);
}

let allCards = [];
let page = 1;

Card.prototype.render = function() {
  $('main').append('<div class="clone"></div>');
  let $clone = $('div[class="clone"]');

  let template = $('#photo-template').html();

  $clone.html(template);
  $clone.find('h2').text(this.title);
  $clone.find('img').attr('src', this.url);
  $clone.find('p').text(this.description);

  $clone.removeClass('clone');
  $clone.attr('class', this.keyword);
};

Card.prototype.addOptions = function() {
  // make unique options by converting to set and back to array
  let options = allCards.map(c => c.keyword);
  options = new Set(options);
  options = [...options];

  options.forEach(option => {
    $('select').append('<option class = "option"></option>');
    let $option = $('option[class="option"]');
  
    $option.attr('value', option);
    $option.text(option);
  
    $option.removeClass('option');
  });
}

function readJson(filename) {
  $.get(filename, 'json')
    .then(data => {
      data.forEach(o => new Card(o));
    })
    .then(() => {
      allCards.forEach(c => c.render());
      // remove first empty div
      $('#photo-template').hide();
      Card.prototype.addOptions();
    });
}

$('select').on('change', function() {
  let selection = $(this).val();
  if (selection === 'default') {
    $('div').show();
    return;
  }
  $('div').hide();
  $(`div[class="${selection}"`).show();
});

function empty() {
  allCards = [];
  $('main').empty();
  $('select').empty();
  $('select').append('<option value="default">-- Filter by Keyword --</option>');
}

$('#page').on('click', function() {
  if (page === 1) {
    page = 2;
    empty();
    readJson('data/page-2.json');
    $(this).text('Page 1');
  } else {
    page = 1;
    empty();
    readJson('data/page-1.json');
    $(this).text('Page 2');
  }
});

function init() {
  // get data
  // render
}

$(() => readJson('data/page-1.json'));