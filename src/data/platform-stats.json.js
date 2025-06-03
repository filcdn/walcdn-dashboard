import { query } from './cloudflare-client.js'

const response = await query(
  `
  SELECT
    SUM(CASE WHEN cache_miss THEN 1 ELSE 0 END) AS cache_miss_requests,
    SUM(CASE WHEN NOT cache_miss THEN 1 ELSE 0 END) AS cache_hit_requests,
    SUM(egress_bytes) AS total_egress_bytes,
    COUNT(*) AS total_requests
  FROM
    retrieval_logs;
`,
  [],
)

process.stdout.write(JSON.stringify(response.result[0].results[0]))
