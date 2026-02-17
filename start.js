// start.js - place this at the root of your deploy package
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

console.log("process.env.NODE_ENV is: ", process.env.NODE_ENV);

async function loadSecrets() {
  // Only works when run from an Azure managed identity.
  if (process.env.NODE_ENV !== "production") return;

  console.log("⏳ Fetching secrets from Azure Key Vault...");
  const credential = new DefaultAzureCredential();
  const kvClient = new SecretClient(process.env.KEY_VAULT_URL, credential);

  const [dbUrl, nextAuthUrl, nextAuthSecret] = await Promise.all([
    kvClient.getSecret("PG-CONNECTION-STRING"),
    kvClient.getSecret("NEXTAUTH-URL"),
    kvClient.getSecret("NEXTAUTH-SECRET"),
  ]);

  process.env.APP_DATABASE_URL = dbUrl.value;
  process.env.NEXTAUTH_URL = nextAuthUrl.value;
  process.env.NEXTAUTH_SECRET = nextAuthSecret.value;
  console.log("✅ Secrets loaded.");
}

loadSecrets().then(() => {
  require("./server.js"); // start Next.js after secrets are ready
});
