/* QR Gen BD — fully offline bilingual QR code generator.
 * QR engine: vendored qrcode-generator (MIT, Kazuhiko Arase) in js/qrcode.js.
 * Zero network requests at runtime: no CDNs, no fonts, no analytics.
 */
(function () {
  'use strict';

  /* ---------------- i18n ---------------- */
  var I18N = {
    en: {
      appTitle: 'QR Gen BD',
      tagline: 'Offline QR code generator — works with no internet',
      langToggle: 'বাংলা',
      genHeading: 'Generate a QR code',
      tabText: 'Text', tabUrl: 'URL', tabWifi: 'WiFi', tabVcard: 'vCard',
      labelText: 'Text to encode', phText: 'Type anything…',
      labelUrl: 'Website URL', phUrl: 'example.com or https://example.com',
      hintUrl: 'Scheme is optional — https:// is added automatically.',
      labelSsid: 'WiFi network name (SSID)', phSsid: 'MyHomeWiFi',
      labelWifiSec: 'Security type', secWpa: 'WPA / WPA2', secWep: 'WEP', secNone: 'None (open network)',
      labelWifiPass: 'Password', phWifiPass: 'WiFi password',
      labelName: 'Full name', phName: 'e.g. Rahim Uddin',
      labelPhone: 'Phone number', phPhone: '+8801XXXXXXXXX',
      labelSize: 'QR size', labelEc: 'Error correction',
      ecL: 'L — Low (~7%)', ecM: 'M — Medium (~15%)', ecQ: 'Q — Quartile (~25%)', ecH: 'H — High (~30%)',
      btnGenerate: 'Generate QR',
      prevHeading: 'Preview', previewEmpty: 'Your QR code will appear here.',
      btnDownload: 'Download PNG', btnCopy: 'Copy text',
      copiedMsg: 'Copied!', copyFailMsg: 'Copy is not available in this browser.',
      dlMsg: 'PNG downloaded.',
      histHeading: 'History', btnExport: 'Export', btnImport: 'Import', btnClear: 'Clear',
      historyEmpty: 'No QR codes yet — generate one above.',
      footerNote: '100% offline — your data never leaves this device.',
      errTextEmpty: 'Please enter some text first.',
      errUrlInvalid: 'That doesn’t look like a valid URL.',
      errSsidEmpty: 'Please enter the WiFi network name (SSID).',
      errWifiPass: 'Please enter the WiFi password.',
      errNameEmpty: 'Please enter a name.',
      errPhoneEmpty: 'Please enter a phone number.',
      errTooLong: 'Text is too long for a QR code — shorten it and try again.',
      importOk: 'History imported.', importBad: 'That file is not a valid QR Gen BD export.',
      clearConfirm: 'Delete all history?', delLabel: 'Delete',
      modeText: 'Text', modeUrl: 'URL', modeWifi: 'WiFi', modeVcard: 'vCard'
    },
    bn: {
      appTitle: 'QR Gen BD',
      tagline: 'অফলাইন কিউআর কোড জেনারেটর — ইন্টারনেট ছাড়াই চলে',
      langToggle: 'English',
      genHeading: 'কিউআর কোড তৈরি করুন',
      tabText: 'টেক্সট', tabUrl: 'ইউআরএল', tabWifi: 'ওয়াইফাই', tabVcard: 'ভিকার্ড',
      labelText: 'এনকোড করার টেক্সট', phText: 'যেকোনো কিছু লিখুন…',
      labelUrl: 'ওয়েবসাইটের URL', phUrl: 'example.com অথবা https://example.com',
      hintUrl: 'স্কিম ঐচ্ছিক — https:// স্বয়ংক্রিয়ভাবে যোগ হয়ে যাবে।',
      labelSsid: 'ওয়াইফাই নেটওয়ার্কের নাম (SSID)', phSsid: 'MyHomeWiFi',
      labelWifiSec: 'সিকিউরিটির ধরন', secWpa: 'WPA / WPA2', secWep: 'WEP', secNone: 'কোনোটি নয় (ওপেন নেটওয়ার্ক)',
      labelWifiPass: 'পাসওয়ার্ড', phWifiPass: 'ওয়াইফাই পাসওয়ার্ড',
      labelName: 'পুরো নাম', phName: 'যেমন: রহিম উদ্দিন',
      labelPhone: 'ফোন নম্বর', phPhone: '+৮৮০১XXXXXXXXX',
      labelSize: 'কিউআর সাইজ', labelEc: 'এরর কারেকশন',
      ecL: 'L — কম (~৭%)', ecM: 'M — মাঝারি (~১৫%)', ecQ: 'Q — কোয়ার্টাইল (~২৫%)', ecH: 'H — বেশি (~৩০%)',
      btnGenerate: 'কিউআর তৈরি করুন',
      prevHeading: 'প্রিভিউ', previewEmpty: 'আপনার কিউআর কোড এখানে দেখা যাবে।',
      btnDownload: 'PNG ডাউনলোড', btnCopy: 'টেক্সট কপি',
      copiedMsg: 'কপি হয়েছে!', copyFailMsg: 'এই ব্রাউজারে কপি করা যাচ্ছে না।',
      dlMsg: 'PNG ডাউনলোড হয়েছে।',
      histHeading: 'ইতিহাস', btnExport: 'এক্সপোর্ট', btnImport: 'ইমপোর্ট', btnClear: 'মুছুন',
      historyEmpty: 'এখনও কোনো কিউআর কোড নেই — উপরে তৈরি করুন।',
      footerNote: '১০০% অফলাইন — আপনার তথ্য এই ডিভাইসের বাইরে যায় না।',
      errTextEmpty: 'প্রথমে কিছু টেক্সট লিখুন।',
      errUrlInvalid: 'এটি বৈধ URL বলে মনে হচ্ছে না।',
      errSsidEmpty: 'ওয়াইফাই নেটওয়ার্কের নাম (SSID) দিন।',
      errWifiPass: 'ওয়াইফাই পাসওয়ার্ড দিন।',
      errNameEmpty: 'একটি নাম দিন।',
      errPhoneEmpty: 'একটি ফোন নম্বর দিন।',
      errTooLong: 'টেক্সটটি কিউআর কোডের জন্য অনেক লম্বা — ছোট করে আবার চেষ্টা করুন।',
      importOk: 'ইতিহাস ইমপোর্ট হয়েছে।', importBad: 'ফাইলটি বৈধ QR Gen BD এক্সপোর্ট নয়।',
      clearConfirm: 'সব ইতিহাস মুছে ফেলবেন?', delLabel: 'মুছুন',
      modeText: 'টেক্সট', modeUrl: 'ইউআরএল', modeWifi: 'ওয়াইফাই', modeVcard: 'ভিকার্ড'
    }
  };

  var LS_HISTORY = 'qrgenbd_history_v1';
  var LS_LANG = 'qrgenbd_lang_v1';
  var MAX_HISTORY = 50;

  var lang = 'en';
  try { lang = localStorage.getItem(LS_LANG) || 'en'; } catch (e) { lang = 'en'; }
  if (!I18N[lang]) lang = 'en';

  var state = {
    mode: 'text',
    lastPayload: null,
    lastSize: 512,
    lastEc: 'M',
    lastLabel: ''
  };

  function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }

  function $(id) { return document.getElementById(id); }

  /* ---------------- QR engine ---------------- */
  // Force UTF-8 byte encoding so Bangla (and any Unicode) text encodes correctly.
  if (typeof qrcode !== 'undefined' && qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  }

  function makeQR(payload, ecLevel) {
    var qr = qrcode(0, ecLevel); // 0 = auto-detect version
    qr.addData(payload, 'Byte');
    qr.make();
    return qr;
  }

  function renderQR(payload, size, ecLevel) {
    var qr = makeQR(payload, ecLevel);
    var modules = qr.getModuleCount();
    var quiet = 4; // standard quiet zone
    var total = modules + quiet * 2;
    var scale = Math.max(1, Math.floor(size / total));
    var px = total * scale;
    var canvas = $('qrCanvas');
    canvas.width = px;
    canvas.height = px;
    // CSS keeps it responsive; width attr holds the real pixels.
    canvas.style.width = Math.min(size, 340) + 'px';
    canvas.style.height = Math.min(size, 340) + 'px';
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = '#000000';
    for (var r = 0; r < modules; r++) {
      for (var c = 0; c < modules; c++) {
        if (qr.isDark(r, c)) {
          ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
        }
      }
    }
    return canvas;
  }

  /* ---------------- payload builders ---------------- */
  function escapeWifi(s) {
    return s.replace(/([\\;,:"])/g, '\\$1');
  }

  function normalizeUrl(raw) {
    var s = (raw || '').trim();
    if (!s || /\s/.test(s)) return null;
    var withScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s) ? s : 'https://' + s;
    try {
      var u = new URL(withScheme);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
      var host = u.hostname;
      if (!host || host.indexOf('.') < 0) return null;
      var tld = host.split('.').pop();
      if (!tld || tld.length < 2) return null;
      if (/[^a-zA-Z0-9.\-_:/?#\[\]@!$&'()*+,;=%~]/.test(s) && /[\u0080-\uFFFF]/.test(s)) return null;
      return withScheme;
    } catch (e) {
      return null;
    }
  }

  function buildPayload(mode) {
    if (mode === 'text') {
      var txt = $('inText').value.trim();
      if (!txt) return { error: t('errTextEmpty') };
      return { payload: txt, label: txt };
    }
    if (mode === 'url') {
      var url = normalizeUrl($('inUrl').value);
      if (!url) return { error: t('errUrlInvalid') };
      return { payload: url, label: url };
    }
    if (mode === 'wifi') {
      var ssid = $('inSsid').value.trim();
      var sec = $('inWifiSec').value;
      var pass = $('inWifiPass').value;
      if (!ssid) return { error: t('errSsidEmpty') };
      if ((sec === 'WPA' || sec === 'WEP') && !pass) return { error: t('errWifiPass') };
      var payload = 'WIFI:T:' + sec + ';S:' + escapeWifi(ssid) + ';';
      if (sec !== 'nopass') payload += 'P:' + escapeWifi(pass) + ';';
      payload += ';';
      return { payload: payload, label: 'WiFi: ' + ssid };
    }
    if (mode === 'vcard') {
      var name = $('inName').value.trim();
      var phone = $('inPhone').value.trim();
      if (!name) return { error: t('errNameEmpty') };
      if (!phone) return { error: t('errPhoneEmpty') };
      var vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:' + name + '\nTEL;TYPE=CELL:' + phone + '\nEND:VCARD';
      return { payload: vcard, label: name + ' (' + phone + ')' };
    }
    return { error: t('errTextEmpty') };
  }

  /* ---------------- history ---------------- */
  function loadHistory() {
    try {
      var raw = localStorage.getItem(LS_HISTORY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter(function (e) {
        return e && typeof e.payload === 'string' && typeof e.mode === 'string';
      }) : [];
    } catch (e) { return []; }
  }

  function saveHistory(items) {
    try { localStorage.setItem(LS_HISTORY, JSON.stringify(items.slice(0, MAX_HISTORY))); } catch (e) {}
  }

  function addHistory(entry) {
    var items = loadHistory();
    // avoid exact duplicates stacking: move existing to top
    items = items.filter(function (e) { return !(e.payload === entry.payload && e.mode === entry.mode); });
    items.unshift(entry);
    saveHistory(items);
    renderHistory();
  }

  function fmtTs(iso) {
    try {
      return new Date(iso).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-GB', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return iso; }
  }

  function modeBadge(m) {
    if (m === 'url') return t('modeUrl');
    if (m === 'wifi') return t('modeWifi');
    if (m === 'vcard') return t('modeVcard');
    return t('modeText');
  }

  function renderHistory() {
    var items = loadHistory();
    var list = $('historyList');
    list.innerHTML = '';
    $('historyEmpty').style.display = items.length ? 'none' : '';
    items.forEach(function (entry) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'history-item';
      btn.setAttribute('data-hid', entry.id);

      var badge = document.createElement('span');
      badge.className = 'hist-mode';
      badge.textContent = modeBadge(entry.mode);

      var text = document.createElement('span');
      text.className = 'hist-text';
      var label = document.createElement('span');
      label.className = 'hist-label';
      label.textContent = entry.label || entry.payload;
      label.title = entry.payload;
      var ts = document.createElement('span');
      ts.className = 'hist-ts';
      ts.textContent = fmtTs(entry.ts);
      text.appendChild(label);
      text.appendChild(ts);

      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'hist-del';
      del.setAttribute('aria-label', t('delLabel'));
      del.textContent = '×';
      del.addEventListener('click', function (ev) {
        ev.stopPropagation();
        saveHistory(loadHistory().filter(function (e) { return e.id !== entry.id; }));
        renderHistory();
      });

      btn.appendChild(badge);
      btn.appendChild(text);
      btn.appendChild(del);
      btn.addEventListener('click', function () { regenerate(entry); });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function regenerate(entry) {
    // switch tab + restore options, then generate the exact same payload
    setMode(entry.mode, true);
    if (entry.size) $('inSize').value = String(entry.size);
    if (entry.ec) $('inEc').value = entry.ec;
    state.lastPayload = entry.payload;
    state.lastLabel = entry.label || entry.payload;
    state.lastSize = entry.size || 512;
    state.lastEc = entry.ec || 'M';
    try {
      renderQR(entry.payload, state.lastSize, state.lastEc);
    } catch (e) {
      showError(t('errTooLong'));
      return;
    }
    showPreview(entry.payload, state.lastLabel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------- UI: modes / language ---------------- */
  function setMode(mode, silent) {
    state.mode = mode;
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      var active = tab.getAttribute('data-mode') === mode;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('.mode-fields').forEach(function (box) {
      box.classList.toggle('hidden', box.getAttribute('data-fields') !== mode);
    });
    if (!silent) hideError();
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (I18N[lang][key]) el.textContent = I18N[lang][key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (I18N[lang][key]) el.setAttribute('placeholder', I18N[lang][key]);
    });
    renderHistory(); // re-render badges + timestamps in the new language
  }

  function showError(msg) {
    var box = $('formError');
    box.textContent = msg;
    box.hidden = false;
  }
  function hideError() { $('formError').hidden = true; }

  function showPreview(payload, label) {
    $('previewEmpty').hidden = true;
    $('previewResult').hidden = false;
    $('payloadLine').textContent = payload;
    $('payloadLine').title = label || payload;
    $('dlStatus').hidden = true;
  }

  /* ---------------- actions ---------------- */
  function generate(fromEvent) {
    if (fromEvent) fromEvent.preventDefault();
    hideError();
    var built = buildPayload(state.mode);
    if (built.error) { showError(built.error); return false; }
    var size = parseInt($('inSize').value, 10) || 512;
    var ec = $('inEc').value || 'M';
    try {
      renderQR(built.payload, size, ec);
    } catch (e) {
      showError(t('errTooLong'));
      return false;
    }
    state.lastPayload = built.payload;
    state.lastLabel = built.label;
    state.lastSize = size;
    state.lastEc = ec;
    showPreview(built.payload, built.label);
    addHistory({
      id: 'h' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36),
      mode: state.mode,
      payload: built.payload,
      label: built.label,
      size: size,
      ec: ec,
      ts: new Date().toISOString()
    });
    return true;
  }

  function downloadPNG() {
    var canvas = $('qrCanvas');
    if (!canvas || !state.lastPayload) return;
    var dataUrl = canvas.toDataURL('image/png');
    var a = document.createElement('a');
    var safe = (state.lastLabel || 'qr').replace(/[^\w\-।-হ০-৯]+/g, '_').slice(0, 40) || 'qr';
    a.download = 'qr-gen-bd-' + safe + '-' + state.lastSize + 'px.png';
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    var st = $('dlStatus');
    st.textContent = t('dlMsg');
    st.hidden = false;
  }

  function copyText() {
    var txt = state.lastPayload || '';
    if (!txt) return;
    function done(ok) {
      var st = $('dlStatus');
      st.textContent = ok ? t('copiedMsg') : t('copyFailMsg');
      st.hidden = false;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { done(false); });
    } else {
      try {
        var ta = document.createElement('textarea');
        ta.value = txt;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        done(!!ok);
      } catch (e) { done(false); }
    }
  }

  function exportHistory() {
    var items = loadHistory();
    var blob = new Blob([JSON.stringify({ app: 'qr-gen-bd', version: 1, items: items }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.download = 'qr-gen-bd-history.json';
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 500);
  }

  function importHistory(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var items = Array.isArray(data) ? data : data.items;
        if (!Array.isArray(items)) throw new Error('bad shape');
        var clean = items.filter(function (e) {
          return e && typeof e.payload === 'string' && typeof e.mode === 'string';
        }).map(function (e, i) {
          return {
            id: (typeof e.id === 'string' ? e.id : 'imp' + i + '_' + Date.now().toString(36)),
            mode: e.mode, payload: e.payload,
            label: typeof e.label === 'string' ? e.label : e.payload,
            size: parseInt(e.size, 10) || 512, ec: typeof e.ec === 'string' ? e.ec : 'M',
            ts: typeof e.ts === 'string' ? e.ts : new Date().toISOString()
          };
        });
        if (!clean.length) throw new Error('empty');
        saveHistory(clean.concat(loadHistory()));
        renderHistory();
        var st = $('dlStatus');
        st.textContent = t('importOk');
        st.hidden = false;
      } catch (e) {
        showError(t('importBad'));
      }
    };
    reader.readAsText(file);
  }

  /* ---------------- wire up ---------------- */
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () { setMode(tab.getAttribute('data-mode')); });
  });

  $('inWifiSec').addEventListener('change', function () {
    $('wifiPassWrap').style.display = this.value === 'nopass' ? 'none' : '';
  });

  $('qrForm').addEventListener('submit', generate);
  $('dlBtn').addEventListener('click', downloadPNG);
  $('copyBtn').addEventListener('click', copyText);

  $('langToggle').addEventListener('click', function () {
    lang = (lang === 'en') ? 'bn' : 'en';
    try { localStorage.setItem(LS_LANG, lang); } catch (e) {}
    applyLang();
  });

  $('exportBtn').addEventListener('click', exportHistory);
  $('importBtn').addEventListener('click', function () { $('importFile').click(); });
  $('importFile').addEventListener('change', function () {
    if (this.files && this.files[0]) importHistory(this.files[0]);
    this.value = '';
  });
  $('clearBtn').addEventListener('click', function () {
    if (window.confirm(t('clearConfirm'))) {
      saveHistory([]);
      renderHistory();
    }
  });

  applyLang();
  renderHistory();
  setMode('text', true);

  /* Exposed for automated tests (not part of the UI). */
  window.__qrgen = {
    buildPayload: buildPayload,
    normalizeUrl: normalizeUrl,
    renderQR: renderQR,
    generate: generate,
    setMode: setMode,
    getState: function () { return state; },
    loadHistory: loadHistory,
    getLang: function () { return lang; }
  };
})();
