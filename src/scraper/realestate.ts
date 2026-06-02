import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(StealthPlugin());

export async function scrapeRealEstate(searchUrl: string) {
    // Set up browser
    const browser = await chromium.launch({ headless: false});
    const context = await browser.newContext({
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    // Go to URL, wait for page to finish loading
    await page.goto(searchUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const html = await page.content();
    console.log(html.substring(0, 3000));

    // Query the page for the listings cards
    const listings = await page.evaluate(() => {
        const cards = document.querySelectorAll('[data-testid="ResidentialCard"]');
        console.log('cards found: ', cards.length);

        return Array.from(cards).map(card => ({
            price: card.querySelector('.property-price')?.textContent?.trim(),
            address: card.querySelector('.residential-card__address-heading a span')?.textContent?.trim(),
        }));
    });

    // Close browser + print listings
    await browser.close();
    console.log(listings);
}

// Quick test
scrapeRealEstate('https://www.realestate.com.au/rent/in-sydney+cbd,+nsw/list-1');