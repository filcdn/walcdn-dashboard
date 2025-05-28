export function createQueryClient(accountId, databaseId, cloudflareEmail, cloudflareApiKey) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  /**
  * @param {string} sql
  * @param {string[]} params
  * @returns {Promise<Response>} response
  */
  return function(sql, params) {
    const body = {
      sql,
      params
    };
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': cloudflareEmail,
        'X-Auth-Key': cloudflareApiKey
      },
      body: JSON.stringify(body)
    })
  }
}
