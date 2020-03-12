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
