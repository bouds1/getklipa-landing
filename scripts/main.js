/* Replace with your Tally form public IDs (tally.so → form → share → public ID). */
var TALLY_WAITLIST_ID = 'YOUR_WAITLIST_TALLY_ID';
var TALLY_PARTNER_ID = 'YOUR_PARTNER_TALLY_ID';

function tallyWaitlistReady() {
  return TALLY_WAITLIST_ID && TALLY_WAITLIST_ID.indexOf('YOUR_WAITLIST_') === -1;
}
function tallyPartnerReady() {
  return TALLY_PARTNER_ID && TALLY_PARTNER_ID.indexOf('YOUR_PARTNER_') === -1;
}
function buildTallyWaitlistSrc() {
  if (!tallyWaitlistReady()) return '';
  return 'https://tally.so/embed/' + encodeURIComponent(TALLY_WAITLIST_ID) +
    '?alignLeft=1&hideTitle=1&dynamicHeight=1&transparentBackground=1';
}
function setWaitlistSuccess(wrap) {
  var embed = wrap.querySelector('.tally-embed-wrap');
  var form = wrap.querySelector('.waitlist-form');
  var success = wrap.querySelector('.form-success');
  if (embed) embed.hidden = true;
  if (form) {
    var p = form.parentNode;
    if (p) p.removeChild(form);
  }
  if (success) {
    success.hidden = false;
    success.textContent = "You're on the list. We'll be in touch.";
  }
}
function initWaitlistEmbeds() {
  var src = buildTallyWaitlistSrc();
  var wraps = document.querySelectorAll('[data-klipa-tally-waitlist]');
  wraps.forEach(function (wrap) {
    var box = wrap.querySelector('.tally-embed-wrap');
    var which = wrap.getAttribute('data-klipa-tally-waitlist');
    if (src) {
      var iframe = document.createElement('iframe');
      iframe.className = 'tally-iframe';
      iframe.title = 'Join the Klipa waitlist';
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('src', src);
      if (box) {
        box.innerHTML = '';
        box.appendChild(iframe);
      }
    } else {
      var tpl = document.getElementById('klipa-waitlist-fallback-' + which);
      if (box && tpl && tpl.content) {
        box.appendChild(tpl.content.cloneNode(true));
        var fr = box.querySelector('.waitlist-form');
        if (fr) {
          fr.addEventListener('submit', function (e) {
            e.preventDefault();
            setWaitlistSuccess(wrap);
          });
        }
      }
    }
  });
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://tally.so' || !e.data || e.data.event !== 'Tally.FormSubmitted') {
      return;
    }
    var iframes = document.querySelectorAll('iframe.tally-iframe');
    for (var i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow === e.source) {
        var w = iframes[i].closest('[data-klipa-tally-waitlist]');
        if (w) setWaitlistSuccess(w);
        return;
      }
    }
  });
}
function initPartnerCta() {
  var btn = document.getElementById('partner-cta');
  if (!btn) return;
  if (!tallyPartnerReady()) {
    btn.disabled = true;
    btn.setAttribute('title', 'Set TALLY_PARTNER_ID in scripts/main.js to enable.');
    return;
  }
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    if (window.Tally && typeof window.Tally.openPopup === 'function') {
      window.Tally.openPopup(TALLY_PARTNER_ID, { width: 520 });
    } else {
      window.open('https://tally.so/r/' + encodeURIComponent(TALLY_PARTNER_ID), '_blank', 'noopener,noreferrer');
    }
  });
}

// Dynamic current-week date on the example deal card.
// Computes Sunday–Saturday window and handles cross-month rollover.
(function () {
  var today = new Date();
  var dow = today.getDay();
  var sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dow);
  var saturday = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + 6);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var sMo = months[sunday.getMonth()];
  var eMo = months[saturday.getMonth()];
  var txt = sMo === eMo
    ? 'Valid ' + sMo + ' ' + sunday.getDate() + '–' + saturday.getDate()
    : 'Valid ' + sMo + ' ' + sunday.getDate() + ' – ' + eMo + ' ' + saturday.getDate();
  document.querySelectorAll('[data-klipa-valid-date]').forEach(function (el) {
    el.textContent = txt;
  });
})();

// Scroll-triggered fade-up. Grouped siblings (steps, FAQ items, bullets) stagger.
(function () {
  var selectors = [
    '.coverage .coverage-label',
    '.coverage .coverage-list',
    '.how-it-works .section-head',
    '.how-it-works .step',
    '.deal-teaser .section-head',
    '.deal-teaser .deal-card',
    '.deal-teaser .deal-callouts',
    '.why .section-head',
    '.why .why-item',
    '.vocab .vocab-card',
    '.cta h2',
    '.cta p.sub',
    '.cta .waitlist-embed',
    '.cta .form-note',
    '.cta .socials',
    '.faq .section-head',
    '.faq .faq-item',
    '.partner .eyebrow',
    '.partner h2',
    '.partner .partner-lead',
    '.partner .partner-bullet',
    '.partner .partner-cta',
    'footer .footer-grid',
    'footer .footer-bottom'
  ];
  var targets = document.querySelectorAll(selectors.join(','));

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('reveal', 'is-visible'); });
    return;
  }

  targets.forEach(function (el) {
    el.classList.add('reveal');
    var parent = el.parentElement;
    if (!parent) return;
    var sameKindSiblings = Array.prototype.filter.call(
      parent.children,
      function (child) { return child.classList && child.classList.contains('reveal'); }
    );
    var idx = sameKindSiblings.indexOf(el);
    if (idx > 0) {
      el.style.transitionDelay = Math.min(idx * 90, 270) + 'ms';
    }
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { io.observe(el); });
})();

function initKlipaForms() {
  initWaitlistEmbeds();
  initPartnerCta();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKlipaForms);
} else {
  initKlipaForms();
}
