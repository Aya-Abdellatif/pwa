const filesToCache = [
    'index.html',
    'page1.html',
    'css/index.css',
    'pages/offline.html',
    'pages/error.html'

]

const staticDB = 'myCache'

self.addEventListener('install', event => {
    console.log('installing', event)

    self.skipWaiting()

    event.waitUntil(
        caches.open(staticDB)
            .then(db => {
                db.addAll(filesToCache)
            })
            .catch(err => {
                console.log(err)
            }
            )
    )
})

self.addEventListener('activate', event => {
    console.log('activating', event)
})

self.addEventListener('fetch', event => {
    console.log('fetching', event.request.url)

    if (!event.request.url.startsWith('http'))
        return;

    event.respondWith(

        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('found request in cache', event.request.url)
                    return response
                }

                console.log('network request', event.request.url)

                return fetch(event.request)
                    .then(networkResponse => {

                        if (networkResponse.status === 404) {
                            return caches.match('./pages/error.html');
                        }

                        return caches.open(staticDB)
                            .then(cache => {

                                cache.put(event.request, networkResponse.clone());

                                //console.log('request added to cache', event.request.url)

                                return networkResponse;
                            }
                            );
                    }
                    )
            })
            .catch(err => {
                //console.log(err)
                return caches.match('offline.html');

            }
            )
    )
})