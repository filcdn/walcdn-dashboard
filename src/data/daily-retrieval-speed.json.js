import { query } from './cloudflare-client.js'

const response = await query(
  `
WITH speeds AS (
    SELECT
        DATE(timestamp) AS day,
        (egress_bytes * 8.0) / (fetch_ttlb / 1000.0) / 1_000_000 AS retrieval_speed_mbps
    FROM
        retrieval_logs
    WHERE
        cache_miss = 1 AND
        fetch_ttlb > 0
),
ordered_speeds AS (
    SELECT
        day,
        retrieval_speed_mbps,
        ROW_NUMBER() OVER (PARTITION BY day ORDER BY retrieval_speed_mbps) AS row_num,
        COUNT(*) OVER (PARTITION BY day) AS total_count
    FROM
        speeds
)
SELECT
    day,
    ROUND(AVG(retrieval_speed_mbps), 2) AS avg_retrieval_speed_mbps,
    (
        SELECT
            retrieval_speed_mbps
        FROM
            ordered_speeds os
        WHERE
            os.day = s.day AND
            os.row_num >= (os.total_count * 0.95)
        ORDER BY
            retrieval_speed_mbps
        LIMIT 1
    ) AS p95_retrieval_speed_mbps
FROM
    speeds s
GROUP BY
    day
ORDER BY
    day;
`,
  [],
)

process.stdout.write(JSON.stringify(response.result[0].results))
