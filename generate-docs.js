const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'endpoints.json'), 'utf8'));

const METHOD_COLORS = {
  GET:    { bg: '#61affe', text: '#fff' },
  POST:   { bg: '#49cc90', text: '#fff' },
  PATCH:  { bg: '#fca130', text: '#fff' },
  DELETE: { bg: '#f93e3e', text: '#fff' },
  PUT:    { bg: '#fca130', text: '#fff' },
};

const STATUS_COLORS = {
  '2': '#49cc90',
  '3': '#61affe',
  '4': '#fca130',
  '5': '#f93e3e',
};

function statusColor(code) {
  return STATUS_COLORS[String(code)[0]] || '#999';
}

function renderParams(params) {
  const sections = [];

  const addTable = (title, obj) => {
    const entries = Object.entries(obj || {});
    if (!entries.length) return;
    const rows = entries.map(([k, v]) => `
      <tr>
        <td class="param-name">${k}</td>
        <td class="param-desc">${v}</td>
      </tr>`).join('');
    sections.push(`
      <div class="param-section">
        <div class="param-label">${title}</div>
        <table class="param-table">
          <thead><tr><th>Campo</th><th>Descripción</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`);
  };

  addTable('Headers', params.headers);
  addTable('Path params', params.params);
  addTable('Query params', params.query);
  addTable('Body', params.body);

  return sections.length
    ? `<div class="params-wrapper">${sections.join('')}</div>`
    : '<p class="no-params">Sin parámetros</p>';
}

function renderResponses(responses) {
  return Object.entries(responses || {}).map(([code, info]) => {
    const color = statusColor(code);
    const schemaRows = info.schema
      ? Object.entries(info.schema).map(([k, v]) => `
          <tr><td class="param-name">${k}</td><td class="param-desc">${v}</td></tr>`).join('')
      : '';
    return `
      <div class="response-item">
        <span class="status-badge" style="background:${color}">${code}</span>
        <span class="response-desc">${info.description || ''}</span>
        ${schemaRows ? `
        <table class="param-table schema-table">
          <thead><tr><th>Campo</th><th>Tipo / Descripción</th></tr></thead>
          <tbody>${schemaRows}</tbody>
        </table>` : ''}
      </div>`;
  }).join('');
}

function renderEndpoint(ep, index) {
  const mc = METHOD_COLORS[ep.method] || { bg: '#999', text: '#fff' };
  const roles = ep.roles_required ? ep.roles_required.map(r =>
    `<span class="role-badge">${r}</span>`).join('') : '';
  const impl = ep.implemented
    ? '<span class="impl-badge impl-yes">implemented</span>'
    : '<span class="impl-badge impl-no">pending</span>';

  return `
    <div class="endpoint-card" id="ep-${index}">
      <div class="endpoint-header" onclick="toggle(${index})">
        <span class="method-badge" style="background:${mc.bg};color:${mc.text}">${ep.method}</span>
        <span class="endpoint-path">${ep.path}</span>
        <span class="endpoint-desc-inline">${ep.description}</span>
        <div class="endpoint-badges">
          ${roles}
          ${impl}
          <span class="chevron" id="chev-${index}">▼</span>
        </div>
      </div>
      <div class="endpoint-body" id="body-${index}" style="display:none">
        <p class="full-desc">${ep.description}</p>
        <div class="section-tabs">
          <div class="tab-section">
            <div class="tab-title">Parámetros</div>
            ${renderParams(ep.parameters)}
          </div>
          <div class="tab-section">
            <div class="tab-title">Respuestas</div>
            <div class="responses-wrapper">${renderResponses(ep.responses)}</div>
          </div>
        </div>
      </div>
    </div>`;
}

const grouped = {};
data.endpoints.forEach((ep, i) => {
  const base = ep.path.split('/')[1] || 'root';
  if (!grouped[base]) grouped[base] = [];
  grouped[base].push({ ep, i });
});

