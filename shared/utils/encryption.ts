import crypto from "node:crypto";

// Use a secret key from environment variables or generate one
const SECRET_KEY =
  process.env.ENCRYPTION_SECRET || "default-secret-key-change-in-production";
const ALGORITHM = "aes-256-cbc";

// Encrypt data
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY.padEnd(32).slice(0, 32)),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

// Decrypt data
export function decrypt(encryptedText: string): string {
  const [ivHex, encryptedHex] = encryptedText.split(":");

  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid encrypted text format");
  }

  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY.padEnd(32).slice(0, 32)),
    iv
  );

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
