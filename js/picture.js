'use strict';

(function () {

  var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');
  var fragment = document.createDocumentFragment();

  var buildPicture = function (data) {
    var picture = pictureTemplate.cloneNode(true);

    var img = picture.querySelector('.picture__img');
    var like = picture.querySelector('.picture__likes');
    var comments = picture.querySelector('.picture__comments');

    img.src = data.url;
    like.textContent = data.likes;
    comments.textContent = data.comments.length;
    picture.dataset.id = data.id;

    return picture;
  };

  var buildPicturesFragment = function (data) {
    data.forEach(function (item) {

      var picture = buildPicture(item);

      fragment.append(picture);
    });

    return fragment;
  };

  window.getPictures = buildPicturesFragment;
})();
