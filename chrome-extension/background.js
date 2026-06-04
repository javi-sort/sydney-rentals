chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SAVE_LISTING') {
        console.log('background received listing:', message.listing);
        fetch('http://127.0.0.1:3000/listings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message.listing),
        })
        .then(res => {
            console.log('response status:', res.status);
            return res.json();
        })
        .then(data => {
            console.log('response data:', data);
            sendResponse({ ok: true });
        })
        .catch(err => {
            console.error('fetch error:', err);
            sendResponse({ ok: false });
        });

         // Keeps the message channel open for async response
        return true;
    }
});