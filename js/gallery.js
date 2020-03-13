'use strict';

(function () {
  var pictureContainer = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  var posts = [];

  var onErrorLoad = function (message) {
    var div = document.createElement('div');
    div.textContent = message;
    div.style = 'position: fixed; text-align: center; font-size: 20px; line-height: 30px; font-weight: bold; top: 0; left: 0; right: 0; background-color: gold; color: darkblue;';
    document.body.append(div);
  };

  var onSuccessLoad = function (data) {
    data.forEach(function (item, index) {

      var picture = window.buildPicture(item);

      picture.setAttribute('data-id', index);

      fragment.append(picture);
    });

    posts = data.slice();
    pictureContainer.append(fragment);
  };

  window.backend(onSuccessLoad, onErrorLoad);

  pictureContainer.addEventListener('click', function (evt) {
    var pic = evt.target.closest('.picture');

    if (pic) {
      window.showPreview(posts[pic.getAttribute('data-id')]);
    }
  });

})();
