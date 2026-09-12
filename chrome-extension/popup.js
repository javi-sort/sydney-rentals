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
    document.getElementById('suburb').textContent = listing.suburb || 'Not found';
    document.getElementById('price').textContent = listing.price || 'Not found';
    document.getElementById('beds').textContent = listing.beds ?? 'Not found';
    document.getElementById('baths').textContent = listing.baths ?? 'Not found';
    document.getElementById('carSpaces').textContent = listing.carSpaces ?? 'Not found';
    document.getElementById('agent').textContent = listing.agentName || 'Not found';
    document.getElementById('agentPhone').textContent = listing.agentPhone || 'Not found';

    // Send listing to DB via backend API request
    const saveBtn = document.getElementById('save-btn');
    
    saveBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'SAVE_LISTING', listing }, (response) => {
            if (response.ok) {
                document.getElementById('status').textContent = 'Listing saved!';
            } else {
                document.getElementById('status').textContent = 'Something went wrong...';
            }
        });
    });
});
