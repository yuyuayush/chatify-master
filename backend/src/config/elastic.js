import {Client} from '@elastic/elasticsearch';

export const esClient = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "pp93qCowagCQbg_tyOin", // replace with your actual one
  },
  tls: {
    rejectUnauthorized: false, // ✅ allow self-signed certificate
  },
});