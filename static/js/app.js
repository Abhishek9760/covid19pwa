var serviceWorkerPath = "/sw.js";
var deferredPrompt;
registerServiceWorker(serviceWorkerPath);

function registerServiceWorker(serviceWorkerPath){
   if('serviceWorker' in navigator){
     navigator.serviceWorker
       .register(serviceWorkerPath, {scope: '/'})
         .then(
           function(reg){
             console.log('charcha service worker registered');
           }
         ).catch(function(error){
           console.log(error);
         });
   }
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

