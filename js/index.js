window.addEventListener('load', () => {
    navigator.serviceWorker.register('/pwa/sw.js')
        .then(reg => {
            console.log('registered', reg)
        })
        .catch(err => (console.log(err)))
})

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();

    deferredPrompt = e;

    document.getElementById('installBtn').style.display = 'block';
});

document.getElementById('installBtn').addEventListener('click', async () => {

    if (deferredPrompt) {

        deferredPrompt.prompt();

        const result = await deferredPrompt.userChoice;

        console.log(result);

        deferredPrompt = null;
    }
});
