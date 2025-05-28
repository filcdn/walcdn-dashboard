import { createQueryClient } from "./json-fetcher.js";

const accountId = ""
const databaseId = ""
const cloudflareEmail = ""
const cloudflareApiKey =""

const queryClient = createQueryClient(accountId, databaseId, cloudflareEmail, cloudflareApiKey)
const output = queryClient("SELECT COUNT() FROM retrieval_logs", [])

process.stdout.write(JSON.stringify(output));
