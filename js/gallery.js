'use strict';

(function () {
  var pictureContainer = document.querySelector('.pictures');
  var posts = [];

  var getRandom = function (min, max) {
    return Math.floor(Math.random() * (max + 1)) + min;
  };

  var randomFilter = function (data) {
    data.forEach(function (post, index, arr) {
      post.randomValue = getRandom(0, arr.length - 1);
    });

    data.sort(function (left, right) {
      return left.randomValue - right.randomValue;
    });
    return data;
  };

  var discussFilter = function (data) {
    data.sort(function (left, right) {
      return right.comments.length - left.comments.length;
    });
    return data;
  };

  var filterMap = {
    'filter-default': function () {
      return posts;
    },
    'filter-random': randomFilter,
    'filter-discussed': discussFilter
  };

  var onErrorLoad = function (message) {
    var div = document.createElement('div');
    div.textContent = message;
    div.style = 'position: fixed; text-align: center; font-size: 20px; line-height: 30px; font-weight: bold; top: 0; left: 0; right: 0; background-color: gold; color: darkblue;';
    document.body.append(div);
  };

  var onSuccessLoad = function (data) {
    data.forEach(function (post, index) {
      post.id = index;
    });

    posts = data.slice();

    pictureContainer.append(window.getPictures(posts));
    showFilters();
  };

  window.backend.load(onSuccessLoad, onErrorLoad);

  pictureContainer.addEventListener('click', function (evt) {
    var pic = evt.target.closest('.picture');

    if (pic) {
      window.showPreview(posts[pic.getAttribute('data-id')]);
    }
  });

  var filterContainer = document.querySelector('.img-filters');
  var filterForm = filterContainer.querySelector('.img-filters__form');

  var showFilters = function () {
    filterContainer.classList.remove('img-filters--inactive');
  };

  filterForm.addEventListener('click', function (evt) {
    var selectedFilter = filterForm.querySelector('.img-filters__button--active');

    if (selectedFilter !== evt.target) {
      selectedFilter.classList.remove('img-filters__button--active');
      selectedFilter = evt.target;
      selectedFilter.classList.add('img-filters__button--active');

      var update = window.debounce(updateGallery);
      update(selectedFilter.getAttribute('id'));
    }
  });

  var updateGallery = function (key) {
    var currentPictures = pictureContainer.querySelectorAll('.picture');

    currentPictures.forEach(function (picture) {
      picture.remove();
    });

    var filtered = getFiltered(key);

    pictureContainer.append(window.getPictures(filtered));
  };

  var getFiltered = function (key) {
    var dataCopy = posts.slice();
    return filterMap[key](dataCopy);
  };
})();
