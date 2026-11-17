import { readBlockConfig, loadScript } from '../../scripts/aem.js';

/**
 * marketo-form — a Marketo form rebuilt natively in the canon .mkto-form markup from the
 * LIVE form definition (Forms 2.0 getForm), submitted client-side through Marketo Forms 2.0
 * (interim tier `marketo-forms2-passthrough`, stardust/dynamic-features.md rows 18–21, D4).
 *
 * Authoring rows (key/value, @ew-exempt metadata — never displayed):
 *   form     | 7474             (Marketo form id)
 *   munchkin | 353-SAE-487      (Marketo munchkin id)
 *   host     | go.valtech.com   (Marketo forms host)
 *   anchor   | download_form    (optional: id of the form box — in-page #links target it)
 * Also loaded nested by the contact-form band (contact-form.js -> loadBlock).
 * Variant classes (in-main form, outside the contact band — the light canon rules in
 * styles.css apply to every .marketo-form-block outside .contact-us-form):
 *   light  — submit painted as the source's centred tertiary pill (.button.button-tertiary,
 *            hover-wipe spans) instead of the band's white button
 *   narrow — the source's .marketo-form-block__container.narrow (50.625rem column)
 *   download — the whitepaper download gate (.marketo-form-block--download: black 1px
 *            underlines, 16px fields, half-width single inputs, white/black submit)
 *
 * @ew-exempt every displayed string (labels, options, consent HTML, button) is Marketo's
 *   form definition, not authored content; consent HTML is sanitised to a/span/strong/em/br.
 */

const SOURCE_HOSTS = /^https?:\/\/(www\.)?valtech\.com(?=\/)/i;
const ALLOWED_TAGS = ['A', 'SPAN', 'STRONG', 'EM', 'B', 'I', 'BR', 'U'];
const INPUT_TYPES = {
  string: 'text', email: 'email', phone: 'tel', number: 'number', url: 'url', date: 'date',
};

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === undefined || v === null || v === false) return;
    if (k === 'className') node.className = v;
    else node.setAttribute(k, v === true ? '' : v);
  });
  node.append(...children);
  return node;
}

/** Marketo rich labels → safe DOM: allowed inline tags only, links localized. */
function safeHtml(html) {
  const doc = new DOMParser().parseFromString(`<body>${html || ''}</body>`, 'text/html');
  const frag = document.createDocumentFragment();
  const walk = (src, dest) => {
    src.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) {
        dest.append(n.textContent);
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        if (!ALLOWED_TAGS.includes(n.tagName)) {
          walk(n, dest);
          return;
        }
        const out = document.createElement(n.tagName.toLowerCase());
        if (n.tagName === 'A') {
          const href = (n.getAttribute('href') || '').replace(SOURCE_HOSTS, '');
          if (/^(https?:|mailto:|\/)/i.test(href)) out.setAttribute('href', href);
          if (n.getAttribute('target') === '_blank') {
            out.setAttribute('target', '_blank');
            out.setAttribute('rel', 'noopener');
          }
        }
        walk(n, out);
        dest.append(out);
      }
    });
  };
  walk(doc.body, frag);
  // collapse the editor's runs of whitespace the way the source renders them
  return frag;
}

function requiredMark() {
  return el('span', { className: 'required-control-mark' }, ' *');
}

