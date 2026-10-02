// Tema claro/escuro
const root = document.documentElement;
const savedTheme = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
if (savedTheme) root.dataset.theme = savedTheme;
else if (window.matchMedia('(prefers-color-scheme: light)').matches) root.dataset.theme = 'light';

document.getElementById('themeToggle').addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
});

// Terminal: simula uma execução de testes
const term = document.getElementById('termBody');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const lines = [
  { cmd: 'npx cypress run --spec cypress/e2e/bruna.cy.js' },
  { html: '<span class="t-dim">  Running:  </span><span class="t-cmd">bruna.cy.js</span><span class="t-dim">                     (1 of 1)</span>', delay: 500 },
  { html: '' },
  { html: '  <span class="t-suite">QA Engineer · Bruna Fernandes</span>' },
  { test: 'tem 5+ anos de experiência em qualidade de software', ms: 112 },
  { test: 'automatiza testes E2E com Cypress', ms: 87 },
  { test: 'também automatiza com Playwright e Selenium', ms: 96 },
  { test: 'testa APIs com RestAssured, Postman e Swagger', ms: 103 },
  { test: 'reduziu ~85% do tempo de uma suíte front-end', ms: 34 },
  { test: 'atuou em todo o ecossistema PIX', ms: 241 },
  { test: 'validou deploys em homologação e produção', ms: 158 },
  { test: 'aplica IA, LLMs, agentes e BMAD ao QA', ms: 203 },
  { test: 'encontra o bug antes do cliente', ms: 41 },
  { html: '' },
  { html: '  <span class="t-pass">9 passing</span> <span class="t-dim">(1s)</span>', delay: 300 },
  { html: '' },
  { html: '<span class="t-badge">✔ All specs passed!</span>', delay: 400 },
  { html: '<span class="t-prompt">❯</span> <span class="cursor">▋</span>' },
];

let runId = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runTerminal() {
  const id = ++runId;
  term.innerHTML = '';
  for (const line of lines) {
    if (id !== runId) return;
    const el = document.createElement('div');
    term.appendChild(el);
    if (line.cmd) {
      el.innerHTML = '<span class="t-prompt">❯</span> ';
      const cmd = document.createElement('span');
      cmd.className = 't-cmd';
      el.appendChild(cmd);
      for (const ch of line.cmd) {
        if (id !== runId) return;
        cmd.textContent += ch;
        if (!reduceMotion) await sleep(28);
      }
      if (!reduceMotion) await sleep(300);
    } else if (line.test) {
      el.innerHTML = `    <span class="t-pass">✓</span> ${line.test} <span class="t-time">(${line.ms}ms)</span>`;
      if (!reduceMotion) await sleep(140 + Math.random() * 160);
    } else {
      el.innerHTML = line.html || '&nbsp;';
      if (!reduceMotion) await sleep(line.delay || 120);
    }
  }
}
runTerminal();
document.getElementById('replay').addEventListener('click', runTerminal);

// Contadores animados
function animateCount(el) {
  const target = Number(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = prefix + target + suffix; return; }
  const start = performance.now();
  const dur = 1400;
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Reveal ao rolar
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    e.target.querySelectorAll?.('[data-count]').forEach(animateCount);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.stats, .section, .job, .skill-group, .pipeline li, .edu').forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});

// Filtro de skills
const chips = document.querySelectorAll('.chip');
const groups = document.querySelectorAll('.skill-group');
chips.forEach((chip) => chip.addEventListener('click', () => {
  chips.forEach((c) => c.classList.remove('active'));
  chip.classList.add('active');
  const f = chip.dataset.filter;
  groups.forEach((g) => {
    const match = f === 'all' || g.dataset.cat.split(' ').includes(f);
    g.classList.toggle('dimmed', !match);
  });
}));

document.getElementById('year').textContent = new Date().getFullYear();
