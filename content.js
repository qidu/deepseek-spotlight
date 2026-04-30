(() => {
  'use strict';

  // ── Constants ─────────────────────────────────────────────────────────────

  const CATEGORY_DEFS = [
    { name: 'Git / GitHub',       icon: '🔀', pattern: /git|github|commit|branch|merge|rebase|diff|签名|提交|仓库|分支|推送|拉取/i },
    { name: 'Docker / Container', icon: '🐳', pattern: /docker|container|compose|dockerfile|kubernetes|k8s|容器|镜像|挂载/i },
    { name: 'Node / npm',         icon: '📦', pattern: /\bnpm\b|\bnode\b|yarn|pnpm|webpack|vite|bun|\bpkg\b|打包|二进制|bundle/i },
    { name: 'AI / ML',            icon: '🤖', pattern: /\bai\b|\bml\b|\bllm\b|gpt|claude|deepseek|mlx|model|embedding|vector|模型|推理|训练|神经/i },
    { name: 'Auth / Security',    icon: '🔐', pattern: /oauth|auth|jwt|token|saml|sso|ssl|tls|secret|认证|授权|安全|签名|验证/i },
    { name: 'Terminal / Shell',   icon: '💻', pattern: /shell|bash|zsh|tmux|terminal|ssh|curl|grep|awk|sed|翻页|命令行/i },
    { name: 'Python',             icon: '🐍', pattern: /python|pip|django|flask|fastapi|pandas|numpy|爬虫/i },
    { name: 'Web / Frontend',     icon: '🌐', pattern: /react|vue|svelte|angular|html|css|tailwind|typescript|前端|组件|页面/i },
    { name: 'Database',           icon: '🗄️', pattern: /sql|postgres|mysql|redis|mongo|database|数据库|查询|索引/i },
    { name: 'Math / Science',     icon: '📐', pattern: /math|matrix|algebra|calculus|equation|fourier|复数|共轭|方程|数学|物理|化学|积分/i },
    { name: 'Life / Other',       icon: '🌿', pattern: /物候|人生|生活|文化|诗|散文|随笔/i },
  ];
  const GENERAL_CATEGORY = { name: 'General', icon: '💬' };
  const STORAGE_KEYS = {
    dynamicCategorization: 'ds-spotlight-dynamic-categorization',
  };
  const MIN_DYNAMIC_DOCS = 3;
  const DYNAMIC_TITLE_FALLBACK_SIZE = 2;
  const DYNAMIC_CATEGORY_SOURCE_PRIORITY = {
    noun: 0,
    prefix: 1,
    postfix: 2,
  };
  const DYNAMIC_CATEGORY_CUSTOM_NOUNS = [
    'ai', 'agent', 'agents', 'api', 'apis', 'app', 'apps', 'auth', 'authentication', 'authorization', 'backend', 'benchmark', 'benchmarks', 'browser', 'bug', 'bugs', 'cache', 'chat', 'chats', 'ci', 'cli', 'client', 'cloud', 'code', 'commit', 'commits', 'component', 'components', 'container', 'containers', 'css', 'dashboard', 'data', 'database', 'databases', 'debug', 'deploy', 'deployment', 'deployments', 'design', 'diff', 'docker', 'docs', 'documentation', 'embedding', 'embeddings', 'endpoint', 'endpoints', 'error', 'errors', 'feature', 'features', 'fix', 'frontend', 'git', 'github', 'golang', 'hook', 'hooks', 'html', 'http', 'https', 'issue', 'issues', 'java', 'javascript', 'job', 'jobs', 'json', 'jwt', 'kubernetes', 'k8s', 'layout', 'library', 'libraries', 'linux', 'llm', 'log', 'logs', 'macos', 'manifest', 'migration', 'migrations', 'model', 'models', 'module', 'modules', 'monitor', 'monitoring', 'mysql', 'network', 'node', 'npm', 'oauth', 'panel', 'pipeline', 'pipelines', 'plugin', 'plugins', 'postgres', 'postgresql', 'prompt', 'prompts', 'python', 'query', 'queries', 'react', 'redis', 'refactor', 'release', 'repo', 'repository', 'request', 'requests', 'response', 'responses', 'routing', 'rust', 'schema', 'schemas', 'script', 'scripts', 'search', 'sdk', 'server', 'service', 'services', 'session', 'sessions', 'shell', 'sidebar', 'sql', 'state', 'storage', 'style', 'styles', 'tailwind', 'task', 'tasks', 'terminal', 'test', 'tests', 'theme', 'token', 'tokens', 'typescript', 'ui', 'url', 'user', 'users', 'vector', 'vectors', 'version', 'vite', 'vue', 'web', 'webhook', 'webpack', 'widget', 'window', 'workflow', 'workflows', 'extension', 'extensions', 'spotlight', 'deepseek',
    'machine learning', 'artificial intelligence', 'deep learning', 'natural language processing', 'prompt engineering', 'context window', 'vector database', 'rate limit', 'release note', 'release notes', 'pull request', 'pull requests', 'code review', 'chat session', 'chat sessions', 'dynamic category', 'dynamic categories', 'default category', 'search panel', 'content script', 'chrome extension', 'browser extension'
  ];
  const ENGLISH_DYNAMIC_CATEGORY_BLOCKLIST = new Set([
    'a', 'an', 'another', 'any', 'anybody', 'anyone', 'anything', 'both', 'each', 'either', 'enough', 'every', 'everybody', 'everyone', 'everything', 'few', 'fewer', 'he', 'her', 'hers', 'herself', 'hey', 'him', 'himself', 'his', 'i', 'it', 'its', 'itself', 'little', 'many', 'me', 'mine', 'more', 'most', 'much', 'my', 'myself', 'neither', 'no', 'nobody', 'none', 'nothing', 'oh', 'other', 'others', 'ouch', 'our', 'ours', 'ourselves', 'several', 'she', 'some', 'somebody', 'someone', 'something', 'such', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'these', 'they', 'this', 'those', 'to', 'us', 'we', 'what', 'whatever', 'which', 'whichever', 'who', 'whom', 'whose', 'wow', 'you', 'your', 'yours', 'yourself', 'yourselves',
    'about', 'above', 'across', 'after', 'against', 'alas', 'along', 'among', 'around', 'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'by', 'down', 'for', 'from', 'in', 'inside', 'into', 'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'through', 'throughout', 'toward', 'towards', 'under', 'underneath', 'up', 'upon', 'with', 'within', 'without',
  ]);

  // ── State ─────────────────────────────────────────────────────────────────

  let sessions         = null;   // null = not loaded; [] = loaded
  let loading          = false;
  let panelOpen        = false;
  let query            = '';
  let viewMode         = 'time'; // 'time' | 'dyna_category' | 'default_category'
  let expandedCategory = null;   // category name currently expanded
  let activeIndex      = -1;
  let flatItems        = [];
  let dynamicCategorizationEnabled = false;
  let dynamicCategoryModel = null;
  let segmenter = null;
  let dynamicNounDictLoaded = false;

  // ── Categorization ────────────────────────────────────────────────────────

  function setDynamicCategorizationEnabled(enabled) {
    dynamicCategorizationEnabled = Boolean(enabled);
    try {
      localStorage.setItem(STORAGE_KEYS.dynamicCategorization, JSON.stringify(dynamicCategorizationEnabled));
    } catch (_) {}
  }

  function loadDynamicCategorizationSetting() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.dynamicCategorization);
      if (raw != null) dynamicCategorizationEnabled = JSON.parse(raw);
    } catch (_) {}
    return dynamicCategorizationEnabled;
  }

  function initSegmenter() {
    if (segmenter) return segmenter;
    const api = window.Segmentit;
    if (!api || !api.Segment || !api.useDefault) return null;
    segmenter = api.useDefault(new api.Segment());
    loadDynamicNounDict(segmenter);
    return segmenter;
  }

  function loadDynamicNounDict(seg) {
    if (!seg || dynamicNounDictLoaded || typeof seg.loadDict !== 'function') return;
    const postag = seg.POSTAG;
    const nounTag = postag ? postag.D_N : 0;
    const lines = DYNAMIC_CATEGORY_CUSTOM_NOUNS
      .map(noun => `${noun}|${nounTag}|100`)
      .join('\n');
    if (!lines) return;
    seg.loadDict(lines, 'TABLE', true);
    dynamicNounDictLoaded = true;
  }

  function tokenize(text, options = {}) {
    const seg = initSegmenter();
    if (seg && typeof seg.doSegment === 'function') {
      const tokens = seg.doSegment(text || '', {
        simple: false,
        stripPunctuation: true,
        stripStopword: true,
        convertSynonym: true,
      });
      if (options.includeMeta) return tokens.filter(token => token && String(token.w || '').trim().length > 0);
      return tokens
        .map(token => token && token.w)
        .filter(token => token && token.trim().length > 0);
    }
    return (String(text || '').toLowerCase().match(/[\u4e00-\u9fa5a-zA-Z0-9]+/g) || []).filter(token => token.length > 1 || /[\u4e00-\u9fa5]/.test(token));
  }

  function escapeRegExp(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function normalizeDynamicToken(token) {
    const raw = String(token || '').trim();
    if (!raw) return null;
    const isCJK = /[\u4e00-\u9fa5]/.test(raw);
    const value = isCJK ? raw : raw.toLowerCase();
    if (!value) return null;
    if (!isCJK && value.length <= 1) return null;
    if (!isCJK && ENGLISH_DYNAMIC_CATEGORY_BLOCKLIST.has(value)) return null;
    return { value, isCJK, length: value.length };
  }

  function getSegmentPosValue(token) {
    if (!token || token.p == null) return 0;
    if (Array.isArray(token.p)) return token.p[0] || 0;
    return token.p;
  }

  function getDynamicPostag() {
    const seg = initSegmenter();
    return seg && seg.POSTAG ? seg.POSTAG : null;
  }

  function isDynamicNoun(token, postag = getDynamicPostag()) {
    if (!postag) return false;
    const pos = getSegmentPosValue(token);
    return Boolean(
      pos === postag.D_N
      || pos === postag.A_NR
      || pos === postag.A_NS
      || pos === postag.A_NT
      || pos === postag.A_NX
      || pos === postag.A_NZ
      || pos === postag.URL
      || (pos & postag.D_N)
      || (pos & postag.A_NR)
      || (pos & postag.A_NS)
      || (pos & postag.A_NT)
      || (pos & postag.A_NX)
      || (pos & postag.A_NZ)
    );
  }

  function createDynamicCandidate(rawValue, source, position) {
    const normalized = normalizeDynamicToken(rawValue);
    if (!normalized) return null;
    return {
      ...normalized,
      source,
      sourcePriority: DYNAMIC_CATEGORY_SOURCE_PRIORITY[source] ?? Number.MAX_SAFE_INTEGER,
      position,
    };
  }

  function tokenizeTitleWords(title) {
    return (String(title || '').match(/[\u4e00-\u9fa5a-zA-Z0-9]+/g) || []).filter(Boolean);
  }

  function buildDynamicEdgeCandidates(title, basePosition) {
    const parts = tokenizeTitleWords(title).filter(part => normalizeDynamicToken(part));
    if (parts.length < DYNAMIC_TITLE_FALLBACK_SIZE) return [];
    const prefix = createDynamicCandidate(parts.slice(0, DYNAMIC_TITLE_FALLBACK_SIZE).join(' '), 'prefix', basePosition);
    const postfix = createDynamicCandidate(parts.slice(-DYNAMIC_TITLE_FALLBACK_SIZE).join(' '), 'postfix', basePosition + 1);
    return [prefix, postfix].filter(Boolean);
  }

  function analyzeSessionTokens(title) {
    const orderedCandidates = [];
    const seen = new Set();
    const firstPos = new Map();
    const tokenObjects = tokenize(title || '', { includeMeta: true });
    const plainTokens = Array.isArray(tokenObjects) && tokenObjects.length > 0 && typeof tokenObjects[0] === 'object'
      ? tokenObjects
      : tokenize(title || '').map(token => ({ w: token, p: 0 }));
    let order = 0;

    const pushCandidate = candidate => {
      if (!candidate || seen.has(candidate.value)) return;
      seen.add(candidate.value);
      firstPos.set(candidate.value, candidate.position);
      orderedCandidates.push(candidate);
    };

    for (const token of plainTokens) {
      if (isDynamicNoun(token)) pushCandidate(createDynamicCandidate(token.w, 'noun', order++));
    }

    for (const candidate of buildDynamicEdgeCandidates(title, order)) {
      pushCandidate(candidate);
    }

    return { orderedTokens: orderedCandidates, uniqueTokens: orderedCandidates.map(entry => entry.value), firstPos };
  }

  function compareDynamicDefs(a, b) {
    return (a.sourcePriority - b.sourcePriority)
      || (b.docFreq - a.docFreq)
      || (b.length - a.length)
      || (a.firstSeenOrder - b.firstSeenOrder)
      || a.name.localeCompare(b.name);
  }

  function scoreDynamicCandidate(a, b) {
    return (a.sourcePriority - b.sourcePriority)
      || (b.docFreq - a.docFreq)
      || (b.length - a.length)
      || (a.position - b.position)
      || (a.rank - b.rank);
  }

  function buildDynamicCategoryModel(list) {
    const docFreq = new Map();
    const tokenMeta = new Map();
    const sessionTokens = new Map();
    let firstSeenCounter = 0;

    for (const session of list) {
      const analysis = analyzeSessionTokens(session.title || '');
      sessionTokens.set(session.id, analysis);
      for (const token of analysis.uniqueTokens) {
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
        if (!tokenMeta.has(token)) {
          const tokenInfo = analysis.orderedTokens.find(entry => entry.value === token);
          tokenMeta.set(token, {
            isCJK: tokenInfo ? tokenInfo.isCJK : /[\u4e00-\u9fa5]/.test(token),
            length: token.length,
            source: tokenInfo ? tokenInfo.source : 'noun',
            sourcePriority: tokenInfo ? tokenInfo.sourcePriority : Number.MAX_SAFE_INTEGER,
            firstSeenOrder: firstSeenCounter++,
          });
        }
      }
    }

    const defs = [...docFreq.entries()]
      .filter(([, count]) => count >= MIN_DYNAMIC_DOCS)
      .map(([token, count]) => {
        const meta = tokenMeta.get(token) || {
          isCJK: /[\u4e00-\u9fa5]/.test(token),
          length: token.length,
          source: 'noun',
          sourcePriority: DYNAMIC_CATEGORY_SOURCE_PRIORITY.noun,
          firstSeenOrder: Number.MAX_SAFE_INTEGER,
        };
        return {
          name: token,
          token,
          icon: '🏷️',
          docFreq: count,
          isCJK: meta.isCJK,
          length: meta.length,
          source: meta.source,
          sourcePriority: meta.sourcePriority,
          firstSeenOrder: meta.firstSeenOrder,
          pattern: new RegExp(meta.isCJK ? escapeRegExp(token) : `\\b${escapeRegExp(token)}\\b`, 'i'),
        };
      })
      .sort(compareDynamicDefs)
      .map((def, index) => ({ ...def, rank: index }));

    const defsByToken = new Map(defs.map(def => [def.token, def]));
    const sessionAssignments = new Map();
    const assignedCounts = new Map();

    for (const session of list) {
      const analysis = sessionTokens.get(session.id) || analyzeSessionTokens(session.title || '');
      const candidates = analysis.uniqueTokens
        .map(token => {
          const def = defsByToken.get(token);
          if (!def) return null;
          return {
            ...def,
            position: analysis.firstPos.get(token) ?? Number.MAX_SAFE_INTEGER,
          };
        })
        .filter(Boolean)
        .sort(scoreDynamicCandidate);
      const assigned = candidates[0] || GENERAL_CATEGORY;
      sessionAssignments.set(session.id, assigned);
      if (assigned.name !== GENERAL_CATEGORY.name) {
        assignedCounts.set(assigned.name, (assignedCounts.get(assigned.name) || 0) + 1);
      }
    }

    for (const [sessionId, assigned] of sessionAssignments.entries()) {
      if (assigned.name !== GENERAL_CATEGORY.name && (assignedCounts.get(assigned.name) || 0) < 2) {
        sessionAssignments.set(sessionId, GENERAL_CATEGORY);
      }
    }

    return {
      defs,
      defsByToken,
      sessionTokens,
      sessionAssignments,
    };
  }

  function getDynamicCategoryModel(list) {
    if (!dynamicCategorizationEnabled) return null;
    if (!dynamicCategoryModel) dynamicCategoryModel = buildDynamicCategoryModel(list);
    return dynamicCategoryModel;
  }

  function categorizeWith(defs, title) {
    for (const cat of defs) {
      if (cat.pattern.test(title)) return cat;
    }
    return GENERAL_CATEGORY;
  }

  function groupByCategory(list, defs, model = null) {
    const map = new Map();
    for (const s of list) {
      const cat = model ? (model.sessionAssignments.get(s.id) || GENERAL_CATEGORY) : categorizeWith(defs, s.title || '');
      if (!map.has(cat.name)) map.set(cat.name, { cat, items: [] });
      map.get(cat.name).items.push(s);
    }
    for (const [, g] of map) g.items.sort((a, b) => b.updated_at - a.updated_at);
    const ordered = [];
    for (const def of [...defs, GENERAL_CATEGORY]) {
      if (map.has(def.name)) ordered.push(map.get(def.name));
    }
    return ordered;
  }

  // ── Fuzzy Search ──────────────────────────────────────────────────────────

  function fuzzyMatch(queryStr, title) {
    if (!queryStr) return { matched: true, score: 0, ranges: [] };
    const q = queryStr.toLowerCase();
    const t = title.toLowerCase();
    let qi = 0;
    const ranges = [];
    let runStart = -1;

    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
      if (t[ti] === q[qi]) {
        if (runStart === -1) runStart = ti;
        qi++;
        if (qi === q.length || (ti + 1 < t.length && t[ti + 1] !== q[qi])) {
          ranges.push([runStart, ti]);
          runStart = -1;
        }
      } else {
        if (runStart !== -1) { ranges.push([runStart, ti - 1]); runStart = -1; }
      }
    }
    if (runStart !== -1) ranges.push([runStart, t.length - 1]);

    const matched = qi === q.length;
    const score = matched
      ? -(ranges.reduce((s, [a, b]) => s + (b - a + 1) * (b - a + 1), 0))
      : Infinity;
    return { matched, score, ranges };
  }

  function highlightTitle(title, ranges) {
    if (!ranges || ranges.length === 0) return escHtml(title);
    let result = '', cursor = 0;
    for (const [start, end] of ranges) {
      result += escHtml(title.slice(cursor, start));
      result += `<mark>${escHtml(title.slice(start, end + 1))}</mark>`;
      cursor = end + 1;
    }
    return result + escHtml(title.slice(cursor));
  }

  function escHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Date formatting ───────────────────────────────────────────────────────

  function formatDate(ts) {
    const d = new Date(ts * 1000);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60)        return 'just now';
    if (diff < 3600)      return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400)     return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString(undefined, {
      month: 'short', day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }

  // ── Fetch all sessions (paginated) ────────────────────────────────────────

  function getAuthToken() {
    try {
      const raw = localStorage.getItem('userToken');
      if (raw) return JSON.parse(raw).value;
    } catch (_) {}
    return null;
  }

  async function fetchAllSessions() {
    const all = [];
    let hasMore = true;
    let cursorUpdatedAt = null;
    let cursorId = null;

    const token = getAuthToken();
    const headers = {
      'x-client-platform': 'web',
      'x-client-version': '1.8.0',
      'x-app-version': '20241129.1',
      'x-client-locale': navigator.language || 'en_US',
      'x-client-timezone-offset': String(-new Date().getTimezoneOffset()),
    };
    if (token) headers['authorization'] = `Bearer ${token}`;

    while (hasMore) {
      let url = 'https://chat.deepseek.com/api/v0/chat_session/fetch_page?lte_cursor.pinned=false';
      if (cursorUpdatedAt !== null) {
        url += `&lte_cursor.updated_at=${String(cursorUpdatedAt)}&lte_cursor.id=${cursorId}`;
      }

      const res = await fetch(url, { credentials: 'include', headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const bizData = json?.data?.biz_data;
      if (!bizData) throw new Error('Unexpected response shape');

      const page = bizData.chat_sessions || [];
      all.push(...page);
      hasMore = bizData.has_more && page.length > 0;

      if (hasMore) {
        const last = page[page.length - 1];
        cursorUpdatedAt = last.updated_at;
        cursorId = last.id;
      }
    }

    return all;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  function getResultsEl() { return document.getElementById('ds-spotlight-results'); }

  function renderLoading() {
    getResultsEl().innerHTML = `
      <div class="ds-state-msg">
        <div class="ds-spinner"></div>
        Loading sessions…
      </div>`;
  }

  function renderError(msg) {
    getResultsEl().innerHTML = `<div class="ds-state-msg">⚠️ ${escHtml(msg)}</div>`;
  }

  function renderItem(session, ranges, idx) {
    const activeClass = idx === activeIndex ? ' ds-active' : '';
    return `
      <div class="ds-item${activeClass}" data-idx="${idx}" data-id="${escHtml(session.id)}" role="option" aria-selected="${idx === activeIndex}">
        <div class="ds-item-body">
          <div class="ds-item-title">${highlightTitle(session.title || '', ranges)}</div>
          <div class="ds-item-meta">${formatDate(session.updated_at)}</div>
        </div>
        <div class="ds-item-arrow">›</div>
      </div>`;
  }

  function renderCategoryRow(cat, count, isExpanded, ranges = []) {
    return `
      <div class="ds-cat-row${isExpanded ? ' ds-cat-expanded' : ''}" data-cat="${escHtml(cat.name)}">
        <span class="ds-cat-icon">${escHtml(cat.icon)}</span>
        <span class="ds-cat-name">${highlightTitle(cat.name, ranges)}</span>
        <span class="ds-cat-count">${count}</span>
        <span class="ds-cat-chevron">${isExpanded ? '▾' : '▸'}</span>
      </div>`;
  }

  function renderResults() {
    flatItems = [];
    if (!sessions) { renderLoading(); return; }

    const valid = sessions.filter(s => s.id);
    const dynamicModel = viewMode === 'dyna_category' ? getDynamicCategoryModel(valid) : null;

    if (viewMode === 'time') {
      const sorted = [...valid].sort((a, b) => b.updated_at - a.updated_at);
      if (query) {
        const matched = [];
        for (const s of sorted) {
          const m = fuzzyMatch(query, s.title || '');
          if (m.matched) matched.push({ session: s, score: m.score, ranges: m.ranges });
        }
        matched.sort((a, b) => a.score - b.score);
        if (matched.length === 0) {
          getResultsEl().innerHTML = `<div class="ds-state-msg">No sessions match "${escHtml(query)}"</div>`;
          return;
        }
        let html = '';
        for (const { session, ranges } of matched) {
          html += renderItem(session, ranges, flatItems.length);
          flatItems.push(session);
        }
        getResultsEl().innerHTML = html;
        return;
      }
      if (sorted.length === 0) {
        getResultsEl().innerHTML = `<div class="ds-state-msg">No sessions found</div>`;
        return;
      }
      let html = '';
      for (const s of sorted) {
        html += renderItem(s, [], flatItems.length);
        flatItems.push(s);
      }
      getResultsEl().innerHTML = html;
      return;
    }

    const defs = viewMode === 'dyna_category' ? (dynamicModel ? dynamicModel.defs : []) : CATEGORY_DEFS;
    const groups = groupByCategory(valid, defs, dynamicModel);
    if (groups.length === 0) {
      getResultsEl().innerHTML = `<div class="ds-state-msg">No sessions found</div>`;
      return;
    }

    const shouldFilterGrouped = Boolean(query);
    let grouped = groups;

    if (shouldFilterGrouped) {
      grouped = groups.map(({ cat, items }) => {
        const categoryMatch = fuzzyMatch(query, cat.name || '');
        const matchedItems = [];
        for (const session of items) {
          const match = fuzzyMatch(query, session.title || '');
          if (match.matched) matchedItems.push({ session, ranges: match.ranges, score: match.score });
        }
        matchedItems.sort((a, b) => a.score - b.score);
        return {
          cat,
          categoryRanges: categoryMatch.matched ? categoryMatch.ranges : [],
          categoryMatched: categoryMatch.matched,
          matchedItems,
        };
      }).filter(group => group.categoryMatched || group.matchedItems.length > 0);

      if (grouped.length === 0) {
        getResultsEl().innerHTML = `<div class="ds-state-msg">No sessions match "${escHtml(query)}"</div>`;
        return;
      }
    }

    let html = '';
    for (const group of grouped) {
      const { cat } = group;
      const items = shouldFilterGrouped ? group.matchedItems.map(entry => entry.session) : group.items;
      const isExpanded = shouldFilterGrouped ? true : expandedCategory === cat.name;
      const categoryRanges = shouldFilterGrouped ? group.categoryRanges : [];
      html += renderCategoryRow(cat, items.length, isExpanded, categoryRanges);
      if (isExpanded) {
        const itemEntries = shouldFilterGrouped ? group.matchedItems : items.map(session => ({ session, ranges: [] }));
        for (const entry of itemEntries) {
          html += renderItem(entry.session, entry.ranges || [], flatItems.length);
          flatItems.push(entry.session);
        }
      }
    }
    getResultsEl().innerHTML = html;
  }

  function updateFooter() {
    const modeHint = document.getElementById('ds-hint-mode');
    if (modeHint) {
      modeHint.textContent = viewMode === 'time'
        ? 'by time'
        : viewMode === 'dyna_category'
          ? 'dynamic category'
          : 'default category';
    }
    const toggle = document.getElementById('ds-categorization-toggle');
    if (toggle) {
      toggle.textContent = dynamicCategorizationEnabled ? 'Dyna Catego: On' : 'Dyna Catego: Off';
      toggle.setAttribute('aria-pressed', String(dynamicCategorizationEnabled));
    }
  }

  // ── Panel DOM ─────────────────────────────────────────────────────────────

  function injectPanel() {
    if (document.getElementById('ds-spotlight-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'ds-spotlight-overlay';
    overlay.className = 'ds-hidden';
    overlay.innerHTML = `
      <div id="ds-spotlight-modal" role="dialog" aria-label="Search DeepSeek sessions" aria-modal="true">
        <div id="ds-spotlight-input-row">
          <svg id="ds-spotlight-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="9" cy="9" r="6"/><line x1="13.5" y1="13.5" x2="18" y2="18"/>
          </svg>
          <input id="ds-spotlight-input" type="text" placeholder="Search chats…" autocomplete="off" spellcheck="false" aria-label="Search chats"/>
          <button id="ds-categorization-toggle" type="button" aria-pressed="false">dynamic cat: off</button>
          <span id="ds-spotlight-kbd">esc</span>
        </div>
        <div id="ds-spotlight-results" role="listbox"></div>
        <div id="ds-spotlight-footer">
          <span class="ds-hint"><kbd>↑↓</kbd> navigate</span>
          <span class="ds-hint"><kbd>↵</kbd> open</span>
          <span class="ds-hint"><kbd>⌘L</kbd> <span id="ds-hint-mode">by time</span></span>
          <span class="ds-hint"><kbd>esc</kbd> close</span>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closePanel();
    });

    const input = document.getElementById('ds-spotlight-input');
    const toggle = document.getElementById('ds-categorization-toggle');
    let debounceTimer;
    loadDynamicCategorizationSetting();
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        query = input.value.trim();
        activeIndex = -1;
        renderResults();
      }, 50);
    });
    toggle.addEventListener('click', () => {
      setDynamicCategorizationEnabled(!dynamicCategorizationEnabled);
      dynamicCategoryModel = null;
      renderResults();
      updateFooter();
    });
    updateFooter();

    overlay.addEventListener('click', e => {
      const catRow = e.target.closest('.ds-cat-row');
      if (catRow) {
        const name = catRow.dataset.cat;
        expandedCategory = expandedCategory === name ? null : name;
        activeIndex = -1;
        renderResults();
        return;
      }
      const item = e.target.closest('.ds-item');
      if (item) navigateTo(item.dataset.id);
    });

    overlay.addEventListener('mouseover', e => {
      const item = e.target.closest('.ds-item');
      if (item) {
        activeIndex = parseInt(item.dataset.idx, 10);
        updateActiveClass();
      }
    });
  }

  function updateActiveClass() {
    document.querySelectorAll('.ds-item').forEach(el => {
      const isActive = parseInt(el.dataset.idx, 10) === activeIndex;
      el.classList.toggle('ds-active', isActive);
      el.setAttribute('aria-selected', String(isActive));
    });
    const activeEl = document.querySelector('.ds-item.ds-active');
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
  }

  function navigateTo(sessionId) {
    window.location.href = `https://chat.deepseek.com/a/chat/s/${sessionId}`;
  }

  // ── Open / Close ──────────────────────────────────────────────────────────

  async function openPanel(mode = 'time') {
    panelOpen = true;
    viewMode = mode;
    if (viewMode === 'dyna_category') {
      dynamicCategoryModel = null;
    }
    document.getElementById('ds-spotlight-overlay').classList.remove('ds-hidden');

    const input = document.getElementById('ds-spotlight-input');
    input.value = '';
    query = '';
    activeIndex = -1;
    input.focus();

    if (sessions !== null) {
      if (viewMode === 'dyna_category') getDynamicCategoryModel(sessions.filter(s => s.id));
      renderResults();
      updateFooter();
      return;
    }
    if (loading) return;

    loading = true;
    renderLoading();
    try {
      sessions = await fetchAllSessions();
      if (panelOpen) {
        if (viewMode === 'dyna_category') getDynamicCategoryModel(sessions.filter(s => s.id));
        renderResults();
        updateFooter();
      }
    } catch (err) {
      sessions = null;
      if (panelOpen) renderError(err.message || 'Failed to load sessions');
    } finally {
      loading = false;
    }
  }

  function closePanel() {
    panelOpen = false;
    const overlay = document.getElementById('ds-spotlight-overlay');
    if (overlay) overlay.classList.add('ds-hidden');
  }

  // ── Keyboard handling ─────────────────────────────────────────────────────

  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

  document.addEventListener('keydown', e => {
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    if (modKey && e.key === 'k') {
      e.preventDefault();
      e.stopPropagation();
      if (panelOpen) closePanel(); else openPanel(dynamicCategorizationEnabled ? 'dyna_category' : 'default_category');
      return;
    }

    if (modKey && e.key === 'l') {
      e.preventDefault();
      e.stopPropagation();
      if (panelOpen) {
        viewMode = 'time';
        expandedCategory = null;
        activeIndex = -1;
        renderResults();
        updateFooter();
      } else {
        openPanel('time');
      }
      return;
    }

    if (!panelOpen) return;

    if (e.key === 'Escape') { e.preventDefault(); closePanel(); return; }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, flatItems.length - 1);
      updateActiveClass();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActiveClass();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < flatItems.length) {
        navigateTo(flatItems[activeIndex].id);
      }
      return;
    }
  }, true);

  // ── Init ──────────────────────────────────────────────────────────────────

  injectPanel();
})();
