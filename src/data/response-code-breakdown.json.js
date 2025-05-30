import { query } from "./cloudflare-client.js";

const response = await query(`
WITH daily_totals AS (
  SELECT
    DATE(timestamp) AS day,
    COUNT(*) AS total_requests
  FROM
    retrieval_logs
  GROUP BY
    day
)
SELECT
  DATE(r.timestamp) AS day,
  r.response_status AS code,
  ROUND((COUNT(*) * 100.0) / dt.total_requests, 2) AS rate
FROM
  retrieval_logs r
  JOIN daily_totals dt ON DATE(r.timestamp) = dt.day
GROUP BY
  day,
  code
ORDER BY
  day,
  code;
`, [])

process.stdout.write(JSON.stringify(response.result[0].results));
