const MAXIMUM_FILE_SIZE = 1024;
const TOO_BIG_FILE_ERROR = 'File size less than 1 MB is allowed';
const WRONG_FILE_EXTENSION_ERROR = 'Ony jpg and png file types are allowed';


export function uploadImage(fileInput, uploadCallback) {
  const file = fileInput.files[0];
  const fileSize = Math.round(file.size / 1024);
  const fileExtension = file.name.split('.').pop().toLowerCase();
  const allowedFileTypes = ['jpg', 'jpeg', 'png'];
  const $errorContainer = $('.js-submission-error');

  if (fileSize > MAXIMUM_FILE_SIZE) {
    $errorContainer.removeClass('hidden');
    $('.js-submission-error-message').html(TOO_BIG_FILE_ERROR);
    return;
  }

  if (allowedFileTypes.indexOf(fileExtension) === -1) {
    $errorContainer.removeClass('hidden');
    $('.js-submission-error-message').html(WRONG_FILE_EXTENSION_ERROR);
    return;
  }

  $errorContainer.addClass('hidden');

  const fileReader = new FileReader();
  fileReader.onload = event => uploadCallback(event.target.result, $(fileInput));
  fileReader.readAsDataURL(file);
}
