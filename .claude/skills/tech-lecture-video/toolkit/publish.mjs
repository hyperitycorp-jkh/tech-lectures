// 강의 결과물 업로드 — 유튜브(롱폼·쇼츠) + Buffer(Threads·인스타). 기본은 dry-run: 올릴 목록만 보여 주고 인증 파일도 읽지 않는다.
//   node toolkit/publish.mjs lectures/NNN/publish.json                 ← 무엇을 어디에 올릴지 확인
//   node toolkit/publish.mjs lectures/NNN/publish.json --go [--only id,id]   ← 실제 업로드 (공개 게시물이므로 사용자 확인 후에만)
//   node toolkit/publish.mjs auth youtube        ← 강의 채널로 로그인해 refresh token 저장 (브라우저)
//   node toolkit/publish.mjs buffer-channels     ← Buffer 채널 id 목록 (buffer.json 채우기용)
// 인증 파일 (레포 밖, ~/.config/tech-lectures/):
//   youtube-client.json  Google OAuth 클라이언트 (GCP 콘솔 → 사용자 인증 정보 → 데스크톱 앱, JSON 다운로드)
//   youtube.json         { refresh_token }  ← auth youtube 가 만든다
//   buffer.json          { token, channels: { threads: "<id>", instagram: "<id>" } }
// publish.json: { base: "<공개 버킷 URL/>", items: [{ id, target: youtube|threads|instagram, ... }] }  — 예: lectures/001-*/publish.json
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { homedir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const CFG = join(homedir(), '.config/tech-lectures');
const readCfg = f => {
  const p = join(CFG, f);
  if (!existsSync(p)) throw new Error(`인증 파일이 없습니다: ${p} — toolkit/publish.mjs 맨 위 설명 참고`);
  return JSON.parse(readFileSync(p, 'utf8'));
};
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };

// ── 유튜브 ──
async function youtubeToken() {
  const c = readCfg('youtube-client.json'), cl = c.installed || c.web, { refresh_token } = readCfg('youtube.json');
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body: new URLSearchParams({
    client_id: cl.client_id, client_secret: cl.client_secret, refresh_token, grant_type: 'refresh_token' }) });
  const j = await r.json();
  if (!j.access_token) throw new Error(`유튜브 토큰 갱신 실패: ${JSON.stringify(j)}`);
  return j.access_token;
}
async function youtubeUpload(it, { dir }) {
  const tok = await youtubeToken(), file = resolve(dir, it.file), size = statSync(file).size;
  const meta = { snippet: { title: it.title, description: it.description || '', tags: it.tags || [], categoryId: it.category || '27', defaultLanguage: 'ko' },
    status: { privacyStatus: it.privacy || 'private', selfDeclaredMadeForKids: false } };
  const init = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
    method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json', 'X-Upload-Content-Type': 'video/mp4', 'X-Upload-Content-Length': String(size) },
    body: JSON.stringify(meta) });
  if (!init.ok) throw new Error(`업로드 시작 실패 ${init.status}: ${await init.text()}`);
  const put = await fetch(init.headers.get('location'), { method: 'PUT', headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(size) }, body: readFileSync(file) });
  const v = await put.json();
  if (!v.id) throw new Error(`업로드 실패: ${JSON.stringify(v)}`);
  if (it.thumbnail) {
    const r = await fetch(`https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${v.id}`, {
      method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'image/png' }, body: readFileSync(resolve(dir, it.thumbnail)) });
    if (!r.ok) console.warn(`  썸네일 실패(채널 인증이 안 된 채널은 맞춤 썸네일 불가): ${r.status}`);
  }
  if (it.captions) {
    const boundary = 'x' + Date.now(), body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify({ snippet: { videoId: v.id, language: 'ko', name: '한국어' } })}\r\n--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n`),
      readFileSync(resolve(dir, it.captions)), Buffer.from(`\r\n--${boundary}--`)]);
    const r = await fetch('https://www.googleapis.com/upload/youtube/v3/captions?uploadType=multipart&part=snippet', {
      method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': `multipart/related; boundary=${boundary}` }, body });
    if (!r.ok) console.warn(`  자막 실패: ${r.status} ${await r.text()}`);
  }
  return `https://youtu.be/${v.id}`;
}

