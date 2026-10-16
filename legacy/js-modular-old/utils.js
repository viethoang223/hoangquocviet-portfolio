export const $ = selector => document.querySelector(selector);
export const $$ = selector => Array.from(document.querySelectorAll(selector));
export const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[char]));

export function toneClass(name) {
  return ({
    Marketing: 'warm',
    'Marketing Strategy': 'warm',
    'Consumer Insight': 'warm',
    Communication: 'warm',
    AI: 'violet',
    Automation: 'lime',
    Data: 'cyan',
    Research: 'cyan',
    Creative: 'violet',
    Technology: 'blue',
    Education: 'violet',
    MarTech: 'blue',
    'Product Thinking': 'blue'
  }[name] || 'blue');
}

export const tag = name => `<span class="pill ${toneClass(name)}">${esc(name)}</span>`;

export const statsH = stats => stats?.length
  ? `<div class="stat-row">${stats.map(([value, label]) => `<div class="stat"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join('')}</div>`
  : '';
