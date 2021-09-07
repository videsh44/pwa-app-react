import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../src/assets/style.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import '../node_modules/font-awesome/css/font-awesome.min.css';
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
serviceWorkerRegistration.register();

let deferredPrompt;
const addBtn = document.querySelector('.add-button');
if (addBtn) {
  addBtn.style.display = 'none';
}
window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  deferredPrompt = e;
  addBtn.style.display = 'block';
});

addBtn.addEventListener('click', (e) => {
  addBtn.style.display = 'none';
  deferredPrompt.prompt();
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
});



// let deferredPrompt;
// const addBtn = document.querySelector('.add-button');
// if (addBtn) {
//   addBtn.style.display = 'none';
// }
// window.addEventListener('beforeinstallprompt', (e) => {
//   e.preventDefault();
//   deferredPrompt = e;
//   addBtn.style.display = 'block';
//   addBtn.addEventListener('click', (e) => {
//     addBtn.style.display = 'none';
//     deferredPrompt.prompt();
//     deferredPrompt.userChoice.then((choiceResult) => {
//       if (choiceResult.outcome === 'accepted') {
//         console.log('User accepted the A2HS prompt');
//       } else {
//         console.log('User dismissed the A2HS prompt');
//       }
//       deferredPrompt = null;
//     });
//   });
// });
// // if are standalone android OR safari
// // if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
// //   // hidden the button
// //   addBtn.style.display = 'none';
// // }
// // do action when finished install
// window.addEventListener('appinstalled', e => {
//   ("success app install!");
// });