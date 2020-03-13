'use strict';

(function () {

  var DEFAULT_LEVEL = 100;
  var EFFECT_PREVIEW = 'effects__preview--';
  var DEFAULT_SETED = 'effects__preview--none';

  // var TAGS_LIMIT = 5;
  // var MIN_TAG_LENGTH = 1;
  // var MAX_TAG_LENGTH = 20;

  var uploadInput = document.querySelector('#upload-file');
  var imgRedactor = document.querySelector('.img-upload__overlay');
  var closeRedactor = imgRedactor.querySelector('#upload-cancel');

  var filtersMap = {
    none: function () {
      return 'none';
    },
    chrome: function (percent) {
      var value = Math.round(percent) / 100;
      return 'grayscale(' + value + ')';
    },
    sepia: function (percent) {
      var value = Math.round(percent) / 100;
      return 'sepia(' + value + ')';
    },
    marvin: function (percent) {
      var value = Math.round(percent);
      return 'invert(' + value + '%)';
    },
    phobos: function (percent) {
      var value = Math.round(percent * 0.03);
      return 'blur(' + value + 'px)';
    },
    heat: function (percent) {
      var value = Math.round(percent * 0.02) + 1;
      return 'brightness(' + value + ')';
    }
  };

  uploadInput.addEventListener('change', function () {
    window.modal.open(imgRedactor);
  });

  closeRedactor.addEventListener('click', function () {
    window.modal.close();
  });

  var resetRedactor = function () {
    uploadInput.value = '';
    setEffect(DEFAULT_SETED);
    effectsContainer.elements[0].checked = true;
    selected = effectsContainer.elements[0];
  };

  var rangeControl = imgRedactor.querySelector('.effect-level__pin');
  var effectLevelValue = imgRedactor.querySelector('.effect-level__value');
  var effectDepth = imgRedactor.querySelector('.effect-level__depth');

  var effectsContainer = imgRedactor.querySelector('.effects');

  var imgPreview = imgRedactor.querySelector('.img-upload__preview img');

  var getPercent = function (child, shift) {
    return ((child.offsetLeft + shift) / child.offsetParent.offsetWidth) * 100;
  };

  var setLevelEffect = function (percent) {
    effectLevelValue.value = Math.round(percent);
    imgPreview.style.filter = filtersMap[selected.value](percent);
  };

  var seted = DEFAULT_SETED;

  var setEffect = function (effect) {
    effect = EFFECT_PREVIEW + effect;

    imgPreview.classList.remove(seted);
    seted = effect;
    imgPreview.classList.add(seted);
  };

  var selected = effectsContainer.querySelector('input:checked');

  effectsContainer.addEventListener('change', function () {
    selected = effectsContainer.querySelector('input:checked');
    setEffect(selected.value);
    setLevelEffect(DEFAULT_LEVEL);
  });


  rangeControl.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startX = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = moveEvt.clientX - startX;
      var percent = getPercent(rangeControl, shift);


      if (percent >= 0 && percent <= 100) {
        rangeControl.style.left = percent + '%';
        effectDepth.style.width = percent + '%';
        setLevelEffect(percent);
        startX += shift;
      }

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);

    window.addEventListener('mouseup', onMouseUp);
  });


  // ///////////////////////////////////////////////////////////////////
  // //далее идет валидация инпутов - это модуль form

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

  window.form = {
    imgRedactor: imgRedactor,
    resetRedactor: resetRedactor
  };
})();
