'use strict';

(function () {
  var pictureContainer = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  window.data.forEach(function (item, index) {
    var picture = window.buildPicture(item);

    picture.setAttribute('data-id', index);

    fragment.append(picture);
  });

  pictureContainer.append(fragment);

  pictureContainer.addEventListener('click', function (evt) {
    var pic = evt.target.closest('.picture');

    if (pic) {
      window.showPreview(window.data[pic.getAttribute('data-id')]);
    }
  });

})();
