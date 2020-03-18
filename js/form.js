'use strict';

(function () {

  var DEFAULT_LEVEL = 100;
  var EFFECT_PREVIEW = 'effects__preview--';
  var DEFAULT_EFFECT = 'effects__preview--none';

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var MAX_SCALE = 100;
  var MIN_SCALE = 25;
  var SCALE_STEP = 25;
  var INITIAL_SCALE = 100;

  var TAGS_LIMIT = 5;
  var MIN_TAG_LENGTH = 1;
  var MAX_TAG_LENGTH = 20;

  var MAX_FILTER_PHOBOS = 0.03;
  var MAX_FILTER_HEAT = 0.02;

  var uploadInput = document.querySelector('#upload-file');
  var imgRedactor = document.querySelector('.img-upload__overlay');
  var closeRedactor = imgRedactor.querySelector('#upload-cancel');
  var previewRedactor = imgRedactor.querySelector('.img-upload__preview img');


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
      var value = Math.round(percent * MAX_FILTER_PHOBOS);
      return 'blur(' + value + 'px)';
    },
    heat: function (percent) {
      var value = Math.round(percent * MAX_FILTER_HEAT) + 1;
      return 'brightness(' + value + ')';
    }
  };

  uploadInput.addEventListener('change', function () {
    var file = uploadInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        previewRedactor.src = reader.result;
      });

      reader.readAsDataURL(file);
    }

    window.modal.open(imgRedactor);
  });

  closeRedactor.addEventListener('click', function () {
    window.modal.close();
  });

  var scale = imgRedactor.querySelector('.scale');
  var scaleInput = scale.querySelector('.scale__control--value');
  var scaleToBigger = scale.querySelector('.scale__control--bigger');
  var scaleToSmaller = scale.querySelector('.scale__control--smaller');

  var setScale = function (percent) {
    imgPreview.style.transform = 'scale(' + percent / 100 + ')';
    scaleInput.value = percent + '%';
  };

  var onScaleBig = function () {
    var currentScale = parseInt(scaleInput.value, 10);

    if (currentScale < MAX_SCALE) {
      currentScale += SCALE_STEP;
      setScale(currentScale);
    }
  };

  var onScaleSmall = function () {
    var currentScale = parseInt(scaleInput.value, 10);

    if (currentScale > MIN_SCALE) {
      currentScale -= SCALE_STEP;
      setScale(currentScale);
    }
  };

  scaleToBigger.addEventListener('click', onScaleBig);

  scaleToSmaller.addEventListener('click', onScaleSmall);


  var resetRedactor = function () {
    uploadInput.value = '';
    hashInput.value = '';
    commentInput.value = '';
    effectsContainer.querySelector('#effect-none').checked = true;
    rangeContainer.classList.add('hidden');
    setEffect(DEFAULT_EFFECT);
    setLevelEffect(DEFAULT_LEVEL);
    setScale(INITIAL_SCALE);
  };


  var rangeContainer = imgRedactor.querySelector('.effect-level');
  var rangeControl = imgRedactor.querySelector('.effect-level__pin');
  var effectLevelValue = imgRedactor.querySelector('.effect-level__value');
  var effectDepth = imgRedactor.querySelector('.effect-level__depth');

  var effectsContainer = imgRedactor.querySelector('.effects');

  var imgPreview = imgRedactor.querySelector('.img-upload__preview img');

  var getPercent = function (child, shift) {
    return ((child.offsetLeft + shift) / child.offsetParent.offsetWidth) * 100;
  };

  var setLevelEffect = function (percent) {
    var selected = effectsContainer.querySelector('input:checked');
    effectLevelValue.value = Math.round(percent);
    imgPreview.style.filter = filtersMap[selected.value](percent);
    rangeControl.style.left = percent + '%';
    effectDepth.style.width = percent + '%';
  };

  var selectedEffect = DEFAULT_EFFECT;

  var setEffect = function (effect) {
    effect = EFFECT_PREVIEW + effect;

    imgPreview.classList.remove(selectedEffect);
    selectedEffect = effect;
    imgPreview.classList.add(selectedEffect);
  };

  effectsContainer.addEventListener('change', function () {
    var selected = effectsContainer.querySelector('input:checked');

    if (effectsContainer.querySelector('#effect-none') === selected) {
      rangeContainer.classList.add('hidden');
    } else {
      rangeContainer.classList.remove('hidden');
    }

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


  var main = document.querySelector('main');

  var createMessageTemplate = function (type) {
    var template = document.querySelector('#' + type)
        .content.querySelector('.' + type);
    var message = template.cloneNode(true);

    main.append(message);

    var messageClose = function () {
      message.remove();
      document.removeEventListener('click', onButtonClick);
      document.removeEventListener('keydown', onEscPress);
    };

    var onButtonClick = function () {
      messageClose();
    };

    var onEscPress = window.modal.escPress(messageClose);

    document.addEventListener('click', onButtonClick);
    document.addEventListener('keydown', onEscPress);
  };

  var onSuccessSend = function () {
    createMessageTemplate('success');
  };

  var onErrorSend = function () {
    createMessageTemplate('error');
  };

  var form = document.querySelector('.img-upload__form');
  var submit = form.querySelector('.img-upload__submit');
  var hashInput = form.querySelector('.text__hashtags');
  var commentInput = form.querySelector('.text__description');
  var regNumbersAndSymbols = /^[a-z0-9а-я]$/i;

  submit.addEventListener('click', function (evt) {
    hashInput.style.borderColor = 'initial';

    var inputCustomValidation = new CustomValidation();
    inputCustomValidation.checkValidity(hashInput);

    var customValidityMessage = inputCustomValidation.getInvalidities();
    hashInput.setCustomValidity(customValidityMessage);

    if (hashInput.checkValidity()) {
      window.backend.save(new FormData(form), onSuccessSend, onErrorSend);
      window.modal.close();
      evt.preventDefault();
    } else {
      hashInput.style.borderColor = 'red';
    }
  });

  resetRedactor();

  function CustomValidation() {}

  CustomValidation.prototype = {
    invalidities: [],

    checkValidity: function (input) {
      if (input.value) {
        var isRepeat = false;
        var isBeginWithHash = true;
        var isInLimits = true;
        var isInAlphabet = true;
        this.invalidities = [];
        var hashtags = input.value.toLowerCase().split(' ');

        hashtags.forEach(function (hash, index, arr) {

          if (!isRepeat) {
            isRepeat = arr.indexOf(hash, ++index) !== -1;
          }

          if (isBeginWithHash) {
            isBeginWithHash = hash[0] === '#';
          }

          if (isInLimits) {
            isInLimits = MIN_TAG_LENGTH < hash.length && hash.length <= MAX_TAG_LENGTH;
          }

          if (isInAlphabet) {
            var chars = hash.split('');
            chars.shift();
            isInAlphabet = chars.every(function (char) {
              return regNumbersAndSymbols.test(char);
            });
          }
        });

        if (isRepeat) {
          this.addInvalidity('один и тот же хэш-тег не может быть использован дважды');
        }

        if (!isBeginWithHash) {
          this.addInvalidity('хэш-тег должен начинается с символа # (решётка)');
        }

        if (!isInLimits) {
          this.addInvalidity('хэш-тег не может состоять из одной решетки и быть длиннее ' + MAX_TAG_LENGTH + ' символов включая решетку');
        }

        if (!isInAlphabet) {
          this.addInvalidity('Используются запрещенные символы');
        }

        if (hashtags.length > TAGS_LIMIT) {
          this.addInvalidity('Максимальное количество хеш-тегов: ' + TAGS_LIMIT);
        }
      }
    },

    addInvalidity: function (message) {
      this.invalidities.push(message);
    },

    getInvalidities: function () {
      return this.invalidities.join('. \n');
    }
  };

  window.form = {
    imgRedactor: imgRedactor,
    resetRedactor: resetRedactor
  };
})();
