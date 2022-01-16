/* eslint-disable */

// **   didnt exported anything because parcel isn't working
//      I'll copy by hand all the data to the budnle.js file instaed of dealing with parcel
//      Will get babel and axios from a cdn (include in base.pug)   **

// import axios from 'axios';
// import showAlert from './alerts';

const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password,
            },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout',
        });

        if (res.data.status === 'success') {
            location.reload(true);
        }
    } catch (err) {
        showAlert('error', 'Error logging out! Try again.');
    }
};
