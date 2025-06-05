import { query } from './cloudflare-client.js'

const response = await query(
  `
WITH speeds AS (
    SELECT
        owner_address,
        (egress_bytes * 8.0) / (fetch_ttlb / 1000.0) / 1_000_000 AS retrieval_speed_mbps
    FROM
        retrieval_logs
    WHERE
        cache_miss = 1 AND
        fetch_ttlb > 0
),
ordered_speeds AS (
    SELECT
        owner_address,
        retrieval_speed_mbps,
        ROW_NUMBER() OVER (PARTITION BY owner_address ORDER BY retrieval_speed_mbps) AS row_num,
        COUNT(*) OVER (PARTITION BY owner_address) AS total_count
    FROM
        speeds
)
SELECT
    rl.owner_address,
    COUNT(*) AS total_requests,
    SUM(CASE WHEN rl.cache_miss THEN 1 ELSE 0 END) AS cache_miss_requests,
    SUM(rl.egress_bytes) AS total_egress_bytes,
    SUM(CASE WHEN rl.cache_miss THEN rl.egress_bytes ELSE 0 END) AS cache_miss_egress_bytes,
    AVG(CASE WHEN rl.cache_miss THEN rl.fetch_ttfb ELSE NULL END) AS avg_ttfb,
    ROUND(AVG(CASE WHEN rl.cache_miss THEN (rl.egress_bytes * 8.0) / (rl.fetch_ttlb / 1000.0) / 1_000_000 ELSE NULL END), 2) AS avg_cache_miss_retrieval_speed_mbps,
    (
        SELECT
            os.retrieval_speed_mbps
        FROM
            ordered_speeds os
        WHERE
            os.owner_address = rl.owner_address
            AND os.row_num >= (os.total_count * 0.95)
        ORDER BY
            os.retrieval_speed_mbps
        LIMIT 1
    ) AS p95_cache_miss_retrieval_speed_mbps
FROM
    retrieval_logs rl
GROUP BY
    rl.owner_address
ORDER BY
    total_requests DESC;
`,
  [],
)

process.stdout.write(JSON.stringify(response.result[0].results))
