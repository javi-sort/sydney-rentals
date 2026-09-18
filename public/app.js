const BED_ICON = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="7" width="14" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/><path d="M1 10V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5" stroke="currentColor" stroke-width="1.2"/><path d="M5 7V5h6v2" stroke="currentColor" stroke-width="1.2"/></svg>`;
const BATH_ICON = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8h10v1.5A3.5 3.5 0 0 1 9.5 13h-3A3.5 3.5 0 0 1 3 9.5V8Z" stroke="currentColor" stroke-width="1.2"/><path d="M3 8V4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.2"/><path d="M5 13.5V15M11 13.5V15" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`;

// Humanize a stored ISO timestamp relative to today
function formatDate(iso) {
  const d = new Date(iso);
  const diff = Date.now() - d;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

// Build a card DOM node for a single listing
function renderCard(listing) {
  const card = document.createElement('article');
  card.className = `card${listing.isActive === false ? ' card--inactive' : ''}`;

  const hasBeds = listing.beds != null;
  const hasBaths = listing.baths != null;
  const featuresHtml = (hasBeds || hasBaths) ? `
    <div class="features">
      ${hasBeds ? `<div class="feature">${BED_ICON}<span>${listing.beds} bed${listing.beds !== 1 ? 's' : ''}</span></div>` : ''}
      ${hasBaths ? `<div class="feature">${BATH_ICON}<span>${listing.baths} bath${listing.baths !== 1 ? 's' : ''}</span></div>` : ''}
    </div>` : '';

  const suburbHtml = listing.suburb
    ? `<span class="suburb-tag">${listing.suburb}</span>`
    : '';

  const dateHtml = listing.createdAt
    ? `<span class="date-tag">${formatDate(listing.createdAt)}</span>`
    : '';

  card.innerHTML = `
    <div class="card-body">
      <div class="card-top">
        <div class="price">${listing.price || 'Price TBC'}</div>
        ${suburbHtml}
      </div>
      <div class="address">${listing.address || 'Address unavailable'}</div>
      ${featuresHtml}
    </div>
    ${listing.imageUrl ? `<img class="card-image" src="${listing.imageUrl}" alt="${listing.address || 'Listing photo'}" loading="lazy">` : ''}
    <div class="card-footer">
      <div class="agent-info">
        ${(listing.contacts || []).map(c => `
          <div class="agent">
            ${c.name ? `<span class="agent-name">${c.name}</span>` : ''}
            ${c.phone ? `<span class="agent-phone">${c.phone}</span>` : ''}
          </div>`).join('')}
        ${dateHtml}
      </div>
      ${listing.url ? `<a class="card-link" href="${listing.url}" target="_blank" rel="noopener">View ↗</a>` : ''}
    </div>
  `;
  return card;
}

const STATUS_CHECK_KEY = 'lastStatusCheck';
const STATUS_CHECK_TTL = 60 * 60 * 1000; // 1 hour

// HEAD-check all listing URLs server-side and record the timestamp
async function checkUrls() {
  await fetch('http://127.0.0.1:3000/listings/check-urls', { method: 'POST' });
  try { localStorage.setItem(STATUS_CHECK_KEY, Date.now()); } catch {}
}

// Fetch and render all listings; run a URL check if the cooldown has expired
async function load(forceCheck = false) {
  const grid = document.getElementById('grid');
  const countEl = document.getElementById('count');
  const refreshBtn = document.getElementById('refresh-btn');

  // Run URL check if forced or cache has expired
  const lastCheck = (() => { try { return parseInt(localStorage.getItem(STATUS_CHECK_KEY) || '0'); } catch { return 0; } })();
  const checkDue = forceCheck || (Date.now() - lastCheck > STATUS_CHECK_TTL);

  if (checkDue) {
    if (refreshBtn) { refreshBtn.textContent = 'Checking…'; refreshBtn.disabled = true; }
    await checkUrls();
    if (refreshBtn) { refreshBtn.textContent = 'Check status'; refreshBtn.disabled = false; }
  }

  try {
    const res = await fetch('http://127.0.0.1:3000/listings');
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const listings = await res.json();

    grid.innerHTML = '';

    if (!listings.length) {
      countEl.textContent = '0 listings';
      grid.innerHTML = `
        <div class="state-box">
          <span class="state-icon">🏠</span>
          <h3>No listings saved yet</h3>
          <p>Browse realestate.com.au or domain.com.au and hit Save in the extension to add one.</p>
        </div>`;
      return;
    }

    // Count only active listings in the header
    const activeCount = listings.filter(l => l.isActive !== false).length;
    const inactiveCount = listings.length - activeCount;
    countEl.textContent = `${activeCount} listing${activeCount !== 1 ? 's' : ''}${inactiveCount ? ` · ${inactiveCount} gone` : ''}`;
    listings.forEach(l => grid.appendChild(renderCard(l)));

  } catch (err) {
    grid.innerHTML = '';
    countEl.textContent = '';
    grid.innerHTML = `
      <div class="error-box">
        <strong>Could not connect to backend</strong>
        <p>Make sure the server is running on port 3000. ${err.message}</p>
      </div>`;
  }
}

document.getElementById('refresh-btn').addEventListener('click', () => load(true));
load();
