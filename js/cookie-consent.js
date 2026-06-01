(function () {
  const STORAGE_KEY = 'gik_cookie_consent';

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
  }

  function saveConsent(statistics) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      necessary: true,
      statistics: statistics,
      timestamp: new Date().toISOString()
    }));
  }

  function hideBanner() {
    const el = document.getElementById('cookie-banner');
    if (!el) return;
    el.classList.add('cookie-banner--hidden');
    setTimeout(() => el.remove(), 400);
  }

  function openModal() {
    const modal = document.getElementById('cookie-modal');
    if (modal) modal.classList.add('cookie-modal--open');
  }

  function closeModal() {
    const modal = document.getElementById('cookie-modal');
    if (modal) modal.classList.remove('cookie-modal--open');
  }

  function acceptAll() {
    saveConsent(true);
    hideBanner();
    closeModal();
  }

  function acceptNecessary() {
    saveConsent(false);
    hideBanner();
    closeModal();
  }

  function saveSettings() {
    const toggle = document.getElementById('cookie-toggle-stats');
    saveConsent(toggle ? toggle.checked : false);
    hideBanner();
    closeModal();
  }

  function createBanner() {
    const el = document.createElement('div');
    el.id = 'cookie-banner';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Cookie-Einstellungen');
    el.innerHTML = `
      <div class="cookie-banner__inner">
        <div class="cookie-banner__text">
          <strong class="cookie-banner__title">Diese Website verwendet Cookies</strong>
          <p class="cookie-banner__desc">Wir nutzen technisch notwendige Cookies für Grundfunktionen (z.&nbsp;B. Spracheinstellung). Details in unserer <a href="datenschutz.html">Datenschutzerklärung</a>.</p>
        </div>
        <div class="cookie-banner__actions">
          <button id="cb-accept-all" class="btn btn-primary btn-sm">Alle akzeptieren</button>
          <button id="cb-necessary" class="btn btn-outline btn-sm">Nur Notwendige</button>
          <button id="cb-settings" class="cookie-text-btn">Einstellungen</button>
        </div>
      </div>`;
    document.body.appendChild(el);

    document.getElementById('cb-accept-all').addEventListener('click', acceptAll);
    document.getElementById('cb-necessary').addEventListener('click', acceptNecessary);
    document.getElementById('cb-settings').addEventListener('click', openModal);
  }

  function createModal() {
    const el = document.createElement('div');
    el.id = 'cookie-modal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'cookie-modal-title');
    el.innerHTML = `
      <div class="cookie-modal__backdrop"></div>
      <div class="cookie-modal__box">
        <div class="cookie-modal__header">
          <h2 id="cookie-modal-title" class="cookie-modal__heading">Cookie-Einstellungen</h2>
          <button id="cookie-modal-close" class="cookie-modal__close" aria-label="Schließen">&times;</button>
        </div>
        <div class="cookie-modal__body">
          <p class="cookie-modal__intro">Wählen Sie, welche Cookies Sie erlauben möchten. Technisch notwendige Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.</p>

          <div class="cookie-category">
            <div class="cookie-category__row">
              <div class="cookie-category__info">
                <span class="cookie-category__name">Technisch notwendig</span>
                <span class="cookie-category__desc">Sprachpräferenz, Cookie-Einstellungen. Keine Weitergabe an Dritte.</span>
              </div>
              <span class="cookie-always-on">Immer aktiv</span>
            </div>
          </div>

          <div class="cookie-category">
            <div class="cookie-category__row">
              <div class="cookie-category__info">
                <span class="cookie-category__name">Analyse &amp; Statistiken</span>
                <span class="cookie-category__desc">Derzeit nicht aktiv. Dient zur Analyse des Nutzerverhaltens zur Verbesserung der Website.</span>
              </div>
              <label class="cookie-toggle" aria-label="Analyse-Cookies erlauben">
                <input type="checkbox" id="cookie-toggle-stats">
                <span class="cookie-toggle__slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="cookie-modal__footer">
          <button id="cm-save" class="btn btn-primary btn-sm">Auswahl speichern</button>
          <button id="cm-accept-all" class="btn btn-outline btn-sm">Alle akzeptieren</button>
        </div>
      </div>`;
    document.body.appendChild(el);

    document.getElementById('cookie-modal-close').addEventListener('click', closeModal);
    el.querySelector('.cookie-modal__backdrop').addEventListener('click', closeModal);
    document.getElementById('cm-save').addEventListener('click', saveSettings);
    document.getElementById('cm-accept-all').addEventListener('click', acceptAll);

    const consent = getConsent();
    if (consent) {
      const toggle = document.getElementById('cookie-toggle-stats');
      if (toggle) toggle.checked = !!consent.statistics;
    }
  }

  function init() {
    createModal();
    if (!getConsent()) createBanner();

    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'open-cookie-settings') {
        e.preventDefault();
        openModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