// ── Buffer (Threads · 인스타) — viral-engine functions/src/services/buffer.ts 와 같은 GraphQL ──
async function buffer(query, variables) {
  const { token } = readCfg('buffer.json');
  const r = await fetch('https://api.buffer.com', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables }) });
  const j = await r.json();
  if (j.errors?.length) throw new Error(`Buffer: ${j.errors[0].message}`);
  return j.data;
}
const asset = url => url.toLowerCase().endsWith('.mp4') ? { video: { url } } : { image: { url } };
// 서비스별 게시 메타 (종류 → 메타)
const BUFFER_META = {
  threads: it => it.replies?.length ? { threads: { thread: it.replies.map(text => ({ text, assets: [] })) } } : undefined,
  instagram: it => ({ instagram: { type: it.media?.[0]?.endsWith('.mp4') ? 'reel' : 'post', shouldShareToFeed: true } }),
};
async function bufferPost(it, { pub }) {
  const { channels } = readCfg('buffer.json'), channelId = channels?.[it.target];
  if (!channelId) throw new Error(`buffer.json 에 ${it.target} 채널 id 가 없습니다 (node toolkit/publish.mjs buffer-channels)`);
  const input = { text: it.text, channelId, schedulingType: 'automatic', mode: 'shareNow' };
  const meta = BUFFER_META[it.target](it); if (meta) input.metadata = meta;
  if (it.media?.length) input.assets = it.media.map(m => asset(pub.base + m));
  const d = await buffer(`mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { __typename ... on PostActionSuccess { post { id } } ... on MutationError { message } } }`, { input });
  const p = d.createPost;
  if (p.__typename !== 'PostActionSuccess') throw new Error(`Buffer 게시 실패: ${p.message || p.__typename}`);
  return `buffer post ${p.post.id}`;
}

const TARGETS = { youtube: youtubeUpload, threads: bufferPost, instagram: bufferPost };

// ── 명령 ──
if (args[0] === 'auth' && args[1] === 'youtube') {
  const c = readCfg('youtube-client.json'), cl = c.installed || c.web;
  const port = 53682, redirect = `http://localhost:${port}`;
  const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({ client_id: cl.client_id, redirect_uri: redirect, response_type: 'code',
    access_type: 'offline', prompt: 'consent', scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl' });
  console.log('브라우저에서 강의 채널 계정으로 로그인하세요 (채널 선택 화면에서 강의 채널을 고르기):\n' + url);
  try { execFileSync('open', [url]); } catch {}
  const code = await new Promise(ok => { const s = createServer((req, res) => { const c = new URL(req.url, redirect).searchParams.get('code'); res.end('완료 — 터미널로 돌아가세요'); s.close(); ok(c); }).listen(port); });
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body: new URLSearchParams({ code, client_id: cl.client_id, client_secret: cl.client_secret, redirect_uri: redirect, grant_type: 'authorization_code' }) });
  const j = await r.json();
  if (!j.refresh_token) throw new Error(`토큰 발급 실패: ${JSON.stringify(j)}`);
  mkdirSync(CFG, { recursive: true });
  writeFileSync(join(CFG, 'youtube.json'), JSON.stringify({ refresh_token: j.refresh_token }), { mode: 0o600 });
  console.log(`저장 → ${join(CFG, 'youtube.json')}`);
} else if (args[0] === 'buffer-channels') {
  const d = await buffer('query { account { organizations { channels { id name service } } } }');
  for (const ch of d.account.organizations.flatMap(o => o.channels)) console.log(`${ch.service.padEnd(10)} ${ch.id}  ${ch.name}`);
} else {
  const path = resolve(args[0] || ''), dir = dirname(path);
  if (!path.endsWith('.json')) { console.error('usage: node toolkit/publish.mjs <publish.json> [--go] [--only id,id] | auth youtube | buffer-channels'); process.exit(1); }
  const pub = JSON.parse(readFileSync(path, 'utf8')), only = opt('only')?.split(',');
  const items = pub.items.filter(it => !only || only.includes(it.id)), GO = args.includes('--go');
  console.log(GO ? '▶ 업로드 시작' : '▷ dry-run (올리지 않음 — 실제로 올리려면 --go)');
  for (const it of items) {
    const files = [it.file, it.thumbnail, it.captions].filter(Boolean).map(f => resolve(dir, f));
    const missing = files.filter(f => !existsSync(f));
    const media = (it.media || []).map(m => pub.base + m);
    console.log(`\n[${it.id}] → ${it.target}${it.privacy ? ` (${it.privacy})` : ''}`);
    if (it.title) console.log(`  제목: ${it.title}`);
    console.log(`  글: ${(it.text || it.description || '').split('\n')[0].slice(0, 80)}${it.replies ? ` (+답글 ${it.replies.length}개)` : ''}`);
    files.forEach(f => console.log(`  파일: ${f}${existsSync(f) ? '' : '  ✗ 없음'}`));
    media.forEach(m => console.log(`  미디어 URL: ${m}`));
    const holes = [it.text, it.description, ...(it.replies || [])].join(' ').match(/\[[^\]]*링크\]/g);
    if (holes) console.log(`  ✗ 채울 자리 남음: ${[...new Set(holes)].join(', ')}`);
    if (!GO) continue;
    if (missing.length || holes) { console.log('  ✗ 건너뜀 (파일 없음 또는 채울 자리)'); continue; }
    try { console.log(`  ✓ ${await TARGETS[it.target](it, { dir, pub })}`); }
    catch (e) { console.log(`  ✗ ${e.message}`); }
  }
}
