import Echo from 'laravel-echo';

import * as Pusher from 'pusher-js';

export const LEcho = new Echo({
    broadcaster: 'pusher',
    key: process.env.REACT_APP_PUSHER_APP_KEY,
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
    wsHost: process.env.NODE_ENV !== 'production' ? window.location.hostname : 'pitch90.spiracsports.com',
    wsPort:            process.env.NODE_ENV !== 'production' ? 6001 : 6002,
    wssPort:           process.env.NODE_ENV !== 'production' ? 6001 : 6002,
    forceTLS: false,
    disableStats: true,
    encrypted:         process.env.NODE_ENV === 'production',
    enabledTransports: ['ws', 'wss'],
});
