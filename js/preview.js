'use strict';

(function () {
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

    window.modal.open(bigPicture);
  };

  bigImgClose.addEventListener('click', function () {
    window.modal.close();
  });

  window.showPreview = showBigPicture;
})();
