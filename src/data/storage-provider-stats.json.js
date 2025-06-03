import { query } from './cloudflare-client.js'

const response = await query(
  `
  SELECT
    owner_address,
    COUNT(*) AS total_requests,
    SUM(CASE WHEN cache_miss THEN 1 ELSE 0 END) AS cache_miss_requests,
    SUM(egress_bytes) AS total_egress_bytes,
    SUM(CASE WHEN cache_miss THEN egress_bytes ELSE 0 END) AS cache_miss_egress_bytes,
    AVG(CASE WHEN cache_miss THEN fetch_ttfb ELSE NULL END) AS avg_ttfb
  FROM
    retrieval_logs
  GROUP BY
    owner_address
  ORDER BY
    total_requests DESC;
`,
  [],
)

process.stdout.write(JSON.stringify(response.result[0].results))
