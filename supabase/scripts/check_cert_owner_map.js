const definitions = [
  { group: 'experience-communications', titles: ['Phó chủ nhiệm truyền thông'], id: 'exp-vice-head-comms', ownerType: 'experience', aliases: ['experience-communications', 'communications'] },
  { group: 'anthropic', titles: ['Claude 101'], id: 'anthropic-claude-101' },
  { group: 'anthropic', titles: ['Claude Code 101'], id: 'anthropic-claude-code-101' },
  { group: 'anthropic', titles: ['Claude Code in Action'], id: 'anthropic-claude-code-in-action' },
  { group: 'anthropic', titles: ['Introduction to Model Context Protocol'], id: 'anthropic-mcp-intro' },
  { group: 'anthropic', titles: ['Model Context Protocol: Advanced Topics'], id: 'anthropic-mcp-advanced' },
  { group: 'marketing', titles: ['Google Analytics / GA4 Certification'], id: 'google-ga4' },
  { group: 'marketing', titles: ['HubSpot Inbound Certification'], id: 'hubspot-inbound' },
  { group: 'english', titles: ['TOEIC Speaking & Writing — 260 (Speaking 110 · Writing 150)'], id: 'toeic-sw-260' }
];

function certSlug(group, text) {
  return 'cert-' + group + '-' + String(text || '').normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

const ownerMap = [
  ['exp-vice-head-comms', 'exp-vice-head-comms'],
  ['experience-communications', 'exp-vice-head-comms'],
  ['communications', 'exp-vice-head-comms'],
  ['cert-experience-communications-pho-chu-nhiem-truyen-thong', 'exp-vice-head-comms'],
  ['anthropic-claude-101', 'anthropic-claude-101'],
  ['cert-anthropic-claude-101', 'anthropic-claude-101'],
  ['anthropic-claude-code-101', 'anthropic-claude-code-101'],
  ['cert-anthropic-claude-code-101', 'anthropic-claude-code-101'],
  ['anthropic-claude-code-in-action', 'anthropic-claude-code-in-action'],
  ['cert-anthropic-claude-code-in-action', 'anthropic-claude-code-in-action'],
  ['anthropic-mcp-intro', 'anthropic-mcp-intro'],
  ['cert-anthropic-introduction-to-model-context-protocol', 'anthropic-mcp-intro'],
  ['anthropic-mcp-advanced', 'anthropic-mcp-advanced'],
  ['cert-anthropic-model-context-protocol-advanced-topics', 'anthropic-mcp-advanced'],
  ['google-ga4', 'google-ga4'],
  ['cert-marketing-google-analytics-ga4-certification', 'google-ga4'],
  ['hubspot-inbound', 'hubspot-inbound'],
  ['cert-marketing-hubspot-inbound-certification', 'hubspot-inbound'],
  ['toeic-sw-260', 'toeic-sw-260'],
  ['cert-english-toeic-speaking-writing-260-%', 'toeic-sw-260']
];

function matches(pattern, ownerId) {
  return pattern.endsWith('%') ? ownerId.startsWith(pattern.slice(0, -1)) : ownerId === pattern;
}

const generated = definitions.flatMap(definition => definition.titles.map(title => ({
  oldId: certSlug(definition.group, title), newId: definition.id, ownerType: definition.ownerType || 'certificate'
})));
for (const item of generated) {
  const matchesForId = new Set(ownerMap.filter(([pattern]) => matches(pattern, item.oldId)).map(([, newId]) => newId));
  if (matchesForId.size !== 1 || !matchesForId.has(item.newId)) throw new Error(`${item.oldId} does not resolve uniquely to ${item.newId}`);
  console.log(`${item.oldId} -> ${item.newId} (${item.ownerType})`);
}
const mappedIds = new Set(ownerMap.map(([, newId]) => newId));
const expectedIds = new Set(definitions.map(item => item.id));
for (const id of expectedIds) if (!mappedIds.has(id)) throw new Error(`Missing mapping target ${id}`);
console.log(`PASS: ${generated.length} generated owner IDs map uniquely; ${expectedIds.size} new IDs are covered`);
