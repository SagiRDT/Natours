/* eslint-disable */

// **   didnt exported anything because parcel isn't working
//      I'll copy by hand all the data to the budnle.js file instaed of dealing with parcel
//      Will get babel and axios from a cdn (include in base.pug)   **

// import axios from 'axios';
// import showAlert from './alerts';

// type is either 'password' or 'data'
const updateSettings = async (data, type) => {
    try {
        const url =
            type === 'password'
                ? 'http://localhost:3000/api/v1/users/updateMyPassword'
                : 'http://localhost:3000/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            url,
            data,
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
            window.setTimeout(() => {
                location.assign('/me');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
