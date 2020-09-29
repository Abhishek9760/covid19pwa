{% load static %}
var STATIC_CACHE = 'static-v4';
var DYNAMIC_CACHE = 'dynamic-v3';
var STATIC_FILES = [
    "{% url 'home' %}",
    "{% static 'css/main.css' %}",
    "{% static 'js/main.js' %}",
    "/offline/",
    "/offline",
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css",
    "https://fonts.googleapis.com/css2?family=Inconsolata&display=swap",
    "https://code.jquery.com/jquery-3.5.0.min.js",
    "https://code.getmdl.io/1.3.0/material.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js",
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
]

function isInArray(string, array) {
    for (var i=0; i < array.length; i++){
        if (array[i] === string) {
            return true
        }
    }
    return false;
}

self.addEventListener('install',function (event) {
    console.log('[SW]installing..,', event);
    event.waitUntil(
        caches.open(STATIC_CACHE).then(function (cache) {
            return cache.addAll(STATIC_FILES);
        })
    );
});

self.addEventListener('activate', function (event) {
    console.log('[SW]activating...', event);
    event.waitUntil(
        caches.keys().then(function (keyList) {
          return Promise.all(keyList.map(function (key) {
            if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
              console.log("[SW] Removing old cache", key);
              return caches.delete(key);
            }
          }))
        })
      )
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    console.log('[SW]fetching...', event);

    var url = "https://api.covid19api.com";
    if (event.request.url.indexOf(url) > -1) {
        console.log("api url", event.request.url)
        console.log("running the api requests...")
        return event.respondWith(
          caches.open(DYNAMIC_CACHE).then(function (cache) {
            return fetch(event.request).then(function (res) {
              cache.put(event.request, res.clone());
              return res;
            })
          })
        );
    } 
    
    else if (isInArray(event.request.url, STATIC_FILES)) {
        console.log("matching", event.request.url);
        event.respondWith(
            caches.match(event.request)
        )                    
    }

    else {
        console.log("getting", event.request.url)
        console.log("this is else block", event.request.url);
        return event.respondWith(
            caches.match(event.request).then(function (res) {
                console.log("In the cache", event.request.url);
                if (res) {
                    console.log(res);
                    return res;
                } else {

                    console.log("fetching", event.request.url)
                    return fetch(event.request).then(function(response) {
                        return caches.open(DYNAMIC_CACHE).then(function (cache) {
                            cache.put(event.request,response.clone());
                            return response;
                        })
                    })
                    .catch(f = err => {
                        console.log("this is offline time!")
                        return caches.open(STATIC_CACHE).then(function (cache) {
                            if (event.request.headers.get('accept').includes('text/html')) {
                                return cache.match("{% url 'offline' %}").then(f = resp => {
                                    console.log("offline response", resp);
                                    return resp;
                                })
                            }
                        });
                    });
                }
            })
        );
    }
});