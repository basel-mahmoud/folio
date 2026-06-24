/**
 * Tiny load test for the public read path. No external deps.
 * Usage: BASE_URL=https://folio-fawn-nu.vercel.app HANDLE=basel N=300 C=20 npm run loadtest
 */
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const HANDLE = process.env.HANDLE ?? "basel";
const N = Number(process.env.N ?? 200);
const C = Number(process.env.C ?? 20);
const ENDPOINT = `${BASE}/api/public/${HANDLE}`;

async function main() {
  const latencies: number[] = [];
  let ok = 0;
  let fail = 0;
  let next = 0;

  async function worker() {
    while (next < N) {
      const i = next++;
      void i;
      const t0 = Date.now();
      try {
        const res = await fetch(ENDPOINT);
        const ms = Date.now() - t0;
        latencies.push(ms);
        if (res.ok) ok++;
        else fail++;
      } catch {
        fail++;
      }
    }
  }

  const start = Date.now();
  await Promise.all(Array.from({ length: C }, worker));
  const total = (Date.now() - start) / 1000;

  latencies.sort((a, b) => a - b);
  const pct = (p: number) => latencies[Math.min(latencies.length - 1, Math.floor((p / 100) * latencies.length))] ?? 0;

  console.log(`\nLoad test → ${ENDPOINT}`);
  console.log(`requests=${N} concurrency=${C} duration=${total.toFixed(2)}s rps=${(N / total).toFixed(1)}`);
  console.log(`ok=${ok} fail=${fail}`);
  console.log(`latency ms: p50=${pct(50)} p90=${pct(90)} p99=${pct(99)} max=${latencies[latencies.length - 1] ?? 0}`);
  process.exit(fail > N * 0.05 ? 1 : 0);
}

main();
