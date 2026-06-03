document.addEventListener('DOMContentLoaded', async () => {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Retrieve listing by sending message to Chrome
    const listing = await chrome.tabs.sendMessage(tab.id, { type: 'GET_LISTING' });

    // Retrieval failed
    if (!listing) {
        document.getElementById('status').textContent = 'No listing found on this page.';
        return;
    }

    // Populate the listing attributes
    document.getElementById('address').textContent = listing.address || 'Not found';
    document.getElementById('price').textContent = listing.price || 'Not found';
    document.getElementById('agent').textContent = listing.agentName || 'Not found';

    // Send listing to DB via backend API request
    document.getElementById('save-btn').addEventListener('click', async () => {
        const reponse = await fetch('http://localhost:3000/listings', {
            method: 'POST',
            headers: { ContentType: 'application/json' },
            body: JSON.stringify(listing),
        });

        if (response.ok) {
            document.getElementById('status').textContent = 'Listing saved!';
        } else {
            document.getElementById('status').textContent = 'Something went wrong...';
        }
    });
});
