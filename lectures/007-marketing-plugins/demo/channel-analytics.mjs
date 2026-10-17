// 영상별: 총 조회, 공개 첫 2일 조회 비율, 평균 시청 비율 (YouTube Analytics, 읽기만 — publish.mjs auth youtube 로 분석 권한 필요)
//   node lectures/007-marketing-plugins/demo/channel-analytics.mjs lectures/007-marketing-plugins/demo/channel-2026-10-17.json
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
const cfg = f => JSON.parse(readFileSync(`${homedir()}/.config/tech-lectures/${f}`, 'utf8'));
const c = cfg('youtube-client.json'), cl = c.installed || c.web, { refresh_token } = cfg('youtube.json');
const tok = (await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body: new URLSearchParams({ client_id: cl.client_id, client_secret: cl.client_secret, refresh_token, grant_type: 'refresh_token' }) })).json()).access_token;
const data = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const q = async p => { const u = new URL('https://youtubeanalytics.googleapis.com/v2/reports'); for (const [k, v] of Object.entries({ ids: 'channel==MINE', startDate: '2026-09-25', endDate: '2026-10-16', ...p })) u.searchParams.set(k, v); return (await fetch(u, { headers: { Authorization: `Bearer ${tok}` } })).json(); };
const out = [];
for (const v of data.videos) {
  const d = await q({ metrics: 'views', dimensions: 'day', filters: `video==${v.video}`, sort: 'day' });
  const s = await q({ metrics: 'views,averageViewDuration,averageViewPercentage,likes,subscribersGained', filters: `video==${v.video}` });
  const rows = (d.rows || []).filter(r => r[1] > 0), tot = rows.reduce((a, r) => a + r[1], 0);
  const pubDay = v.published.slice(0, 10), kst = new Date(new Date(v.published + ':00Z').getTime() + 9 * 36e5).toISOString().slice(0, 10);
  const first2 = rows.filter(r => r[0] <= new Date(new Date(kst).getTime() + 864e5).toISOString().slice(0, 10)).reduce((a, r) => a + r[1], 0);
  const [views, avd, avp, likes, subs] = s.rows?.[0] || [];
  out.push({ ...v, aViews: views, avd, avp: +(+avp).toFixed(0), subs, first2, first2pct: tot ? Math.round(first2 / tot * 100) : 0 });
  console.log([v.lecture, v.kind.padEnd(5), v.id.padEnd(8), (v.seconds + 's').padStart(4), String(views).padStart(5), `첫2일 ${String(tot ? Math.round(first2 / tot * 100) : 0).padStart(3)}%`, `평균 ${avd}초 ${(+avp).toFixed(0)}%`, `구독+${subs}`, v.title.slice(0, 34)].join(' | '));
}
