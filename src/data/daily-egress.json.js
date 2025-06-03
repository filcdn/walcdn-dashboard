import { query } from './cloudflare-client.js'

const response = await query(
  `SELECT
  DATE(timestamp) AS day,
  sum(egress_bytes) AS total_egresss
FROM
  retrieval_logs
WHERE
  timestamp >= DATE('now', '-30 days')
GROUP BY
  day
ORDER BY
  day;
`,
  [],
)

process.stdout.write(JSON.stringify(response.result[0].results))
