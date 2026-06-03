chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SAVE_LISTING') {
        fetch('http://127.0.0.1:3000/listings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message.listing),
        })
        .then(res => res.json())
        .then(data => sendResponse({ ok: true }))
        .catch(err => sendResponse({ ok: false }));

         // Keeps the message channel open for async response
        return true;
    }
});