function fieldNode(f) {
  const id = f.Name;
  const required = !!f.IsRequired;
  if (f.Datatype === 'picklist') {
    const values = f.PicklistValues || [];
    const empty = values.find((v) => v.value === '');
    const select = el('select', {
      id, name: id, required, 'aria-required': required ? 'true' : null,
    }, el('option', { value: '' }));
    values.filter((v) => v.value !== '').forEach((v) => {
      select.append(el('option', { value: v.value }, v.label));
    });
    select.addEventListener('change', () => select.classList.toggle('has-value', !!select.value));
    const label = el('label', { for: id }, empty ? empty.label : (f.InputLabel || ''));
    if (required) label.append(requiredMark());
    return el('div', {
      className: 'mkto-form-field mkto-form-field-float mkto-form-field-select',
    }, select, label);
  }
  if (f.Datatype === 'textarea') {
    const labelText = f.PlaceholderText || f.InputLabel || '';
    return el(
      'div',
      { className: 'mkto-form-field' },
      el('label', { for: id, className: 'mkto-form-textlabel' }, labelText),
      el('textarea', {
        id,
        name: id,
        placeholder: labelText,
        rows: '3',
        maxlength: f.Maxlength || 2000,
        required,
      }),
    );
  }
  if (f.Datatype === 'checkbox') {
    const option = (f.PicklistValues || [])[0] || { value: 'yes', label: f.InputLabel };
    const input = el('input', {
      name: id,
      id: `mktoCheckbox_${f.Id}_0`,
      type: 'checkbox',
      value: option.value || 'yes',
      required,
      'aria-required': required ? 'true' : null,
    });
    const label = el(
      'label',
      { for: `mktoCheckbox_${f.Id}_0` },
      input,
      el('span', { className: 'indicator' }),
      safeHtml(option.label),
    );
    if (required) label.append(requiredMark());
    return el('div', { className: 'mkto-form-check' }, label);
  }
  if (f.Datatype === 'htmltext') {
    const html = el('div', { className: 'mkto-form-html' });
    html.append(safeHtml(f.Htmltext));
    html.normalize();
    return html;
  }
  const input = el('input', {
    id,
    name: id,
    placeholder: ' ',
    maxlength: f.Maxlength || 255,
    type: INPUT_TYPES[f.Datatype] || 'text',
    required,
    'aria-required': required ? 'true' : null,
  });
  const label = el('label', { for: id }, f.PlaceholderText || f.InputLabel || '');
  if (required) label.append(requiredMark());
  return el('div', { className: 'mkto-form-field mkto-form-field-float' }, input, label);
}

function buildForm(def, formId, light) {
  const form = el('form', { className: 'mkto-form', id: `mkto-form-${formId}`, novalidate: true });
  const hidden = [];
  (def.rows || []).forEach((row) => {
    // fields shown only under a visibility rule (e.g. StateCode) stay with Marketo's own form
    // `profiling` (progressive-profiling placeholder) renders nothing in Forms 2.0 until a known lead
    // is cookied — the source row is 0 px (geo-quick-start form 10621)
    const visible = row.filter((f) => !['hidden', 'profiling'].includes(f.Datatype) && !f.VisibilityRule);
    row.filter((f) => f.Datatype === 'hidden').forEach((f) => hidden.push(f));
    if (!visible.length) return;
    const single = visible.length === 1;
    const kinds = visible.map((f) => f.Datatype);
    const empty = kinds.every((k) => k === 'htmltext') && visible.every((f) => !(f.Htmltext || '').trim());
    const rowEl = el('div', {
      className: [
        'mkto-form-row',
        kinds.includes('checkbox') ? 'mkto-form-row-check' : '',
        empty ? 'mkto-form-row-empty' : '',
      ].filter(Boolean).join(' '),
    });
    visible.forEach((f) => {
      rowEl.append(el(
        'div',
        { className: `mkto-form-col${single ? ' mkto-form-col-single' : ''}` },
        fieldNode(f),
      ));
    });
    form.append(rowEl);
  });
  hidden.forEach((f) => form.append(el('input', { type: 'hidden', name: f.Name, value: '' })));
  const submit = el('button', {
    type: 'submit',
    className: light ? 'mktoButton button button-tertiary' : 'mktoButton btn-white',
  }, def.SubmitLabel || 'Submit');
  if (light) {
    // canon hover wipe (.button .before / .after); the label mirrors Marketo's SubmitLabel
    submit.append(
      el('span', { className: 'before', 'aria-hidden': 'true', 'data-label': submit.textContent }),
      el('span', { className: 'after', 'aria-hidden': 'true' }),
    );
  }
  form.append(el(
    'div',
    { className: 'mkto-form-buttons' },
    el('span', { className: 'mkto-form-button-wrap' }, submit),
  ));
  return { form, submit };
}

