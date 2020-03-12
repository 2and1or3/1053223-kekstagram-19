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
var IMG_COUNT = 5;
var MAX_COMMENTS = 5;
var POSTS_COUNT = 25;
var DEFAULT_LEVEL = 100;
var EFFECT_PREVIEW = 'effects__preview--';
var ESC = 'Escape';
var DEFAULT_SETED = 'effects__preview--none';

// var TAGS_LIMIT = 5;
// var MIN_TAG_LENGTH = 1;
// var MAX_TAG_LENGTH = 20;

var posts = [];

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max + 1)) + min;
};

var getRandomComments = function (max) {
  var arr = [];

  for (var i = 0; i <= getRandom(1, max); i++) {
    var comment = {
      avatar: 'img/avatar-' + getRandom(1, IMG_COUNT) + '.svg',
      message: MESSAGES[getRandom(0, MESSAGES.length - 1)],
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

  img.src = data.url;
  like.textContent = data.likes;
  comments.textContent = data.comments.length;

  return picture;
};

posts.forEach(function (item, index) {
  var picture = buildPicture(item);

  picture.setAttribute('data-id', index);

  fragment.append(picture);
});

pictureContainer.append(fragment);

var bigPicture = document.querySelector('.big-picture');
var bigImg = bigPicture.querySelector('.big-picture__img img');
var bigLike = bigPicture.querySelector('.likes-count');
var bigComment = bigPicture.querySelector('.comments-count');
var bigSocial = bigPicture.querySelector('.social__comments');
var bigCaption = bigPicture.querySelector('.social__caption');
var bigImgClose = bigPicture.querySelector('.cancel');

var commentCount = bigPicture.querySelector('.social__comment-count');
var commentLoader = bigPicture.querySelector('.comments-loader');


var createComment = function (data) {
  var item = document.createElement('li');
  var img = document.createElement('img');
  var paragraph = document.createElement('p');

  item.classList.add('social__comment');

  img.classList.add('social__picture');
  img.src = data.avatar;
  img.alt = data.name;
  img.width = 35;
  img.height = 35;

  paragraph.classList.add('social__text');
  paragraph.textContent = data.message;

  item.append(img);
  item.append(paragraph);

  return item;
};

var showBigPicture = function (data) {
  bigImg.src = data.url;
  bigCaption.textContent = data.description;
  bigLike.textContent = data.likes;
  bigComment.textContent = data.comments.length;
  bigSocial.innerHTML = '';

  data.comments.forEach(function (comment) {
    var item = createComment(comment);

    bigSocial.append(item);
  });

  commentCount.classList.add('hidden');
  commentLoader.classList.add('hidden');

  popupOpen(bigPicture);
};

pictureContainer.addEventListener('click', function (evt) {
  var pic = evt.target.closest('.picture');

  if (pic) {
    showBigPicture(posts[pic.getAttribute('data-id')]);
  }
});

bigImgClose.addEventListener('click', function () {
  popupClose();
});

var uploadInput = document.querySelector('#upload-file');
var imgRedactor = document.querySelector('.img-upload__overlay');
var closeRedactor = imgRedactor.querySelector('#upload-cancel');

var onEscPress = function (evt) {
  if (evt.key === ESC && !isFocused()) {
    popupClose();
  }
};

var popupOpen = function (elem) {
  elem.classList.remove('hidden');
  elem.classList.add('js-open');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onEscPress);
};

var popupClose = function () {
  var opened = document.querySelector('.js-open');

  if (opened === imgRedactor) {
    resetRedactor();
  }

  opened.classList.add('hidden');
  opened.classList.remove('js-open');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscPress);
};

uploadInput.addEventListener('change', function () {
  popupOpen(imgRedactor);
});

closeRedactor.addEventListener('click', function () {
  popupClose();
});

var resetRedactor = function () {
  uploadInput.value = '';
  setEffect(DEFAULT_SETED);
  effectsContainer.elements[0].checked = true;
};

var rangeControl = imgRedactor.querySelector('.effect-level__pin');
var effectLevelValue = imgRedactor.querySelector('.effect-level__value');

var effectsContainer = imgRedactor.querySelector('.effects');

var imgPreview = imgRedactor.querySelector('.img-upload__preview img');

var getPercent = function (child) {
  return Math.round((child.offsetLeft / child.offsetParent.offsetWidth) * 100);
};

var setLevelEffect = function (percent) {
  effectLevelValue.value = percent;
};

var seted = DEFAULT_SETED;

var setEffect = function (effect) {
  effect = EFFECT_PREVIEW + effect.slice(7);

  imgPreview.classList.remove(seted);
  seted = effect;
  imgPreview.classList.add(seted);
};

rangeControl.addEventListener('mouseup', function () {
  setLevelEffect(getPercent(rangeControl));
});

effectsContainer.addEventListener('change', function () {
  var selected = effectsContainer.querySelector('input:checked');
  setEffect(selected.id);
  setLevelEffect(DEFAULT_LEVEL);
});


var isFocused = function () {
  var opened = document.querySelector('.js-open');
  var form = opened.closest('form') || opened.querySelector('form');

  if (form) {
    var arr = Array.from(form.elements);
    var filtered = arr.filter(function (elem) {
      return elem.matches('input:not([type=hidden])') &&
             elem.matches('input:not([type=radio])') &&
             elem.matches('input:not([type=checkbox])') &&
             elem.matches('input:not([type=file])') &&
             elem.matches('input:not([type=submit])') &&
             elem.matches('input:not([type=reset])') &&
             elem.matches('input:not([type=button])') &&
             elem.matches('input:not([type=number])') &&
             elem.matches('input:not([disabled])') &&
             elem.matches('input:not([readonly])') ||

             elem.matches('textarea');
    });

    return filtered.some(function (elem) {
      return elem.matches(':focus');
    });
  }

  return false;
};

// var hashInput = imgRedactor.querySelector('.text__hashtags');
// var commentInput = imgRedactor.querySelector('.text__description');

// hashInput.addEventListener('change', function () {
//   var hashtags = this.value.split(' ');
//
//   var validTags = hashtags.filter(function (hash, index, arr) {
//     hash.toLowerCase(); // хэш-теги нечувствительны к регистру
//
//     var isRepeat = arr.indexOf(hash, ++index) !== -1;// один и тот же хэш-тег не может быть использован дважды
//     var isBeginWithHash = hash[0] === '#';// хэш-тег начинается с символа # (решётка)
//     var isInLimits = MIN_TAG_LENGTH < hash.length && hash.length <= MAX_TAG_LENGTH;// хеш-тег не может состоять только из одной решётки //максимальная длина одного хэш-тега 20 символов, включая решётку
//
//     if (isRepeat) {
//       hashInput.setCustomValidity('один и тот же хэш-тег не может быть использован дважды');
//     } else if (!isBeginWithHash) {
//       hashInput.setCustomValidity('хэш-тег начинается с символа # (решётка)');
//     } else if (!isInLimits) {
//       hashInput.setCustomValidity('хеш-тег должен быть длинной от: ' + MIN_TAG_LENGTH + ' до: ' + MAX_TAG_LENGTH + ' символов включительно');
//     }
//
//     return isBeginWithHash && isInLimits && !isRepeat;
//   });
//
//   if (validTags > TAGS_LIMIT) { // нельзя указать больше пяти хэш-тегов;
//     hashInput.setCustomValidity('нельзя указать больше ' + TAGS_LIMIT + 'хэш-тегов');
//   }
// });
