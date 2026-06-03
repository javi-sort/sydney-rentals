function getListingData() {
    // For realestate.com.au
    if (window.location.hostname.includes('realestate.com.au')) {
        return {
            url: window.location.href,
            address: document.querySelector('h1.property-info-address')?.textContent?.trim(),
            price: document.querySelector('.property-price')?.textContent?.trim(),
            agentName: document.querySelector('.agent-name')?.textContent?.trim(),
        };
    }

    // domain.com.au
    if (window.location.hostname.includes('domain.com.au')) {
        return {
            url: window.location.href,
            address: document.querySelector('h1[data-testid="listing-details__summary-title"]')?.textContent?.trim(),
            price: document
                .querySelector('[data-testid="listing-details__summary-property-type"] + div')
                ?.textContent?.trim(),
            agentName: document.querySelector('[data-testid="agent-details__agent-name"]')?.textContent?.trim(),
        };
    }

    return null;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_LISTING') {
        sendResponse(getListingData());
    }
});
