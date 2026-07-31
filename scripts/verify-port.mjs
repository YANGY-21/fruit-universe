// 验证迁移保真度：新旧两版数据逐字一致 + 评分结果相同
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, '..', '..', 'Desktop', 'fruit-test-v2.html');

const html = fs.readFileSync(htmlPath, 'utf8');
const fruitsMatch = html.match(/const FRUITS = (\{[\s\S]*?\});\n\nconst ALL_QS/);
const qsMatch = html.match(/const ALL_QS=(\[[\s\S]*?\]);\n\nfunction shuffle/);
if (!fruitsMatch || !qsMatch) {
  console.error('✗ 无法从旧版 HTML 提取数据');
  process.exit(1);
}

const ctx = {};
vm.createContext(ctx);
vm.runInContext(`globalThis.__FRUITS = ${fruitsMatch[1]}; globalThis.__QS = ${qsMatch[1]};`, ctx);
const oldFruits = ctx.__FRUITS;
const oldQs = ctx.__QS;

const { FRUITS, FRUIT_KEYS } = await import('../data/fruits.ts');
const { ALL_QS } = await import('../data/questions.ts');

let fail = 0;
const check = (cond, msg) => {
  if (!cond) {
    fail++;
    console.error('  ✗ ' + msg);
  }
};

// 1. 水果人格
console.log('== 水果人格数据对比 ==');
const oldKeys = Object.keys(oldFruits);
check(JSON.stringify(oldKeys) === JSON.stringify(FRUIT_KEYS), `FRUIT_KEYS 顺序不一致: ${oldKeys.join(',')} vs ${FRUIT_KEYS.join(',')}`);

for (const k of FRUIT_KEYS) {
  const o = oldFruits[k];
  const n = FRUITS[k];
  check(o.name === n.emoji + ' ' + n.name, `${k}: name 拆分不一致`);
  check(o.tag === n.tag, `${k}: tag 不一致`);
  check(o.sub === n.sub, `${k}: sub 不一致`);
  check(o.diagnosis === n.diagnosis, `${k}: diagnosis 不一致`);
  check(o.social === n.social, `${k}: social 不一致`);
  check(o.stress === n.stress, `${k}: stress 不一致`);
  check(o.blindspot === n.blindspot, `${k}: blindspot 不一致`);
  check(JSON.stringify(o.traits) === JSON.stringify(n.traits), `${k}: traits 不一致`);
  check(JSON.stringify(o.compat.good) === JSON.stringify(n.compat.good), `${k}: compat.good 不一致`);
  check(JSON.stringify(o.compat.tense) === JSON.stringify(n.compat.tense), `${k}: compat.tense 不一致`);
}

// 2. 题库
console.log('== 题库对比 ==');
check(oldQs.length === ALL_QS.length, `题数不一致: ${oldQs.length} vs ${ALL_QS.length}`);
for (let i = 0; i < ALL_QS.length; i++) {
  const o = oldQs[i];
  const n = ALL_QS[i];
  check(o.q === n.q, `题${i + 1}: 题干不一致`);
  check(o.o.length === n.o.length, `题${i + 1}: 选项数不一致`);
  for (let j = 0; j < n.o.length; j++) {
    check(o.o[j].l === n.o[j].l, `题${i + 1} 选项${j + 1}: 文本不一致`);
    check(JSON.stringify(o.o[j].s) === JSON.stringify(n.o[j].s), `题${i + 1} 选项${j + 1}: 权重不一致`);
  }
}

// 3. 评分算法对拍
console.log('== 评分算法对拍 ==');
function oldScore(questions, ans) {
  const sc = {};
  Object.keys(oldFruits).forEach((k) => (sc[k] = 0));
  questions.forEach((q, i) => {
    const idx = ans[i];
    if (idx === null || idx === undefined) return;
    for (const [k, v] of Object.entries(q.o[idx].s)) sc[k] = (sc[k] || 0) + v;
  });
  let mx = 0, top = 'apple';
  for (const k of Object.keys(sc)) if (sc[k] > mx) { mx = sc[k]; top = k; }
  return { sc, top };
}
function newScore(questions, ans) {
  const sc = {};
  for (const k of FRUIT_KEYS) sc[k] = 0;
  questions.forEach((q, i) => {
    const idx = ans[i];
    if (idx === null || idx === undefined) return;
    for (const [k, v] of Object.entries(q.o[idx].s)) sc[k] = (sc[k] || 0) + v;
  });
  let mx = 0, top = 'apple';
  for (const k of FRUIT_KEYS) if (sc[k] > mx) { mx = sc[k]; top = k; }
  return { sc, top };
}

let mismatches = 0;
for (let trial = 0; trial < 5000; trial++) {
  const ans = new Array(oldQs.length).fill(null).map(() => Math.floor(Math.random() * 4));
  const a = oldScore(oldQs, ans);
  const b = newScore(ALL_QS, ans);
  if (a.top !== b.top) {
    mismatches++;
    if (mismatches <= 5) console.error(`  对拍不符: ans=${ans.join(',')} old=${a.top} new=${b.top}`);
  }
  const aSorted = Object.keys(a.sc).sort((x, y) => a.sc[y] - a.sc[x]);
  const bSorted = [...FRUIT_KEYS].sort((x, y) => b.sc[y] - b.sc[x]);
  if (JSON.stringify(aSorted) !== JSON.stringify(bSorted)) {
    mismatches++;
    if (mismatches <= 5) console.error(`  排序不符: ans=${ans.join(',')}`);
  }
}
check(mismatches === 0, `5000 次随机对拍出现 ${mismatches} 次不一致`);

console.log(fail === 0 ? '\n✅ 全部通过：数据逐字一致，评分结果一致' : `\n❌ ${fail} 项不一致`);
process.exit(fail === 0 ? 0 : 1);
