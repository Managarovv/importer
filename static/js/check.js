const inputField = document.getElementById('idvalue');
const submitButton = document.getElementById('find');

inputField.addEventListener('input', function() {
  if (this.checkValidity()) {
    submitButton.removeAttribute('disabled');
  } else {
    submitButton.setAttribute('disabled', 'disabled');
  }
});
