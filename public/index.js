import '../public/index.css';


import dispathcher from './modules/dispathcher.js';
import { actionStart } from './actions/userActions.js';

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js', {scope: '/'})
//     .then((reg) => {
//         console.log('SW register', reg);
//     })
//     .catch((error) => {
//         console.log('SW error', error);
//     })
// }

dispathcher.do(actionStart());
