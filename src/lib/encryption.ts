import Ncrypt from "ncrypt-js";

if (!process.env.ENCRYPTION_SECRET) {
  throw new Error("ENCRYPTION_SECRET missing in your .env file!");
}

const { encrypt, decrypt } = new Ncrypt(process.env.ENCRYPTION_SECRET);

export { encrypt, decrypt };
