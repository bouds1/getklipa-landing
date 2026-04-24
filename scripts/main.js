/* Web3Forms: waitlist and partner/retailer use different forms (two access keys; set per env on getklipa.com).
   Get or rotate at https://web3forms.com
   Current values: shared test key; replace each with its production form key before/after domain deploy.
   Waitlist: if waitlist key is set, native .waitlist-form; else Tally embed, else local demo. */

var WEB3FORMS_ACCESS_KEY_WAITLIST = '948661db-1093-432d-8599-97b2044eb87d';
var WEB3FORMS_ACCESS_KEY_PARTNER = '948661db-1093-432d-8599-97b2044eb87d';
var TALLY_WAITLIST_ID = 'xX0J7k';

function web3formsWaitlistReady() {
  return (
    WEB3FORMS_ACCESS_KEY_WAITLIST &&
    WEB3FORMS_ACCESS_KEY_WAITLIST.indexOf('YOUR_WEB3FORMS_WAITLIST') === -1
  );
}
function web3formsPartnerReady() {
  return (
    WEB3FORMS_ACCESS_KEY_PARTNER &&
    WEB3FORMS_ACCESS_KEY_PARTNER.indexOf('YOUR_WEB3FORMS_PARTNER') === -1
  );
}
function tallyWaitlistReady() {
  return TALLY_WAITLIST_ID && TALLY_WAITLIST_ID.indexOf('YOUR_WAITLIST_') === -1;
}
function buildTallyWaitlistSrc() {
  if (!tallyWaitlistReady()) return '';
  return 'https://tally.so/embed/' + encodeURIComponent(TALLY_WAITLIST_ID) +
    '?alignLeft=1&hideTitle=1&dynamicHeight=1&transparentBackground=1';
}
function setWaitlistError(wrap, message) {
  var err = wrap.querySelector('.form-error');
  if (!err) return;
  if (message) {
    err.textContent = message;
    err.hidden = false;
  } else {
    err.textContent = '';
    err.hidden = true;
  }
}
function setWaitlistSuccess(wrap) {
  var embed = wrap.querySelector('.tally-embed-wrap');
  var form = wrap.querySelector('.waitlist-form');
  var success = wrap.querySelector('.form-success');
  setWaitlistError(wrap, '');
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
function submitToWeb3Forms(wrap, form) {
  var input = form.querySelector('input[type="email"]');
  var email = (input && input.value) || '';
  if (!email) return;
  var btn = form.querySelector('button[type="submit"]');
  if (btn) {
    btn.disabled = true;
    var prev = btn.getAttribute('data-prev-label') || btn.textContent;
    btn.setAttribute('data-prev-label', prev);
    btn.textContent = '…';
  }
  setWaitlistError(wrap, '');
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY_WAITLIST,
      email: email,
      subject: 'Klipa — waitlist signup',
      from_name: 'Klipa website',
    }),
  })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data && data.success) {
        setWaitlistSuccess(wrap);
      } else {
        setWaitlistError(
          wrap,
          (data && data.message) || 'Something went wrong. Please try again.'
        );
      }
    })
    .catch(function () {
      setWaitlistError(wrap, 'Network error. Please try again.');
    })
    .finally(function () {
      if (btn) {
        btn.disabled = false;
        var l = btn.getAttribute('data-prev-label');
        if (l) btn.textContent = l;
      }
    });
}
function initNativeWaitlist() {
  var wraps = document.querySelectorAll('[data-klipa-tally-waitlist]');
  wraps.forEach(function (wrap) {
    wrap.classList.add('waitlist-embed--native');
    var box = wrap.querySelector('.tally-embed-wrap');
    var which = wrap.getAttribute('data-klipa-tally-waitlist');
    if (!box) return;
    var tpl = document.getElementById('klipa-waitlist-fallback-' + which);
    if (tpl && tpl.content) {
      box.innerHTML = '';
      box.appendChild(tpl.content.cloneNode(true));
    }
    var fr = box.querySelector('.waitlist-form');
    if (fr) {
      fr.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!fr.checkValidity()) {
          fr.reportValidity();
          return;
        }
        submitToWeb3Forms(wrap, fr);
      });
    }
  });
}
function initTallyWaitlistIframes() {
  var src = buildTallyWaitlistSrc();
  if (!src) return;
  var wraps = document.querySelectorAll('[data-klipa-tally-waitlist]');
  wraps.forEach(function (wrap) {
    var box = wrap.querySelector('.tally-embed-wrap');
    if (box) {
      box.innerHTML = '';
      var iframe = document.createElement('iframe');
      iframe.className = 'tally-iframe';
      iframe.title = 'Join the Klipa waitlist';
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('src', src);
      box.appendChild(iframe);
    }
  });
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://tally.so' || !e.data) {
      return;
    }
    var d = e.data;
    if (typeof d === 'string') {
      try { d = JSON.parse(d); } catch (x) { return; }
    }
    if (!d || d.event !== 'Tally.FormSubmitted') {
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
function initLocalDemoWaitlist() {
  var wraps = document.querySelectorAll('[data-klipa-tally-waitlist]');
  wraps.forEach(function (wrap) {
    wrap.classList.add('waitlist-embed--native');
    var box = wrap.querySelector('.tally-embed-wrap');
    var which = wrap.getAttribute('data-klipa-tally-waitlist');
    if (!box) return;
    var tpl = document.getElementById('klipa-waitlist-fallback-' + which);
    if (tpl && tpl.content) {
      box.innerHTML = '';
      box.appendChild(tpl.content.cloneNode(true));
    }
    var fr = box.querySelector('.waitlist-form');
    if (fr) {
      fr.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!fr.checkValidity()) {
          fr.reportValidity();
          return;
        }
        setWaitlistSuccess(wrap);
      });
    }
  });
}
function initWaitlist() {
  if (web3formsWaitlistReady()) {
    initNativeWaitlist();
    return;
  }
  if (tallyWaitlistReady()) {
    initTallyWaitlistIframes();
    return;
  }
  initLocalDemoWaitlist();
}
function resetPartnerDialog() {
  var form = document.getElementById('partner-inquiry-form');
  var err = document.getElementById('partner-dialog-error');
  var success = document.getElementById('partner-dialog-success');
  if (form) {
    form.reset();
    form.hidden = false;
  }
  if (err) {
    err.textContent = '';
    err.hidden = true;
  }
  if (success) success.hidden = true;
}
function setPartnerError(msg) {
  var el = document.getElementById('partner-dialog-error');
  if (!el) return;
  if (msg) {
    el.textContent = msg;
    el.hidden = false;
  } else {
    el.textContent = '';
    el.hidden = true;
  }
}
function showPartnerSuccess() {
  var form = document.getElementById('partner-inquiry-form');
  var success = document.getElementById('partner-dialog-success');
  var closeOk = document.getElementById('partner-success-close');
  if (form) form.hidden = true;
  if (success) success.hidden = false;
  setPartnerError('');
  if (closeOk) {
    setTimeout(function () { closeOk.focus(); }, 0);
  }
}
function openPartnerDialog() {
  if (!web3formsPartnerReady()) return;
  var d = document.getElementById('partner-dialog');
  if (!d) return;
  if (typeof d.showModal !== 'function') {
    return;
  }
  resetPartnerDialog();
  d.showModal();
  var nameInput = document.getElementById('partner-name');
  if (nameInput) {
    setTimeout(function () { nameInput.focus(); }, 0);
  }
}
function submitPartnerForm(e) {
  e.preventDefault();
  var form = e.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  var name = (document.getElementById('partner-name').value || '').trim();
  var store = (document.getElementById('partner-store').value || '').trim();
  var role = (document.getElementById('partner-role').value || '').trim();
  var email = (document.getElementById('partner-email').value || '').trim();
  var phone = (document.getElementById('partner-phone').value || '').trim();
  var messageBody = (document.getElementById('partner-message').value || '').trim();
  var submitBtn = document.getElementById('partner-form-submit');
  if (submitBtn) {
    submitBtn.disabled = true;
    var prev = submitBtn.getAttribute('data-prev-label') || submitBtn.textContent;
    submitBtn.setAttribute('data-prev-label', prev);
    submitBtn.textContent = 'Sending…';
  }
  setPartnerError('');
  /* Web3Forms forwards custom JSON keys to your inbox as separate fields (see
     https://docs.web3forms.com/getting-started/api-reference). */
  var partnerPayload = {
    access_key: WEB3FORMS_ACCESS_KEY_PARTNER,
    subject: 'Klipa — Partner one-pager request',
    name: name,
    email: email,
    'Store or chain': store,
    Role: role,
    phone: phone || '—',
    message: messageBody,
  };
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(partnerPayload),
  })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data && data.success) {
        showPartnerSuccess();
      } else {
        setPartnerError(
          (data && data.message) || 'Something went wrong. Please try again.'
        );
      }
    })
    .catch(function () {
      setPartnerError(
        'Network error. Please try again or email jake@getklipa.com.'
      );
    })
    .finally(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        var l = submitBtn.getAttribute('data-prev-label');
        if (l) submitBtn.textContent = l;
      }
    });
}
function initPartnerCta() {
  var openBtn = document.getElementById('partner-cta');
  var dialog = document.getElementById('partner-dialog');
  var surface = document.getElementById('partner-dialog-surface');
  var form = document.getElementById('partner-inquiry-form');
  if (!openBtn || !dialog) return;
  if (!web3formsPartnerReady()) {
    openBtn.disabled = true;
    openBtn.setAttribute('title', 'Set WEB3FORMS_ACCESS_KEY_PARTNER in scripts/main.js to enable partner requests.');
    return;
  }
  openBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openPartnerDialog();
  });
  if (surface) {
    surface.addEventListener('click', function (e) {
      if (e.target === surface) {
        dialog.close();
      }
    });
  }
  var closeEl = document.getElementById('partner-dialog-close');
  var cancelEl = document.getElementById('partner-form-cancel');
  var successClose = document.getElementById('partner-success-close');
  if (closeEl) closeEl.addEventListener('click', function () { dialog.close(); });
  if (cancelEl) cancelEl.addEventListener('click', function () { dialog.close(); });
  if (successClose) successClose.addEventListener('click', function () { dialog.close(); });
  if (form) form.addEventListener('submit', submitPartnerForm);
  dialog.addEventListener('close', function () {
    resetPartnerDialog();
    if (openBtn) openBtn.focus();
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
  initWaitlist();
  initPartnerCta();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKlipaForms);
} else {
  initKlipaForms();
}
