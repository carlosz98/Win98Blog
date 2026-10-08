import { useEffect, useState } from 'react';
import '../css/GithubView.css';

// Shows a GitHub repo or profile inside the IE window. github.com refuses to
// load in an iframe, so this reads the public GitHub API and draws the page itself.
const API = 'https://api.github.com';
const cache = new Map();

export function parseGithubUrl(url) {
  const m = /^https?:\/\/(?:www\.)?github\.com\/([^/?#]+)(?:\/([^/?#]+))?/i.exec(url || '');
  if (!m) return null;
  return { owner: m[1], repo: m[2] && m[2] !== '' ? m[2].replace(/\.git$/, '') : null };
}

async function getJson(path, accept = 'application/vnd.github+json') {
  const key = accept + path;
  if (cache.has(key)) return cache.get(key);
  try {
    const saved = sessionStorage.getItem('gh:' + key);
    if (saved) { const v = JSON.parse(saved); cache.set(key, v); return v; }
  } catch {}
  const res = await fetch(API + path, { headers: { Accept: accept } });
  if (!res.ok) {
    const err = new Error(res.status === 403 || res.status === 429 ? 'GitHub is busy right now. Try again in a bit.' : `GitHub said ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const v = accept.includes('html') ? await res.text() : await res.json();
  cache.set(key, v);
  try { sessionStorage.setItem('gh:' + key, JSON.stringify(v)); } catch {}
  return v;
}

// README images and links use paths relative to the repo; point them at GitHub.
function fixReadme(html, owner, repo, branch) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const isRelative = (u) => u && !/^([a-z]+:|\/\/|#|data:)/i.test(u);
  doc.querySelectorAll('img[src]').forEach(img => {
    const src = img.getAttribute('src');
    if (isRelative(src)) img.setAttribute('src', `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${src.replace(/^\.?\//, '')}`);
    img.setAttribute('loading', 'lazy');
  });
  doc.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href.startsWith('#')) return;
    if (isRelative(href)) a.setAttribute('href', `https://github.com/${owner}/${repo}/blob/${branch}/${href.replace(/^\.?\//, '')}`);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  doc.querySelectorAll('script, style, iframe').forEach(n => n.remove());
  return doc.body.innerHTML;
}

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Java: '#b07219', Kotlin: '#A97BFF', 'C#': '#178600',
  'C++': '#f34b7d', C: '#555555', Python: '#3572A5', HTML: '#e34c26', CSS: '#563d7c', Swift: '#F05138',
  ShaderLab: '#222c37', HLSL: '#aace60', PHP: '#4F5D95', Dart: '#00B4AB',
};

function Repo({ owner, repo, onNavigate }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setData(null); setError('');
    (async () => {
      try {
        const info = await getJson(`/repos/${owner}/${repo}`);
        const [langs, readme] = await Promise.all([
          getJson(`/repos/${owner}/${repo}/languages`).catch(() => ({})),
          getJson(`/repos/${owner}/${repo}/readme`, 'application/vnd.github.html+json').catch(e => (e.status === 404 ? '' : null)),
        ]);
        if (alive) setData({ info, langs, readme: readme ? fixReadme(readme, owner, repo, info.default_branch) : readme });
      } catch (e) { if (alive) setError(e.message); }
    })();
    return () => { alive = false; };
  }, [owner, repo]);

  if (error) return <Failed url={`https://github.com/${owner}/${repo}`} error={error} />;
  if (!data) return <Loading />;
  const { info, langs, readme } = data;
  const total = Object.values(langs).reduce((a, b) => a + b, 0);

  return (
    <div className="gh-page">
      <div className="gh-head">
        <div className="gh-path">
          <span className="gh-link" onClick={() => onNavigate(`https://github.com/${owner}`)}>{owner}</span>
          {' / '}<b>{info.name}</b>
        </div>
        <a className="gh-btn" href={info.html_url} target="_blank" rel="noopener noreferrer">Open on GitHub</a>
      </div>
      {info.description && <p className="gh-desc">{info.description}</p>}
      <div className="gh-stats">
        <span>★ {info.stargazers_count} stars</span>
        <span>⑂ {info.forks_count} forks</span>
        <span>Updated {new Date(info.pushed_at).toLocaleDateString()}</span>
        {info.homepage && <a href={info.homepage} target="_blank" rel="noopener noreferrer">Live site</a>}
      </div>
      {total > 0 && (
        <div className="gh-langs">
          <div className="gh-langbar">
            {Object.entries(langs).map(([l, n]) => (
              <span key={l} style={{ width: `${(n / total) * 100}%`, background: LANG_COLORS[l] || '#808080' }} title={l} />
            ))}
          </div>
          <div className="gh-langnames">
            {Object.entries(langs).slice(0, 6).map(([l, n]) => (
              <span key={l}><i style={{ background: LANG_COLORS[l] || '#808080' }} />{l} {((n / total) * 100).toFixed(1)}%</span>
            ))}
          </div>
        </div>
      )}
      <fieldset className="gh-readme-box">
        <legend>README</legend>
        {readme
          ? <div className="gh-readme" dangerouslySetInnerHTML={{ __html: readme }} />
          : readme === null
            ? <p className="gh-muted">The README couldn't load right now. <a href={info.html_url} target="_blank" rel="noopener noreferrer">Read it on GitHub</a>.</p>
            : <p className="gh-muted">This project doesn't have a README yet.</p>}
      </fieldset>
    </div>
  );
}

function Profile({ owner, onNavigate }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setData(null); setError('');
    (async () => {
      try {
        const [user, repos] = await Promise.all([
          getJson(`/users/${owner}`),
          getJson(`/users/${owner}/repos?sort=pushed&per_page=100`),
        ]);
        if (!Array.isArray(repos)) throw new Error('GitHub sent something unexpected.');
        if (alive) setData({ user, repos: repos.filter(r => !r.fork) });
      } catch (e) { if (alive) setError(e.message); }
    })();
    return () => { alive = false; };
  }, [owner]);

  if (error) return <Failed url={`https://github.com/${owner}`} error={error} />;
  if (!data) return <Loading />;
  const { user, repos } = data;

  return (
    <div className="gh-page">
      <div className="gh-profile">
        <img src={user.avatar_url} alt="" />
        <div>
          <h2>{user.name || user.login}</h2>
          <div className="gh-muted">@{user.login} · {user.public_repos} projects</div>
          {user.bio && <p>{user.bio}</p>}
        </div>
        <a className="gh-btn" href={user.html_url} target="_blank" rel="noopener noreferrer">Open on GitHub</a>
      </div>
      <fieldset className="gh-readme-box">
        <legend>Projects</legend>
        <div className="gh-repos">
          {repos.map(r => (
            <div key={r.id} className="gh-repo" onClick={() => onNavigate(r.html_url)}>
              <b>{r.name}</b>
              <span className="gh-muted">{r.description || 'No description'}</span>
              <span className="gh-small">
                {r.language && <><i style={{ background: LANG_COLORS[r.language] || '#808080' }} />{r.language} · </>}
                ★ {r.stargazers_count}
              </span>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function Loading() {
  return (
    <div className="gh-loading">
      <p>Connecting to github.com...</p>
      <div className="gh-progress"><span /></div>
    </div>
  );
}

function Failed({ url, error }) {
  return (
    <div className="gh-loading">
      <p>{error}</p>
      <a className="gh-btn" href={url} target="_blank" rel="noopener noreferrer">Open on GitHub instead</a>
    </div>
  );
}

export default function GithubView({ url, onNavigate }) {
  const target = parseGithubUrl(url);
  if (!target) return null;
  return target.repo
    ? <Repo owner={target.owner} repo={target.repo} onNavigate={onNavigate} />
    : <Profile owner={target.owner} onNavigate={onNavigate} />;
}
