document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupMessage = document.getElementById('popup-message');
    const popupClose = document.getElementById('popup-close');

    const errorMessageElement = document.getElementById('error-message');
    const successMessageElement = document.getElementById('success-message');

    let message = '';

    if (errorMessageElement) {
        message = errorMessageElement.textContent;
    } else if (successMessageElement) {
        message = successMessageElement.textContent;
    }

    if (message) {
        popupMessage.textContent = message;
        popupOverlay.classList.remove('hidden');
    }

    popupClose.addEventListener('click', () => {
        popupOverlay.classList.add('hidden');
    });

    // Close popup when clicking outside of the popup
    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.classList.add('hidden');
        }
    });
});
