/* eslint-disable */

// **   didnt exported anything because parcel isn't working
//      I'll copy by hand all the data to the budnle.js file instaed of dealing with parcel
//      Will get babel and axios from a cdn (include in base.pug)   **

const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) {
        el.parentElement.removeChild(el);
    }
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
    hideAlert();

    const markup = `<div class="alert alert--${type}>${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

    window.setTimeout(hideAlert, 5000);
};
