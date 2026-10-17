// 채널 영상 전체의 실제 데이터(제목·길이·업로드 시각·조회·좋아요·댓글)를 읽어 표로 저장 (읽기만)
//   node lectures/007-marketing-plugins/demo/channel-data.mjs lectures/007-marketing-plugins/demo/channel-YYYY-MM-DD.json
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
const cfg = f => JSON.parse(readFileSync(`${homedir()}/.config/tech-lectures/${f}`, 'utf8'));
const c = cfg('youtube-client.json'), cl = c.installed || c.web, { refresh_token } = cfg('youtube.json');
const tok = (await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: cl.client_id, client_secret: cl.client_secret, refresh_token, grant_type: 'refresh_token' }) })).json()).access_token;
const root = new URL('../../', import.meta.url).pathname;  // lectures/
const items = [];
for (const d of readdirSync(root).sort()) {
  let pub; try { pub = JSON.parse(readFileSync(`${root}/${d}/publish.json`, 'utf8')); } catch { continue; }
  for (const it of pub.items.filter(x => x.target === 'youtube' && x.uploaded)) items.push({ lecture: d.slice(0, 3), id: it.id, vid: it.uploaded.split('/').pop() });
}
const ids = items.map(x => x.vid).join(',');
const j = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,status&id=${ids}`, { headers: { Authorization: `Bearer ${tok}` } })).json();
const by = Object.fromEntries(j.items.map(v => [v.id, v]));
const iso = s => { const m = s.match(/PT(?:(\d+)M)?(?:(\d+)S)?/); return (+(m[1] || 0)) * 60 + (+(m[2] || 0)); };
const now = Date.now();
const rows = items.map(x => { const v = by[x.vid]; const pub = v.status.publishAt || v.snippet.publishedAt; const days = (now - new Date(pub)) / 864e5;
  return { lecture: x.lecture, kind: x.id.startsWith('shorts') ? 'short' : 'long', id: x.id, video: x.vid, title: v.snippet.title, seconds: iso(v.contentDetails.duration),
    published: pub.slice(0, 16), days: +days.toFixed(1), views: +v.statistics.viewCount, likes: +(v.statistics.likeCount || 0), comments: +(v.statistics.commentCount || 0), privacy: v.status.privacyStatus }; });
const ch = await (await fetch('https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true', { headers: { Authorization: `Bearer ${tok}` } })).json();
const out = { fetchedAt: new Date().toISOString(), channel: { title: ch.items[0].snippet.title, subscribers: +ch.items[0].statistics.subscriberCount, videos: +ch.items[0].statistics.videoCount, views: +ch.items[0].statistics.viewCount }, videos: rows };
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(JSON.stringify(out.channel));
for (const r of rows) console.log([r.lecture, r.kind, r.id, r.seconds + 's', r.published, r.days + 'd', r.views, r.likes, r.comments, r.title].join(' | '));
