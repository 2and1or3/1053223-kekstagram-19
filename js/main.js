'use strict';

var MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var NAMES = ['Андрей', 'Татьяна', 'Николай', 'Константин', 'Анастасия', 'Мария'];
var IMG_COUNT = 6;
var MAX_COMMENTS = 5;
var POSTS_COUNT = 25;

var posts = [];

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max + 1)) + min;
};

var getRandomComments = function (max) {
  var arr = [];

  for (var i = 0; i <= getRandom(1, max); i++) {
    var comment = {
      avatar: 'img/avatar-' + getRandom(0, IMG_COUNT) + '.svg',
      message: MESSAGES[getRandom(0, NAMES.length - 1)],
      name: NAMES[getRandom(0, NAMES.length - 1)]
    };
    arr.push(comment);
  }

  return arr;
};

for (var i = 1; i <= POSTS_COUNT; i++) {
  var post = {
    url: 'photos/' + i + '.jpg',
    description: 'description',
    likes: getRandom(15, 200),
    comments: getRandomComments(MAX_COMMENTS)
  };

  posts.push(post);
}

var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

var pictureContainer = document.querySelector('.pictures');
var fragment = document.createDocumentFragment();

var buildPicture = function (data) {
  var picture = pictureTemplate.cloneNode(true);

  var img = picture.querySelector('.picture__img');
  var like = picture.querySelector('.picture__likes');
  var comments = picture.querySelector('.picture__comments');

  img.src = '' + data.url;
  like.textContent = data.likes;
  comments.textContent = data.comments.length;

  return picture;
};

posts.forEach(function (item) {
  var picture = buildPicture(item);
  fragment.append(picture);
});

pictureContainer.append(fragment);
