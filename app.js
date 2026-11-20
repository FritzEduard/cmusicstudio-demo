/* CMusicStudio prototype.
 * Everything runs in the browser: bookings are kept in localStorage and the "email to the owner" is only shown on
 * screen. The two marked STUB spots below are where a real backend (database + AWS SES + payment provider) plugs in. */
(function () {
  'use strict';

  var CONFIG = {
    rates: { rehearsal: 7500, recording: 15000 },   // FCFA per hour, placeholders
    maxHours: { rehearsal: 4, recording: 8 },
    open: 10, close: 22,                             // first start 10:00, last end 22:00
    depositShare: 0.3,
    ownerEmail: 'owner@cmusicstudio.example'
  };

  var TEXT = {
    fr: {
      nav_studio: 'Le studio', nav_contact: 'Contact', cta_reserve: 'Réserver',
      hero_eyebrow: "Studio de répétition et d'enregistrement · Sénégal",
      hero_title: 'Votre son mérite une vraie salle.',
      hero_lead: "Répétez avec votre groupe ou enregistrez votre projet avec un ingénieur du son. Réservez en ligne en moins d'une minute.",
      cta_reserve_now: 'Réserver un créneau', cta_discover: 'Découvrir le studio',
      hl_title: "Le studio en un coup d'œil", hl_sub: 'Photos et textes à remplacer par ceux du studio.',
      ph_photo: 'Photo à venir',
      hl1_t: 'Salle de répétition', hl1_d: 'Salle insonorisée, batterie, amplis guitare et basse, sono et micros.',
      hl2_t: "Cabine d'enregistrement", hl2_d: "Régie, cabine voix et prise d'instruments, avec un ingénieur du son pour enregistrer, mixer et masteriser.",
      hl3_t: 'Matériel pro', hl3_d: 'Interfaces audio, micros à condensateur, monitoring de référence. Liste du matériel à compléter.',
      rate_rehearsal: 'Répétition, par heure', rate_recording: 'Enregistrement avec ingénieur, par heure',
      rv_title: 'Réserver un créneau', rv_sub: 'Choisissez le service, le jour et l\'heure. Vous recevrez une confirmation après validation par le studio.',
      rv_step1: 'Service', rv_step2: 'Date', rv_step3: 'Heure et durée', rv_step4: 'Vos informations', rv_step5: 'Paiement',
      svc_rehearsal: 'Répétition', svc_recording: 'Enregistrement',
      lg_free: 'Disponible', lg_some: 'Presque complet', lg_full: 'Complet',
      pick_day: "Choisissez d'abord un jour.", pick_time: 'Choisissez une heure de début.', no_slot: 'Aucun créneau libre ce jour-là.',
      dur: 'Durée', hours: function (n) { return n + ' h'; },
      f_name: 'Nom ou nom du groupe', f_phone: 'Téléphone (WhatsApp)', f_email: 'E-mail (facultatif)', f_note: 'Message (facultatif)',
      pay_card: 'Carte bancaire', pay_onsite: 'Sur place',
      hint_online: function (d) { return 'Après validation par le studio, vous recevez un lien de paiement pour l\'acompte de ' + d + '.'; },
      hint_onsite: 'Vous payez au studio. Le créneau est confirmé après validation par le studio.',
      cta_send: 'Envoyer ma demande',
      sum_title: 'Récapitulatif', sum_service: 'Service', sum_when: 'Quand', sum_total: 'Total', sum_deposit: 'Acompte (30 %)',
      err_day: 'Choisissez un jour.', err_slot: 'Choisissez une heure de début.', err_name: 'Indiquez votre nom.',
      err_phone: 'Indiquez un numéro de téléphone valide.', err_email: 'Cet e-mail ne semble pas valide.',
      done_title: 'Demande envoyée ✔',
      done_text: function (ref) { return 'Référence ' + ref + '. Le studio valide votre demande et vous répond par WhatsApp ou e-mail.'; },
      done_mail: 'E-mail envoyé au propriétaire (aperçu du prototype)', done_again: 'Faire une autre réservation',
      ct_title: 'Contact', ct_sub: 'Coordonnées à remplacer.', ct_addr: 'Adresse du studio, Dakar, Sénégal',
      foot_proto: 'Prototype',
      svcName: { rehearsal: 'Répétition', recording: 'Enregistrement' },
      payName: { wave: 'Wave', om: 'Orange Money', card: 'Carte bancaire', onsite: 'Sur place' }
    },
    en: {
      nav_studio: 'The studio', nav_contact: 'Contact', cta_reserve: 'Book',
      hero_eyebrow: 'Rehearsal and recording studio · Senegal',
      hero_title: 'Your sound deserves a real room.',
      hero_lead: 'Rehearse with your band or record your project with a sound engineer. Book online in under a minute.',
      cta_reserve_now: 'Book a slot', cta_discover: 'Discover the studio',
      hl_title: 'The studio at a glance', hl_sub: "Photos and texts to be replaced with the studio's own.",
      ph_photo: 'Photo coming soon',
      hl1_t: 'Rehearsal room', hl1_d: 'Soundproofed room with drums, guitar and bass amps, PA and microphones.',
      hl2_t: 'Recording booth', hl2_d: 'Control room, vocal booth and instrument tracking, with a sound engineer to record, mix and master.',
      hl3_t: 'Pro gear', hl3_d: 'Audio interfaces, condenser microphones, reference monitoring. Gear list to be completed.',
      rate_rehearsal: 'Rehearsal, per hour', rate_recording: 'Recording with engineer, per hour',
      rv_title: 'Book a slot', rv_sub: 'Pick the service, the day and the time. You get a confirmation once the studio has approved it.',
      rv_step1: 'Service', rv_step2: 'Date', rv_step3: 'Time and length', rv_step4: 'Your details', rv_step5: 'Payment',
      svc_rehearsal: 'Rehearsal', svc_recording: 'Recording',
      lg_free: 'Available', lg_some: 'Almost full', lg_full: 'Full',
      pick_day: 'Pick a day first.', pick_time: 'Pick a start time.', no_slot: 'No free slot that day.',
      dur: 'Length', hours: function (n) { return n + ' h'; },
      f_name: 'Name or band name', f_phone: 'Phone (WhatsApp)', f_email: 'Email (optional)', f_note: 'Message (optional)',
      pay_card: 'Bank card', pay_onsite: 'On site',
      hint_online: function (d) { return 'Once the studio approves, you receive a payment link for the ' + d + ' deposit.'; },
      hint_onsite: 'You pay at the studio. The slot is confirmed once the studio approves it.',
      cta_send: 'Send my request',
      sum_title: 'Summary', sum_service: 'Service', sum_when: 'When', sum_total: 'Total', sum_deposit: 'Deposit (30%)',
      err_day: 'Pick a day.', err_slot: 'Pick a start time.', err_name: 'Enter your name.',
      err_phone: 'Enter a valid phone number.', err_email: 'That email does not look valid.',
      done_title: 'Request sent ✔',
      done_text: function (ref) { return 'Reference ' + ref + '. The studio will approve your request and reply by WhatsApp or email.'; },
      done_mail: 'Email sent to the owner (prototype preview)', done_again: 'Make another booking',
      ct_title: 'Contact', ct_sub: 'Details to be replaced.', ct_addr: 'Studio address, Dakar, Senegal',
      foot_proto: 'Prototype',
      svcName: { rehearsal: 'Rehearsal', recording: 'Recording' },
      payName: { wave: 'Wave', om: 'Orange Money', card: 'Bank card', onsite: 'On site' }
    }
  };

  var $ = function (id) { return document.getElementById(id); };
  var lang = 'fr';
  try { lang = localStorage.getItem('cms.lang') || 'fr'; } catch (e) { /* storage blocked: stay on French */ }
  var t = function (key) { return TEXT[lang][key]; };

  var state = { service: 'rehearsal', date: null, start: null, month: firstOfMonth(new Date()) };

  /* ---------- small helpers ---------- */
  function firstOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function money(n) { return n.toLocaleString('fr-FR').replace(/ | /g, ' ') + ' FCFA'; }
  function pad(h) { return String(h).padStart(2, '0') + ':00'; }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; } return Math.abs(h); }

  function loadBookings() {
    try { return JSON.parse(localStorage.getItem('cms.bookings') || '[]'); } catch (e) { return []; }
  }
  function saveBookings(list) {
    try { localStorage.setItem('cms.bookings', JSON.stringify(list)); } catch (e) { /* ignore */ }
  }

  /* ---------- availability ---------- */
  // Demo data: a few hours look already taken, decided by the date so it stays the same between visits.
  function demoTaken(date, service, hour) {
    var h = hash(date + service);
    var from = CONFIG.open + (h % 8), len = 1 + (h >> 3) % 3;
    return (h % 3 !== 0) && hour >= from && hour < from + len;
  }
  function isTaken(date, service, hour) {
    if (demoTaken(date, service, hour)) { return true; }
    return loadBookings().some(function (b) {
      return b.date === date && b.service === service && hour >= b.start && hour < b.start + b.dur;
    });
  }
  function hourPassed(date, hour) {
    var n = new Date();
    return date === iso(n) && hour <= n.getHours();
  }
  function hourFree(date, service, hour) { return !isTaken(date, service, hour) && !hourPassed(date, hour); }
  function freeCount(date, service) {
    var c = 0;
    for (var h = CONFIG.open; h < CONFIG.close; h++) { if (hourFree(date, service, h)) { c++; } }
    return c;
  }
  function maxDuration(date, service, start) {
    var d = 0;
    while (d < CONFIG.maxHours[service] && start + d < CONFIG.close && hourFree(date, service, start + d)) { d++; }
    return d;
  }

  /* ---------- rendering ---------- */
  function applyText() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (typeof v === 'string') { el.textContent = v; }
    });
    $('lang').textContent = lang === 'fr' ? 'EN' : 'FR';
    $('rate-rehearsal').textContent = money(CONFIG.rates.rehearsal);
    $('rate-recording').textContent = money(CONFIG.rates.recording);
    $('year').textContent = new Date().getFullYear();
    renderCalendar(); renderSlots(); renderSummary(); renderPayHint();
  }

  function renderCalendar() {
    var loc = lang === 'fr' ? 'fr-FR' : 'en-GB';
    var m = state.month;
    $('month').textContent = m.toLocaleDateString(loc, { month: 'long', year: 'numeric' });
    var dow = $('dow'); dow.innerHTML = '';
    for (var i = 0; i < 7; i++) {
      var s = document.createElement('span');
      s.textContent = new Date(2024, 0, 1 + i).toLocaleDateString(loc, { weekday: 'short' });
      dow.appendChild(s);
    }
    var days = $('days'); days.innerHTML = '';
    var lead = (m.getDay() + 6) % 7;                  // Monday first
    for (var e = 0; e < lead; e++) { var b = document.createElement('span'); b.className = 'day empty'; days.appendChild(b); }
    var count = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    for (var d = 1; d <= count; d++) {
      var date = new Date(m.getFullYear(), m.getMonth(), d), key = iso(date);
      var btn = document.createElement('button');
      btn.type = 'button'; btn.textContent = d; btn.className = 'day';
      var past = date < today();
      var free = past ? 0 : freeCount(key, state.service);
      btn.disabled = past || free === 0;
      if (!past) { btn.classList.add(free === 0 ? 'full' : free <= 4 ? 'some' : 'free'); }
      if (key === state.date) { btn.classList.add('sel'); }
      btn.addEventListener('click', pickDay.bind(null, key));
      days.appendChild(btn);
    }
    $('prev').disabled = m <= firstOfMonth(new Date());
  }

  function renderSlots() {
    var box = $('slots'); box.innerHTML = '';
    var hint = $('pick-day');
    if (!state.date) { hint.hidden = false; hint.textContent = t('pick_day'); fillDurations(0); return; }
    hint.hidden = false;
    var any = false;
    for (var h = CONFIG.open; h < CONFIG.close; h++) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'slot'; b.textContent = pad(h);
      var free = hourFree(state.date, state.service, h);
      b.disabled = !free; any = any || free;
      if (state.start === h) { b.classList.add('sel'); }
      b.addEventListener('click', pickStart.bind(null, h));
      box.appendChild(b);
    }
    hint.textContent = any ? t('pick_time') : t('no_slot');
    fillDurations(state.start === null ? 0 : maxDuration(state.date, state.service, state.start));
  }

  function fillDurations(max) {
    var sel = $('duration'), keep = parseInt(sel.value, 10) || 1;
    sel.innerHTML = '';
    for (var n = 1; n <= Math.max(max, 1); n++) {
      var o = document.createElement('option'); o.value = n; o.textContent = t('hours')(n); sel.appendChild(o);
    }
    sel.value = Math.min(keep, Math.max(max, 1));
    sel.disabled = max === 0;
  }

  function currentPrice() {
    var dur = parseInt($('duration').value, 10) || 1;
    var total = state.start === null ? 0 : CONFIG.rates[state.service] * dur;
    return { dur: dur, total: total, deposit: Math.round(total * CONFIG.depositShare / 100) * 100 };
  }

  function whenText() {
    if (!state.date || state.start === null) { return '—'; }
    var p = currentPrice();
    var d = new Date(state.date + 'T12:00:00').toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    return d + ', ' + pad(state.start) + '–' + pad(state.start + p.dur);
  }

  function renderSummary() {
    var p = currentPrice();
    $('s-service').textContent = t('svcName')[state.service];
    $('s-when').textContent = whenText();
    $('s-total').textContent = p.total ? money(p.total) : '—';
    $('s-deposit').textContent = p.total ? money(p.deposit) : '—';
  }

  function renderPayHint() {
    var m = document.querySelector('input[name="pay"]:checked').value, p = currentPrice();
    $('pay-hint').textContent = m === 'onsite' ? t('hint_onsite') : t('hint_online')(p.total ? money(p.deposit) : '30 %');
  }

  /* ---------- actions ---------- */
  function pickDay(key) { state.date = key; state.start = null; renderCalendar(); renderSlots(); renderSummary(); }
  function pickStart(h) { state.start = h; renderSlots(); renderSummary(); renderPayHint(); }

  function fail(msg) { var e = $('error'); e.textContent = msg; e.hidden = false; e.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }

  function submit(ev) {
    ev.preventDefault();
    $('error').hidden = true;
    var name = $('name').value.trim(), phone = $('phone').value.trim(), email = $('email').value.trim();
    if (!state.date) { return fail(t('err_day')); }
    if (state.start === null) { return fail(t('err_slot')); }
    if (!name) { return fail(t('err_name')); }
    if (phone.replace(/\D/g, '').length < 8) { return fail(t('err_phone')); }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { return fail(t('err_email')); }

    var p = currentPrice();
    if (maxDuration(state.date, state.service, state.start) < p.dur) { renderSlots(); return fail(t('no_slot')); }
    var booking = {
      id: 'CMS-' + Date.now().toString(36).toUpperCase().slice(-6),
      date: state.date, service: state.service, start: state.start, dur: p.dur,
      name: name, phone: phone, email: email, note: $('note').value.trim(),
      pay: document.querySelector('input[name="pay"]:checked').value,
      total: p.total, deposit: p.deposit, status: 'pending', created: new Date().toISOString()
    };

    // STUB 1: store the booking. In production this is a POST to the server, which saves it in a database and
    // refuses it if the slot was taken in the meantime.
    var all = loadBookings(); all.push(booking); saveBookings(all);

    // STUB 2: notify the owner. In production the server sends this through AWS SES (and may add a WhatsApp
    // message) with Confirm / Refuse links, and creates the payment link once the owner confirms.
    var mail = 'To: ' + CONFIG.ownerEmail + '\nSubject: New booking request ' + booking.id + '\n\n' +
      'Service: ' + TEXT.fr.svcName[booking.service] + '\nWhen: ' + booking.date + ' ' + pad(booking.start) + '-' + pad(booking.start + booking.dur) + '\n' +
      'Client: ' + booking.name + '\nPhone: ' + booking.phone + (booking.email ? '\nEmail: ' + booking.email : '') + '\n' +
      'Payment: ' + TEXT.fr.payName[booking.pay] + '\nTotal: ' + money(booking.total) + ' (deposit ' + money(booking.deposit) + ')\n' +
      (booking.note ? 'Message: ' + booking.note + '\n' : '') + '\n[Confirm]  [Refuse]   (links in the real version)';

    $('done-text').textContent = t('done_text')(booking.id);
    $('done-mail').textContent = mail;
    $('form').hidden = true; $('summary').hidden = true;
    $('done').hidden = false; $('done').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function reset() {
    $('form').reset(); state.date = null; state.start = null;
    $('form').hidden = false; $('summary').hidden = false; $('done').hidden = true;
    renderCalendar(); renderSlots(); renderSummary(); renderPayHint();
    document.getElementById('reserve').scrollIntoView({ behavior: 'smooth' });
  }

  /* ---------- wiring ---------- */
  $('lang').addEventListener('click', function () {
    lang = lang === 'fr' ? 'en' : 'fr';
    try { localStorage.setItem('cms.lang', lang); } catch (e) { /* ignore */ }
    applyText();
  });
  $('prev').addEventListener('click', function () { state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1); renderCalendar(); });
  $('next').addEventListener('click', function () { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1); renderCalendar(); });
  document.querySelectorAll('input[name="service"]').forEach(function (r) {
    r.addEventListener('change', function () {
      state.service = r.value; state.start = null;
      if (state.date && freeCount(state.date, state.service) === 0) { state.date = null; }
      renderCalendar(); renderSlots(); renderSummary(); renderPayHint();
    });
  });
  document.querySelectorAll('input[name="pay"]').forEach(function (r) { r.addEventListener('change', renderPayHint); });
  $('duration').addEventListener('change', function () { renderSummary(); renderPayHint(); });
  $('form').addEventListener('submit', submit);
  $('again').addEventListener('click', reset);

  applyText();
})();

/* Play the studio video only while it is on screen (saves data on mobile). */
(function () {
  var v = document.querySelector('.ph video');
  if (!v || !('IntersectionObserver' in window)) { return; }
  new IntersectionObserver(function (e) {
    if (e[0].isIntersecting) { v.play().catch(function () {}); } else { v.pause(); }
  }, { threshold: 0.4 }).observe(v);
})();
