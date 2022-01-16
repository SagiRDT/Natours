/* eslint-disable */

// **   Order of bundeling: mapbox.js, alrets.js, login.js, updateSettings.js, index.js  **

// **********************************************************************************************************
// mapbox.js
// **********************************************************************************************************

const displayMap = locations => {
    mapboxgl.accessToken =
        'pk.eyJ1Ijoic2FnaXJkdCIsImEiOiJja3k3YWR6eGIwcmxuMnBydng4Mmw5bjl4In0.SCZ7oTDWt2g052huqqC3mA';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/sagirdt/cky7dnky25ue114p635r595iu',
        scrollZoom: false,
        // center: [-118.113491, 34.111745],
        // zoom: 9,
        // interactive: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create a marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add the marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add a popup
        new mapboxgl.Popup({
            offset: 30,
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend the map bound to include the current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 250,
            bottom: 150,
            left: 100,
            right: 100,
        },
    });
};

// **********************************************************************************************************
// alerts.js
// **********************************************************************************************************

const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) {
        el.parentElement.removeChild(el);
    }
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
    hideAlert();

    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

    window.setTimeout(hideAlert, 5000);
};

// **********************************************************************************************************
// login.js
// **********************************************************************************************************

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

// **********************************************************************************************************
// updateSettings.js
// **********************************************************************************************************

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

// **********************************************************************************************************
// stripe.js
// **********************************************************************************************************

const stripe = Stripe(
    'pk_test_51KHX76BvHQT2pGph2JXcpLesfeT9AhsYm3Kh5b3h7hzvvhp1U9dzojSbpwzFpeA0jOx2I3b4Lby4s77ZdHhcHZNc00ZFrdupgL'
);

const bookTour = async tourId => {
    try {
        // Get checkout session from API
        const session = await axios(
            `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
        );
        console.log(session);

        // Create a checkout form + charge the credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};

// **********************************************************************************************************
// index.js
// **********************************************************************************************************

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        login(email, password);
    });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();

        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);

        updateSettings(form, 'data');
    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();

        document.querySelector('.btn--save-password').textContent = 'Updating...';

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

        document.querySelector('.btn--save-password').textContent = 'Save Password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}

if (bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });
}

// **********************************************************************************************************
