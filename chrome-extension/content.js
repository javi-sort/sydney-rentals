function getListingData() {
    // realestate.com.au
    if (window.location.hostname.includes('realestate.com.au')) {
        // Pull the full address string and extract suburb as the second comma-separated segment
        const address = document.querySelector('h1.property-info-address')?.textContent?.trim();
        const suburb = address?.split(',')[1]?.trim();

        // Each feature (beds, baths, parking) is an <li> with a descriptive aria-label — grab the number from the inner <p>
        const bedsEl = document.querySelector('li[aria-label$=" bedrooms"], li[aria-label$=" bedroom"]');
        const bathsEl = document.querySelector('li[aria-label$=" bathrooms"], li[aria-label$=" bathroom"]');
        const carEl = document.querySelector('li[aria-label$=" car space"], li[aria-label$=" car spaces"]');

        return {
            url: window.location.href,
            address,
            suburb,
            price: document.querySelector('.property-price')?.textContent?.trim(),
            beds: bedsEl ? parseInt(bedsEl.querySelector('p')?.textContent) : undefined,
            baths: bathsEl ? parseInt(bathsEl.querySelector('p')?.textContent) : undefined,
            carSpaces: carEl ? parseInt(carEl.querySelector('p')?.textContent) : undefined,
            agentName: document.querySelector('[class*="AgentOrConsultantNameLink"]')?.textContent?.trim(),
            agentPhone: document.querySelector('a[href^="tel:"]')?.href?.replace('tel:', ''),
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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'GET_LISTING') {
        sendResponse(getListingData());
    }
});