const sidebarItems = Object.keys(grouped).map(g =>
  `<li><a href="#group-${g}">${g}</a></li>`).join('');

const endpointSections = Object.entries(grouped).map(([group, items]) => `
  <div class="group-section" id="group-${group}">
    <h2 class="group-title">/${group}</h2>
    ${items.map(({ ep, i }) => renderEndpoint(ep, i)).join('')}
  </div>`).join('');

const globalMw = data.api.global_middleware;
const mwErrors = Object.entries(globalMw.errors || {}).map(([code, msg]) => `
  <div class="response-item">
    <span class="status-badge" style="background:${statusColor(code)}">${code}</span>
    <span class="response-desc">${msg}</span>
  </div>`).join('');
const mwHeaders = Object.entries(globalMw.header_required || {}).map(([k, v]) => `
  <tr><td class="param-name">${k}</td><td class="param-desc">${v}</td></tr>`).join('');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${data.api.description} — Docs</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #1a1a2e;
      --sidebar-bg: #16213e;
      --card-bg: #0f3460;
      --card-border: #1a4a7a;
      --text: #e0e0e0;
      --text-muted: #9aa5b4;
      --accent: #61affe;
      --font: 'Segoe UI', system-ui, sans-serif;
      --mono: 'Cascadia Code', 'Fira Code', monospace;
    }
    body { font-family: var(--font); background: var(--bg); color: var(--text); display: flex; min-height: 100vh; }

    /* Sidebar */
    aside {
      width: 220px; min-width: 220px; background: var(--sidebar-bg);
      padding: 24px 0; position: sticky; top: 0; height: 100vh; overflow-y: auto;
      border-right: 1px solid var(--card-border);
    }
    aside .logo { padding: 0 20px 20px; border-bottom: 1px solid var(--card-border); margin-bottom: 16px; }
    aside .logo h1 { font-size: 15px; color: var(--accent); }
    aside .logo p { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
    aside ul { list-style: none; padding: 0 12px; }
    aside ul li a {
      display: block; padding: 8px 12px; border-radius: 6px;
      color: var(--text-muted); text-decoration: none; font-size: 13px;
      font-family: var(--mono); transition: background .15s, color .15s;
    }
    aside ul li a:hover { background: var(--card-border); color: var(--text); }

    /* Main */
    main { flex: 1; padding: 32px 40px; max-width: 1000px; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 28px; color: var(--accent); }
    .page-header p { color: var(--text-muted); margin-top: 6px; }

    /* Global middleware */
    .mw-card {
      background: var(--sidebar-bg); border: 1px solid var(--card-border);
      border-radius: 10px; padding: 20px; margin-bottom: 32px;
    }
    .mw-card h3 { font-size: 14px; color: var(--text-muted); text-transform: uppercase;
      letter-spacing: .08em; margin-bottom: 12px; }
    .mw-card .mw-name { font-size: 16px; font-weight: 600; color: var(--accent); margin-bottom: 8px; }
    .mw-card .mw-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }

    /* Group */
    .group-section { margin-bottom: 40px; }
    .group-title { font-size: 18px; color: var(--text-muted); margin-bottom: 12px;
      padding-bottom: 8px; border-bottom: 1px solid var(--card-border); font-family: var(--mono); }

    /* Endpoint card */
    .endpoint-card { border: 1px solid var(--card-border); border-radius: 8px; margin-bottom: 8px; overflow: hidden; }
    .endpoint-header {
      display: flex; align-items: center; gap: 12px; padding: 14px 18px;
      cursor: pointer; background: var(--card-bg); transition: background .15s; flex-wrap: wrap;
    }
    .endpoint-header:hover { background: #154070; }
    .method-badge {
      font-family: var(--mono); font-size: 12px; font-weight: 700;
      padding: 4px 10px; border-radius: 4px; min-width: 62px; text-align: center;
      letter-spacing: .05em; flex-shrink: 0;
    }
    .endpoint-path { font-family: var(--mono); font-size: 14px; font-weight: 600; flex-shrink: 0; }
    .endpoint-desc-inline { font-size: 12px; color: var(--text-muted); flex: 1; min-width: 0;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .endpoint-badges { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .role-badge { font-size: 10px; background: #2d3748; border: 1px solid #4a5568;
      color: #a0aec0; padding: 2px 7px; border-radius: 10px; }
    .impl-badge { font-size: 10px; padding: 2px 7px; border-radius: 10px; }
    .impl-yes { background: #1a3a2a; border: 1px solid #49cc90; color: #49cc90; }
    .impl-no  { background: #3a2a1a; border: 1px solid #fca130; color: #fca130; }
    .chevron { font-size: 12px; color: var(--text-muted); transition: transform .2s; }
    .chevron.open { transform: rotate(180deg); }

    /* Endpoint body */
    .endpoint-body { background: #0a2540; padding: 20px 18px; border-top: 1px solid var(--card-border); }
    .full-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
    .section-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    @media (max-width: 700px) { .section-tabs { grid-template-columns: 1fr; } }
    .tab-section {}
    .tab-title { font-size: 12px; text-transform: uppercase; letter-spacing: .08em;
      color: var(--text-muted); margin-bottom: 10px; font-weight: 600; }

    /* Params */
    .param-section { margin-bottom: 14px; }
    .param-label { font-size: 11px; color: var(--accent); margin-bottom: 6px; font-weight: 600; }
    .param-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .param-table th { background: #0f2a40; color: var(--text-muted); padding: 6px 8px;
      text-align: left; font-weight: 600; }
    .param-table td { padding: 6px 8px; border-top: 1px solid var(--card-border); vertical-align: top; }
    .param-name { font-family: var(--mono); color: #81d4fa; white-space: nowrap; }
    .param-desc { color: var(--text-muted); }
    .schema-table { margin-top: 8px; }
    .no-params { font-size: 12px; color: var(--text-muted); }

    /* Responses */
    .response-item { display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap;
      padding: 8px 0; border-bottom: 1px solid var(--card-border); }
    .response-item:last-child { border-bottom: none; }
    .status-badge { font-family: var(--mono); font-size: 12px; font-weight: 700;
      padding: 3px 8px; border-radius: 4px; color: #fff; flex-shrink: 0; }
    .response-desc { font-size: 12px; color: var(--text-muted); flex: 1; padding-top: 3px; }
  </style>
</head>
<body>
  <aside>
    <div class="logo">
      <h1>${data.api.description}</h1>
      <p>v${data.api.version}</p>
    </div>
    <ul>
      <li><a href="#global-mw">Middleware global</a></li>
      ${sidebarItems}
    </ul>
  </aside>

  <main>
    <div class="page-header">
      <h1>${data.api.description}</h1>
      <p>Versión ${data.api.version} · ${data.endpoints.length} endpoints</p>
    </div>

    <div class="mw-card" id="global-mw">
      <h3>Middleware global</h3>
      <div class="mw-name">${globalMw.name}</div>
      <div class="mw-desc">${globalMw.description}</div>
      <div class="tab-title">Headers requeridos</div>
      <table class="param-table" style="margin-bottom:16px">
        <thead><tr><th>Header</th><th>Descripción</th></tr></thead>
        <tbody>${mwHeaders}</tbody>
      </table>
      <div class="tab-title">Errores posibles</div>
      <div class="responses-wrapper">${mwErrors}</div>
    </div>

    ${endpointSections}
  </main>

  <script>
    function toggle(i) {
      const body = document.getElementById('body-' + i);
      const chev = document.getElementById('chev-' + i);
      const open = body.style.display !== 'none';
      body.style.display = open ? 'none' : 'block';
      chev.classList.toggle('open', !open);
    }
  </script>
</body>
</html>`;

const outPath = path.join(__dirname, 'api-docs.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Documentacion generada: api-docs.html');
