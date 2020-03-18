'use strict';

(function () {
  var COMMENTS_RANGE = 5;
  var IMG_WIDTH = 35;
  var IMG_HEIGHT = 35;
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
    img.width = IMG_WIDTH;
    img.height = IMG_HEIGHT;

    paragraph.classList.add('social__text');
    paragraph.textContent = data.message;

    item.append(img);
    item.append(paragraph);

    return item;
  };

  var showComments = function () {};

  var getCommentsLoader = function (data) {
    var lastIndex = 0;
    var length = data.comments.length;

    return function () {
      bigSocial.innerHTML = '';

      for (var i = lastIndex; (i < length) && i < (lastIndex + COMMENTS_RANGE); i++) {
        var item = createComment(data.comments[i]);

        bigSocial.append(item);
      }

      lastIndex += COMMENTS_RANGE;

      if (lastIndex >= data.comments.length) {
        commentLoader.classList.add('hidden');
        commentLoader.removeEventListener('click', showComments);
        commentCount.firstChild.data = data.comments.length + ' из ';
      } else {
        commentLoader.classList.remove('hidden');
        commentCount.firstChild.data = lastIndex + ' из ';
      }
    };
  };

  var showBigPicture = function (data) {
    bigImg.src = data.url;
    bigCaption.textContent = data.description;
    bigLike.textContent = data.likes;
    bigComment.textContent = data.comments.length;

    showComments = getCommentsLoader(data);

    showComments();

    commentLoader.addEventListener('click', showComments);

    window.modal.open(bigPicture);
  };

  bigImgClose.addEventListener('click', function () {
    window.modal.close();
    commentLoader.removeEventListener('click', showComments);
  });

  window.showPreview = showBigPicture;
})();