function getDefinition(host, munchkin, formId) {
  return new Promise((resolve, reject) => {
    const cb = `mktoFormDef${formId}_${Date.now()}`;
    const script = document.createElement('script');
    const timer = setTimeout(() => {
      delete window[cb];
      script.remove();
      reject(new Error('marketo getForm timeout'));
    }, 15000);
    window[cb] = (data) => {
      clearTimeout(timer);
      delete window[cb];
      script.remove();
      resolve(data);
    };
    const params = new URLSearchParams({
      munchkinId: munchkin, form: formId, url: window.location.href, callback: cb,
    });
    script.src = `https://${host}/index.php/form/getForm?${params}`;
    script.onerror = () => {
      clearTimeout(timer);
      delete window[cb];
      reject(new Error('marketo getForm failed'));
    };
    document.head.append(script);
  });
}

/** Submission: values handed to Marketo's own (hidden) Forms 2.0 instance of the same form. */
async function submitThroughMarketo(host, munchkin, formId, values) {
  await loadScript(`https://${host}/js/forms2/js/forms2.min.js`);
  let mktoEl = document.getElementById(`mktoForm_${formId}`);
  if (!mktoEl) {
    mktoEl = el('form', { id: `mktoForm_${formId}`, hidden: true, 'aria-hidden': 'true' });
    document.body.append(mktoEl);
  }
  return new Promise((resolve, reject) => {
    window.MktoForms2.loadForm(`//${host}`, munchkin, formId, (mf) => {
      mf.addHiddenFields(values);
      mf.vals(values);
      mf.onSuccess(() => {
        resolve();
        return false;
      });
      mf.submittable(true);
      mf.submit();
    });
    setTimeout(() => reject(new Error('marketo submit timeout')), 30000);
  });
}

export default async function decorate(block) {
  if (block.querySelector('.marketo-form-block')) return; // EW9 re-entrant
  const config = readBlockConfig(block);
  const formId = String(config.form || config.formid || config['form-id'] || '').trim();
  const munchkin = String(config.munchkin || config['munchkin-id'] || '').trim();
  const host = String(config.host || '').replace(/^(https?:)?\/\//, '').replace(/\/.*$/, '').trim();

  const wrap = el('div', {
    className: 'marketo-form-block',
    'data-form-id': formId,
    'data-app-id': munchkin,
  });
  const light = block.classList.contains('light');
  const container = el('div', {
    className: `marketo-form-block-container${block.classList.contains('narrow') ? ' narrow' : ''}`,
  });
  const anchor = String(config.anchor || '').trim();
  if (/^[A-Za-z][\w-]*$/.test(anchor)) wrap.id = anchor;
  wrap.append(container);
  block.replaceChildren(wrap);
  if (!formId || !munchkin || !host) return;

  let def;
  try {
    def = await getDefinition(host, munchkin, formId);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e.message);
    return;
  }
  const { form, submit } = buildForm(def, formId, light);
  const status = el('p', { className: 'mkto-form-status', role: 'status' });
  container.append(form, status);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const values = {};
    new FormData(form).forEach((v, k) => {
      values[k] = v;
    });
    form.querySelectorAll('input[type="checkbox"]').forEach((c) => {
      values[c.name] = c.checked ? c.value : 'no';
    });
    const label = submit.firstChild.textContent;
    submit.disabled = true;
    submit.firstChild.textContent = def.ButtonSubmissionText || label;
    try {
      await submitThroughMarketo(host, munchkin, formId, values);
      form.reset();
      form.querySelectorAll('select').forEach((s) => s.classList.remove('has-value'));
      form.dispatchEvent(new CustomEvent('marketo-form:success', { bubbles: true }));
    } catch (e) {
      status.textContent = def.formSubmitFailedMsg || '';
    } finally {
      submit.disabled = false;
      submit.firstChild.textContent = label;
    }
  });
}
