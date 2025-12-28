(function () {
    'use strict';

    // ============================================
    // MAID BYPASS - ULTIMATE EDITION
    // Created by: Maid Dev
    // YouTube: MaidDev | Discord: maidhunter
    // Version: 2.0.2 ULTIMATE
    // ============================================

    const host = location.hostname;
    const debug = localStorage.getItem('maid_debug') === 'true';

    // Set Indonesian as primary language
    let currentLanguage = localStorage.getItem('maid_lang') || 'id';

    // Translations - Indonesian & English only
    const translations = {
        id: {
            title: "Maid Bypass",
            subtitle: "EDISI ULTIMATE",
            pleaseSolveCaptcha: "Silakan selesaikan CAPTCHA untuk melanjutkan",
            captchaSuccess: "CAPTCHA berhasil diselesaikan",
            redirectingToWork: "Mengalihkan ke Work.ink...",
            bypassSuccessCopy: "Bypass berhasil, Key telah disalin (klik 'Izinkan' jika diminta)",
            waitingCaptcha: "Menunggu CAPTCHA...",
            pleaseReload: "Silakan muat ulang halaman...(work.ink error)",
            bypassSuccess: "Bypass berhasil, tunggu {time}d...",
            backToCheckpoint: "Kembali ke Checkpoint...",
            captchaSuccessBypassing: "CAPTCHA berhasil, sedang bypass...",
            version: "Versi v2.0.2 ULTIMATE",
            madeBy: "Dibuat oleh Maid Dev",
            stats: "Statistik",
            settings: "Pengaturan",
            speedMode: "Mode Cepat",
            soundNotif: "Notifikasi Suara",
            debugMode: "Mode Debug"
        },
        en: {
            title: "Maid Bypass",
            subtitle: "ULTIMATE EDITION",
            pleaseSolveCaptcha: "Please solve the CAPTCHA to continue",
            captchaSuccess: "CAPTCHA solved successfully",
            redirectingToWork: "Redirecting to Work.ink...",
            bypassSuccessCopy: "Bypass successful! Key copied (click 'Allow' if prompted)",
            waitingCaptcha: "Waiting for CAPTCHA...",
            pleaseReload: "Please reload the page...(work.ink bugs)",
            bypassSuccess: "Bypass successful, waiting {time}s...",
            backToCheckpoint: "Returning to checkpoint...",
            captchaSuccessBypassing: "CAPTCHA solved successfully, bypassing...",
            version: "Version v2.0.2 ULTIMATE",
            madeBy: "Created by Maid Dev",
            stats: "Statistics",
            settings: "Settings",
            speedMode: "Speed Mode",
            soundNotif: "Sound Notifications",
            debugMode: "Debug Mode"
        }
    };

    function t(key, replacements = {}) {
        let text = translations[currentLanguage][key] || key;
        Object.keys(replacements).forEach(placeholder => {
            text = text.replace(`{${placeholder}}`, replacements[placeholder]);
        });
        return text;
    }

    // Sound effects
    const playSound = (freq, duration) => {
        if (localStorage.getItem('maid_sound') === 'false') return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            gain.gain.value = 0.1;
            osc.start();
            setTimeout(() => osc.stop(), duration);
        } catch (e) { }
    };

    // Enhanced Bypass Panel with Cyberpunk theme
    class MaidBypassPanel {
        constructor() {
            this.container = null;
            this.shadow = null;
            this.currentMessageKey = null;
            this.currentType = 'info';
            this.currentReplacements = {};
            this.isMinimized = false;
            this.showingSettings = false;
            this.init();
        }

        init() {
            this.createPanel();
            this.setupEventListeners();
        }

        createPanel() {
            this.container = document.createElement('div');
            this.shadow = this.container.attachShadow({ mode: 'closed' });

            const style = document.createElement('style');
            style.textContent = `
                * { margin: 0; padding: 0; box-sizing: border-box; }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(100px) scale(0.9); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.15); }
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 20px #ff008040; }
                    50% { box-shadow: 0 0 40px #ff008080; }
                }

                .panel-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 420px;
                    z-index: 2147483647;
                    font-family: 'Segoe UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
                    animation: slideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }

                .panel {
                    background: linear-gradient(135deg, #0a0a1f 0%, #1a1a3e 100%);
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    animation: glow 3s ease-in-out infinite;
                }

                .header {
                    background: linear-gradient(135deg, #ff0080 0%, #00ffff 100%);
                    padding: 20px;
                    position: relative;
                    overflow: hidden;
                }

                .header::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.15), transparent);
                    animation: shimmer 3s infinite;
                }

                .header-content {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .title-section {
                    flex: 1;
                }

                .title {
                    font-size: 24px;
                    font-weight: 900;
                    color: #fff;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                    letter-spacing: 1px;
                    margin-bottom: 4px;
                }

                .subtitle {
                    font-size: 11px;
                    font-weight: 700;
                    color: rgba(255,255,255,0.8);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                .header-buttons {
                    display: flex;
                    gap: 8px;
                }

                .icon-btn {
                    background: rgba(255,255,255,0.15);
                    border: none;
                    color: #fff;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    font-size: 18px;
                    font-weight: 700;
                }

                .icon-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: scale(1.1) rotate(5deg);
                }

                .status-section {
                    padding: 20px;
                }

                .status-box {
                    background: rgba(255,255,255,0.05);
                    border-radius: 15px;
                    padding: 18px;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .status-box::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
                    animation: shimmer 2s infinite;
                }

                .status-content {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    position: relative;
                    z-index: 1;
                }

                .status-icon {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    animation: pulse 2s ease-in-out infinite;
                    box-shadow: 0 0 15px currentColor;
                    flex-shrink: 0;
                }

                .status-icon.info { background: #00ffff; }
                .status-icon.success { background: #4ade80; }
                .status-icon.warning { background: #facc15; }
                .status-icon.error { background: #f87171; }

                .status-text {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    flex: 1;
                    line-height: 1.5;
                }

                .panel-body {
                    max-height: 600px;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    opacity: 1;
                }

                .panel-body.hidden {
                    max-height: 0;
                    opacity: 0;
                }

                .settings-section {
                    padding: 20px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    display: none;
                }

                .settings-section.active {
                    display: block;
                }

                .settings-title {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .setting-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 12px;
                    margin-bottom: 10px;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .setting-label {
                    color: #fff;
                    font-size: 13px;
                    font-weight: 600;
                }

                .toggle-switch {
                    width: 50px;
                    height: 26px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 13px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .toggle-switch.active {
                    background: #ff0080;
                }

                .toggle-switch::after {
                    content: '';
                    position: absolute;
                    width: 22px;
                    height: 22px;
                    background: white;
                    border-radius: 50%;
                    top: 2px;
                    left: 2px;
                    transition: all 0.3s;
                }

                .toggle-switch.active::after {
                    left: 26px;
                }

                .lang-section {
                    padding: 20px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }

                .lang-toggle {
                    display: flex;
                    gap: 10px;
                }

                .lang-btn {
                    flex: 1;
                    background: rgba(255,255,255,0.05);
                    border: 2px solid rgba(255,255,255,0.1);
                    color: #fff;
                    padding: 12px;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 13px;
                    transition: all 0.3s;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .lang-btn:hover {
                    background: rgba(255,255,255,0.1);
                    transform: translateY(-2px);
                }

                .lang-btn.active {
                    background: linear-gradient(135deg, #ff0080, #00ffff);
                    border-color: #ff0080;
                    box-shadow: 0 5px 20px #ff008040;
                }

                .footer {
                    padding: 16px 20px;
                    background: rgba(0,0,0,0.3);
                    border-top: 1px solid rgba(255,255,255,0.05);
                }

                .version-text {
                    color: rgba(255,255,255,0.5);
                    font-size: 11px;
                    font-weight: 600;
                    text-align: center;
                    margin-bottom: 8px;
                }

                .credit-text {
                    color: rgba(255,255,255,0.6);
                    font-size: 12px;
                    font-weight: 600;
                    text-align: center;
                    margin-bottom: 12px;
                }

                .credit-author {
                    color: #ff0080;
                    font-weight: 900;
                }

                .social-links {
                    display: flex;
                    justify-content: center;
                    gap: 16px;
                }

                .social-link {
                    color: #ff0080;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 700;
                    transition: all 0.2s;
                    padding: 6px 12px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 8px;
                }

                .social-link:hover {
                    color: #00ffff;
                    background: rgba(255,255,255,0.1);
                    transform: translateY(-2px);
                }

                @media (max-width: 480px) {
                    .panel-container {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        width: auto;
                    }
                }
            `;

            this.shadow.appendChild(style);

            const panelHTML = `
                <div class="panel-container">
                    <div class="panel">
                        <div class="header">
                            <div class="header-content">
                                <div class="title-section">
                                    <div class="title">${t('title')}</div>
                                    <div class="subtitle">${t('subtitle')}</div>
                                </div>
                                <div class="header-buttons">
                                    <button class="icon-btn" id="settings-btn" title="Settings">⚙</button>
                                    <button class="icon-btn" id="minimize-btn" title="Minimize">−</button>
                                </div>
                            </div>
                        </div>
                        <div class="status-section">
                            <div class="status-box">
                                <div class="status-content">
                                    <div class="status-icon info" id="status-icon"></div>
                                    <div class="status-text" id="status-text">${t('pleaseSolveCaptcha')}</div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-body" id="panel-body">
                            <div class="settings-section" id="settings-section">
                                <div class="settings-title">${t('settings')}</div>
                                <div class="setting-item">
                                    <div class="setting-label">${t('speedMode')}</div>
                                    <div class="toggle-switch ${localStorage.getItem('maid_speed') === 'true' ? 'active' : ''}" id="toggle-speed"></div>
                                </div>
                                <div class="setting-item">
                                    <div class="setting-label">${t('soundNotif')}</div>
                                    <div class="toggle-switch ${localStorage.getItem('maid_sound') !== 'false' ? 'active' : ''}" id="toggle-sound"></div>
                                </div>
                                <div class="setting-item">
                                    <div class="setting-label">${t('debugMode')}</div>
                                    <div class="toggle-switch ${localStorage.getItem('maid_debug') === 'true' ? 'active' : ''}" id="toggle-debug"></div>
                                </div>
                            </div>
                            <div class="lang-section">
                                <div class="lang-toggle">
                                    <button class="lang-btn ${currentLanguage === 'id' ? 'active' : ''}" data-lang="id">Indonesia</button>
                                    <button class="lang-btn ${currentLanguage === 'en' ? 'active' : ''}" data-lang="en">English</button>
                                </div>
                            </div>
                            <div class="footer">
                                <div class="version-text">${t('version')}</div>
                                <div class="credit-text">
                                    ${t('madeBy').replace('Maid Dev', '<span class="credit-author">Maid Dev</span>')}
                                </div>
                                <div class="social-links">
                                    <a href="https://youtube.com/@MaidDev" target="_blank" class="social-link">YouTube</a>
                                    <a href="https://discord.com/users/maidhunter" target="_blank" class="social-link">Discord</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const wrapper = document.createElement('div');
            wrapper.innerHTML = panelHTML;
            this.shadow.appendChild(wrapper.firstElementChild);

            document.documentElement.appendChild(this.container);
        }

        setupEventListeners() {
            const minimizeBtn = this.shadow.querySelector('#minimize-btn');
            const settingsBtn = this.shadow.querySelector('#settings-btn');
            const panelBody = this.shadow.querySelector('#panel-body');
            const settingsSection = this.shadow.querySelector('#settings-section');

            minimizeBtn.addEventListener('click', () => {
                this.isMinimized = !this.isMinimized;
                panelBody.classList.toggle('hidden');
                minimizeBtn.textContent = this.isMinimized ? '+' : '−';
                playSound(600, 50);
            });

            settingsBtn.addEventListener('click', () => {
                this.showingSettings = !this.showingSettings;
                settingsSection.classList.toggle('active');
                playSound(600, 50);
            });

            // Toggle switches
            this.shadow.querySelector('#toggle-speed').addEventListener('click', (e) => {
                const isActive = e.target.classList.toggle('active');
                localStorage.setItem('maid_speed', isActive);
                playSound(600, 50);
            });

            this.shadow.querySelector('#toggle-sound').addEventListener('click', (e) => {
                const isActive = e.target.classList.toggle('active');
                localStorage.setItem('maid_sound', isActive);
                if (isActive) playSound(600, 50);
            });

            this.shadow.querySelector('#toggle-debug').addEventListener('click', (e) => {
                const isActive = e.target.classList.toggle('active');
                localStorage.setItem('maid_debug', isActive);
                playSound(600, 50);
                location.reload();
            });

            // Language buttons
            this.shadow.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    currentLanguage = btn.dataset.lang;
                    localStorage.setItem('maid_lang', currentLanguage);
                    playSound(600, 50);
                    location.reload();
                });
            });
        }

        show(messageKey, type = 'info', replacements = {}) {
            this.currentMessageKey = messageKey;
            this.currentType = type;
            this.currentReplacements = replacements;

            const message = t(messageKey, replacements);
            const statusText = this.shadow.querySelector('#status-text');
            const statusIcon = this.shadow.querySelector('#status-icon');

            if (statusText) statusText.textContent = message;
            if (statusIcon) {
                statusIcon.className = `status-icon ${type}`;
            }

            if (type === 'success') playSound(800, 100);
            else if (type === 'error') playSound(400, 150);
        }
    }

    let panel = null;
    setTimeout(() => {
        panel = new MaidBypassPanel();
        panel.show('pleaseSolveCaptcha', 'info');
    }, 100);

    // Check host and run corresponding handlers
    if (host.includes("key.volcano.wtf")) handleVolcano();
    else if (host.includes("work.ink")) handleWorkInk();

    // Handler for VOLCANO (unchanged from original)
    function handleVolcano() {
        if (panel) panel.show('pleaseSolveCaptcha', 'info');
        if (debug) console.log('[Maid Debug] Waiting Captcha');

        let alreadyDoneContinue = false;
        let alreadyDoneCopy = false;

        function actOnCheckpoint(node) {
            if (!alreadyDoneContinue) {
                const buttons = node && node.nodeType === 1
                    ? node.matches('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]')
                        ? [node]
                        : node.querySelectorAll('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]')
                    : document.querySelectorAll('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]');
                for (const btn of buttons) {
                    const text = (btn.innerText || btn.value || "").trim().toLowerCase();
                    if (text.includes("continue") || text.includes("next step")) {
                        const disabled = btn.disabled || btn.getAttribute("aria-disabled") === "true";
                        const style = getComputedStyle(btn);
                        const visible = style.display !== "none" && style.visibility !== "hidden" && btn.offsetParent !== null;
                        if (visible && !disabled) {
                            alreadyDoneContinue = true;
                            if (panel) panel.show('captchaSuccess', 'success');
                            if (debug) console.log('[Maid Debug] Captcha Solved');

                            setTimeout(() => {
                                try {
                                    btn.click();
                                    if (panel) panel.show('redirectingToWork', 'info');
                                    if (debug) console.log('[Maid Debug] Clicking Continue');
                                } catch (err) {
                                    if (debug) console.log('[Maid Debug] No Continue Found', err);
                                }
                            }, 300);
                            return true;
                        }
                    }
                }
            }

            const copyBtn = node && node.nodeType === 1
                ? node.matches("#copy-key-btn, .copy-btn, [aria-label='Copy']")
                    ? node
                    : node.querySelector("#copy-key-btn, .copy-btn, [aria-label='Copy']")
                : document.querySelector("#copy-key-btn, .copy-btn, [aria-label='Copy']");
            if (copyBtn) {
                setInterval(() => {
                    try {
                        copyBtn.click();
                        if (debug) console.log('[Maid Debug] Copy button spam click');
                        if (panel) panel.show('bypassSuccessCopy', 'success');
                    } catch (err) {
                        if (debug) console.log('[Maid Debug] No Copy Found', err);
                    }
                }, 500);
                return true;
            }

            return false;
        }

        const mo = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (actOnCheckpoint(node)) {
                                if (alreadyDoneCopy) {
                                    mo.disconnect();
                                    return;
                                }
                            }
                        }
                    }
                }
                if (mutation.type === 'attributes' && mutation.target.nodeType === 1) {
                    if (actOnCheckpoint(mutation.target)) {
                        if (alreadyDoneCopy) {
                            mo.disconnect();
                            return;
                        }
                    }
                }
            }
        });

        mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled', 'style'] });

        if (actOnCheckpoint()) {
            if (alreadyDoneCopy) {
                mo.disconnect();
            }
        }
    }

    // Handler for WORK.INK (unchanged from original, just updated debug prefix)
    function handleWorkInk() {
        let readArticles2Triggered = false;
        if (panel) panel.show('pleaseSolveCaptcha', 'info');

        const startTime = Date.now();
        let sessionController = undefined;
        let sendMessageA = undefined;
        let onLinkInfoA = undefined;
        let onLinkDestinationA = undefined;
        let bypassTriggered = false;
        let destinationReceived = false;

        const map = {
            onLI: ["onLinkInfo"],
            onLD: ["onLinkDestination"]
        };

        function getFunction(obj, candidates = null) {
            if (!obj) {
                if (debug) console.log('[Maid Debug] getFunction: obj is null/undefined');
                return { fn: null, index: -1, name: null };
            }

            if (candidates) {
                for (let i = 0; i < candidates.length; i++) {
                    const name = candidates[i];
                    if (typeof obj[name] === "function") {
                        return { fn: obj[name], index: i, name };
                    }
                }
            } else {
                for (let i in obj) {
                    if (typeof obj[i] == "function" && obj[i].length == 2) {
                        return { fn: obj[i], name: i };
                    }
                }
            }
            return { fn: null, index: -1, name: null };
        }

        const types = {
            mo: 'c_monetization',
            ss: 'c_social_started',
            tr: 'c_turnstile_response',
            ad: 'c_adblocker_detected'
        };

        function triggerBypass(reason) {
            if (bypassTriggered) {
                if (debug) console.log('[Maid Debug] trigger Bypass skipped, already triggered');
                return;
            }
            bypassTriggered = true;
            if (debug) console.log('[Maid Debug] trigger Bypass via:', reason);
            if (panel) panel.show('captchaSuccessBypassing', 'success');

            if (debug) console.log('[Maid Debug] Phase 1: Firing initial 5x spoof burst');
            for (let i = 0; i < 5; i++) {
                spoofWorkink();
            }

            setTimeout(() => {
                if (!destinationReceived) {
                    if (debug) console.log('[Maid Debug] Phase 2: 5s passed, no destination. Firing fallback burst');
                    for (let i = 0; i < 5; i++) {
                        spoofWorkink();
                    }
                } else {
                    if (debug) console.log('[Maid Debug] Phase 2: Destination already received, skipping fallback');
                }
            }, 5000);
            if (debug) console.log('[Maid Debug] Waiting for server to send destination data...');
        }

        function spoofWorkink() {
            if (!sessionController?.linkInfo) {
                if (debug) console.log('[Maid Debug] spoof Workink skipped: no sessionController.linkInfo');
                return;
            }
            if (debug) console.log('[Maid Debug] spoof Workink starting, linkInfo:', sessionController.linkInfo);

            const socials = sessionController.linkInfo.socials || [];
            if (debug) console.log('[Maid Debug] Total socials to fake:', socials.length);

            for (let i = 0; i < socials.length; i++) {
                const soc = socials[i];
                try {
                    if (sendMessageA) {
                        sendMessageA.call(this, types.ss, { url: soc.url });
                        if (debug) console.log(`[Maid Debug] Faked social [${i + 1}/${socials.length}]:`, soc.url);
                    }
                } catch (e) {
                    if (debug) console.error(`[Maid Debug] Error faking social [${i + 1}/${socials.length}]:`, soc.url, e);
                }
            }

            const monetizations = sessionController.linkInfo.monetizations || [];
            if (debug) console.log('[Maid Debug] Total monetizations to fake:', monetizations.length);

            for (let i = 0; i < monetizations.length; i++) {
                const monetization = monetizations[i];
                try {
                    switch (monetization) {
                        case 22:
                            if (!readArticles2Triggered) {
                                readArticles2Triggered = true;
                                sendMessageA && sendMessageA.call(this, types.mo, { type: 'readArticles2', payload: { event: 'start' } });
                                if (debug) console.log(`[Maid Debug] Faked readArticles2 start [${i + 1}/${monetizations.length}]`);

                                let timeLeft = 15;
                                if (panel) panel.show('bypassSuccess', 'warning', { time: timeLeft });

                                const countdownInterval = setInterval(() => {
                                    timeLeft--;
                                    if (panel) panel.show('bypassSuccess', 'warning', { time: timeLeft });

                                    // Simulate scrolling
                                    window.scrollTo(0, Math.random() * document.body.scrollHeight);

                                    if (timeLeft <= 0) {
                                        clearInterval(countdownInterval);
                                        sendMessageA && sendMessageA.call(this, types.mo, { type: 'readArticles2', payload: { event: 'read' } });
                                        if (debug) console.log(`[Maid Debug] Faked readArticles2 read [${i + 1}/${monetizations.length}]`);
                                    }
                                }, 1000);
                            }
                            break;
                        case 25:
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'operaGX', payload: { event: 'start' } });
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'operaGX', payload: { event: 'installClicked' } });
                            fetch('https://work.ink/_api/v2/callback/operaGX', {
                                method: 'POST',
                                mode: 'no-cors',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ noteligible: true })
                            }).catch((e) => { if (debug) console.warn('[Maid Debug] operaGX fetch failed:', e); });
                            if (debug) console.log(`[Maid Debug] Faked operaGX [${i + 1}/${monetizations.length}]`);
                            break;
                        case 34:
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'norton', payload: { event: 'start' } });
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'norton', payload: { event: 'installClicked' } });
                            if (debug) console.log(`[Maid Debug] Faked norton [${i + 1}/${monetizations.length}]`);
                            break;
                        case 71:
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'externalArticles', payload: { event: 'start' } });
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'externalArticles', payload: { event: 'installClicked' } });
                            if (debug) console.log(`[Maid Debug] Faked externalArticles [${i + 1}/${monetizations.length}]`);
                            break;
                        case 45:
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'pdfeditor', payload: { event: 'installed' } });
                            if (debug) console.log(`[Maid Debug] Faked pdfeditor [${i + 1}/${monetizations.length}]`);
                            break;
                        case 57:
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'betterdeals', payload: { event: 'installed' } });
                            if (debug) console.log(`[Maid Debug] Faked betterdeals [${i + 1}/${monetizations.length}]`);
                            break;
                        default:
                            if (debug) console.log(`[Maid Debug] Unknown monetization [${i + 1}/${monetizations.length}]:`, monetization);
                    }
                } catch (e) {
                    if (debug) console.error(`[Maid Debug] Error faking monetization [${i + 1}/${monetizations.length}]:`, monetization, e);
                }
            }

            if (debug) console.log('[Maid Debug] spoof Workink completed');
        }

        function trm() {
            return function (...a) {
                const [msgType] = a;
                if (msgType === types.ad) {
                    if (debug) console.log('[Maid Debug] trm: Skipping adblocker message');
                    return;
                }
                if (sessionController?.linkInfo && msgType === types.tr) {
                    if (debug) console.log('[Maid Debug] Captcha bypassed via TR');
                    triggerBypass('tr');
                }
                return sendMessageA ? sendMessageA.apply(this, a) : undefined;
            };
        }

        function createLinkInfoProxy() {
            return function (...args) {
                const [info] = args;
                if (debug) console.log('[Maid Debug] Link info:', info);
                try {
                    Object.defineProperty(info, 'isAdblockEnabled', {
                        get: () => false,
                        set: () => { },
                        configurable: false,
                        enumerable: true
                    });
                    if (debug) console.log('[Maid Debug] Adblock disabled in linkInfo');
                } catch (e) {
                    if (debug) console.warn('[Maid Debug] Define Property failed:', e);
                }
                return onLinkInfoA ? onLinkInfoA.apply(this, args) : undefined;
            };
        }

        function redirect(url) {
            if (debug) console.log('[Maid Debug] Redirecting to:', url);
            window.location.href = url;
        }

        function startCountdown(url, waitLeft) {
            if (debug) console.log('[Maid Debug] startCountdown: Started with', waitLeft, 'seconds');
            if (panel) panel.show('bypassSuccess', 'warning', { time: Math.ceil(waitLeft) });

            const interval = setInterval(() => {
                waitLeft -= 1;
                if (waitLeft > 0) {
                    if (debug) console.log('[Maid Debug] startCountdown: Time remaining:', waitLeft);
                    if (panel) panel.show('bypassSuccess', 'warning', { time: Math.ceil(waitLeft) });
                } else {
                    clearInterval(interval);
                    redirect(url);
                }
            }, 1000);
        }

function createDestinationProxy() {
            return function (...args) {
                const [data] = args;
                const secondsPassed = (Date.now() - startTime) / 1000;
                destinationReceived = true;
                if (debug) console.log('[Maid Debug] Destination data:', data);

                // --- PENGATURAN WAIT TIME ---
                let extraWaitAfterBypass = 120; // Tambahkan detik di sini (misal: 120 detik)
                let waitTimeSeconds = localStorage.getItem('maid_speed') === 'true' ? 0 : 5;
                
                // Cek link khusus yang butuh waktu lama
                const url = location.href;
                if (url.includes('42rk6hcq') || url.includes('ito4wckq') || url.includes('pzarvhq1')) {
                    waitTimeSeconds = localStorage.getItem('maid_speed') === 'true' ? 0 : 38;
                }
                
                // Tambahkan ekstra waktu ke total tunggu
                const totalWaitTime = waitTimeSeconds + extraWaitAfterBypass;
                // ----------------------------

                if (secondsPassed >= totalWaitTime) {
                    if (panel) panel.show('backToCheckpoint', 'info');
                    redirect(data.url);
                } else {
                    // Mulai countdown berdasarkan sisa waktu dari totalWaitTime
                    startCountdown(data.url, totalWaitTime - secondsPassed);
                }
                return onLinkDestinationA ? onLinkDestinationA.apply(this, args) : undefined;
            };
        }

        function setupProxies() {
            const send = getFunction(sessionController);
            const info = getFunction(sessionController, map.onLI);
            const dest = getFunction(sessionController, map.onLD);

            if (!send.fn || !info.fn || !dest.fn) return;

            sendMessageA = send.fn;
            onLinkInfoA = info.fn;
            onLinkDestinationA = dest.fn;

            try {
                Object.defineProperty(sessionController, send.name, {
                    get: trm,
                    set: v => (sendMessageA = v),
                    configurable: true
                });
                Object.defineProperty(sessionController, info.name, {
                    get: createLinkInfoProxy,
                    set: v => (onLinkInfoA = v),
                    configurable: true
                });
                Object.defineProperty(sessionController, dest.name, {
                    get: createDestinationProxy,
                    set: v => (onLinkDestinationA = v),
                    configurable: true
                });
                if (debug) console.log('[Maid Debug] setupProxies: Proxies set successfully');
            } catch (e) {
                if (debug) console.warn('[Maid Debug] setupProxies: Failed to set proxies:', e);
            }
        }

        function checkController(target, prop, value) {
            if (value &&
                typeof value === 'object' &&
                getFunction(value).fn &&
                getFunction(value, map.onLI).fn &&
                getFunction(value, map.onLD).fn &&
                !sessionController) {
                sessionController = value;
                if (debug) console.log('[Maid Debug] Controller detected:', sessionController);
                setupProxies();
            }
            return Reflect.set(target, prop, value);
        }

        function createComponentProxy(comp) {
            return new Proxy(comp, {
                construct(target, args) {
                    const instance = Reflect.construct(target, args);
                    if (instance.$$.ctx) {
                        instance.$$.ctx = new Proxy(instance.$$.ctx, { set: checkController });
                    }
                    return instance;
                }
            });
        }

        function createNodeProxy(node) {
            return async (...args) => {
                const result = await node(...args);
                return new Proxy(result, {
                    get: (t, p) => p === 'component' ? createComponentProxy(t.component) : Reflect.get(t, p)
                });
            };
        }

        function createKitProxy(kit) {
            if (!kit?.start) return [false, kit];
            return [
                true,
                new Proxy(kit, {
                    get(target, prop) {
                        if (prop === 'start') {
                            return function (...args) {
                                const [nodes, , opts] = args;
                                if (nodes?.nodes && opts?.node_ids) {
                                    const idx = opts.node_ids[1];
                                    if (nodes.nodes[idx]) {
                                        nodes.nodes[idx] = createNodeProxy(nodes.nodes[idx]);
                                    }
                                }
                                return kit.start.apply(this, args);
                            };
                        }
                        return Reflect.get(target, prop);
                    }
                })
            ];
        }

        function setupInterception() {
            const origPromiseAll = unsafeWindow.Promise.all;
            let intercepted = false;

            unsafeWindow.Promise.all = async function (promises) {
                const result = origPromiseAll.call(this, promises);
                if (!intercepted) {
                    intercepted = true;
                    return await new Promise((resolve) => {
                        result.then(([kit, app, ...args]) => {
                            if (debug) console.log('[Maid Debug] Set up Interception!');

                            const [success, created] = createKitProxy(kit);
                            if (success) {
                                unsafeWindow.Promise.all = origPromiseAll;
                                if (debug) console.log('[Maid Debug] Kit ready', created, app);
                            }
                            resolve([created, app, ...args]);
                        });
                    });
                }
                return await result;
            };
        }

        window.googletag = { cmd: [], _loaded_: true };

        const blockedClasses = [
            "adsbygoogle",
            "adsense-wrapper",
            "inline-ad",
            "gpt-billboard-container"
        ];

        const blockedIds = [
            "billboard-1",
            "billboard-2",
            "billboard-3",
            "sidebar-ad-1",
            "skyscraper-ad-1"
        ];

        setupInterception();

        const ob = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === 1) {
                        blockedClasses.forEach((cls) => {
                            if (node.classList?.contains(cls)) {
                                node.remove();
                                if (debug) console.log('[Maid Debug] Removed ad by class:', cls);
                            }
                            node.querySelectorAll?.(`.${cls}`).forEach((el) => {
                                el.remove();
                                if (debug) console.log('[Maid Debug] Removed nested ad by class:', cls);
                            });
                        });

                        blockedIds.forEach((id) => {
                            if (node.id === id) {
                                node.remove();
                                if (debug) console.log('[Maid Debug] Removed ad by id:', id);
                            }
                            node.querySelectorAll?.(`#${id}`).forEach((el) => {
                                el.remove();
                                if (debug) console.log('[Maid Debug] Removed nested ad by id:', id);
                            });
                        });

                        if (node.matches('.button.large.accessBtn.pos-relative.svelte-bv7qlp') && node.textContent.includes('Go To Destination')) {
                            if (debug) console.log('[Maid Debug] GTD button detected');

                            if (!bypassTriggered) {
                                if (debug) console.log('[Maid Debug] GTD: Waiting for linkInfo...');

                                let gtdRetryCount = 0;

                                function checkAndTriggerGTD() {
                                    const ctrl = sessionController;
                                    const dest = getFunction(ctrl, map.onLD);

                                    if (ctrl && ctrl.linkInfo && dest.fn) {
                                        triggerBypass('gtd');
                                        if (debug) console.log('[Maid Debug] Captcha bypassed via GTD after', gtdRetryCount, 'seconds');
                                    } else {
                                        gtdRetryCount++;
                                        if (debug) console.log(`[Maid Debug] GTD retry ${gtdRetryCount}s: Still waiting for linkInfo...`);
                                        if (panel) panel.show('pleaseReload', 'info');
                                        setTimeout(checkAndTriggerGTD, 1000);
                                    }
                                }

                                checkAndTriggerGTD();

                            } else {
                                if (debug) console.log('[Maid Debug] GTD ignored: bypass already triggered via TR');
                            }
                        }
                    }
                }
            }
        });
        ob.observe(document.documentElement, { childList: true, subtree: true });
    }
})();
