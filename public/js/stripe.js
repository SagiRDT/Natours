/* eslint-disable */

// **   didnt exported anything because parcel isn't working
//      I'll copy by hand all the data to the budnle.js file instaed of dealing with parcel
//      Will get babel and axios from a cdn (include in base.pug)   **

// import axios from 'axios';
// import showAlert from './alerts';

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
