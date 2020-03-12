'use strict';

(function () {

  var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');

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

  window.buildPicture = buildPicture;

})();
