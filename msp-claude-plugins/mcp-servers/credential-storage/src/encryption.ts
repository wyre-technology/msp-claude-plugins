/**
 * AES-256-GCM encryption module for secure credential storage.
 * Provides authenticated encryption with associated data (AEAD).
 */

import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
import type { EncryptionConfig } from './types.js';

/**
 * Default encryption configuration
 */
export const DEFAULT_ENCRYPTION_CONFIG: EncryptionConfig = {
  keySize: 256,
  pbkdf2Iterations: 100000,
  saltLength: 32,
  ivLength: 16,
};

/**
 * Result of an encryption operation
 */
export interface EncryptionResult {
  /** Encrypted data (base64 encoded) */
  encryptedData: string;
  /** Initialization vector (base64 encoded) */
  iv: string;
  /** Authentication tag (base64 encoded) */
  authTag: string;
}

/**
 * Input for a decryption operation
 */
export interface DecryptionInput {
  /** Encrypted data (base64 encoded) */
  encryptedData: string;
  /** Initialization vector (base64 encoded) */
  iv: string;
  /** Authentication tag (base64 encoded) */
  authTag: string;
}

/**
 * Encrypts data using AES-256-GCM.
 *
 * AES-GCM provides both confidentiality and integrity through authenticated encryption.
 * Each encryption uses a unique IV to ensure identical plaintexts produce different ciphertexts.
 *
 * @param plaintext - The data to encrypt
 * @param key - 256-bit (32 byte) encryption key
 * @param config - Optional encryption configuration
 * @returns Encrypted data with IV and auth tag
 * @throws Error if key length is invalid or encryption fails
 */
export function encrypt(
  plaintext: string,
  key: Buffer,
  config: EncryptionConfig = DEFAULT_ENCRYPTION_CONFIG
): EncryptionResult {
  validateKeyLength(key, config.keySize);

  // Generate a cryptographically secure random IV
  // IV must be unique for each encryption with the same key
  const iv = randomBytes(config.ivLength);

  // Create cipher with AES-256-GCM (authenticated encryption)
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  // Encrypt the plaintext
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  // Get the authentication tag (GCM integrity check)
  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}

/**
 * Decrypts data that was encrypted with AES-256-GCM.
 *
 * Verifies the authentication tag to ensure data integrity before returning the plaintext.
 *
 * @param input - The encrypted data with IV and auth tag
 * @param key - 256-bit (32 byte) encryption key (must be same key used for encryption)
 * @param config - Optional encryption configuration
 * @returns Decrypted plaintext
 * @throws Error if decryption fails or authentication tag is invalid
 */
export function decrypt(
  input: DecryptionInput,
  key: Buffer,
  config: EncryptionConfig = DEFAULT_ENCRYPTION_CONFIG
): string {
  validateKeyLength(key, config.keySize);

  // Decode base64 inputs
  const encryptedData = Buffer.from(input.encryptedData, 'base64');
  const iv = Buffer.from(input.iv, 'base64');
  const authTag = Buffer.from(input.authTag, 'base64');

  // Create decipher
  const decipher = createDecipheriv('aes-256-gcm', key, iv);

  // Set the authentication tag for verification
  decipher.setAuthTag(authTag);

  try {
    // Decrypt the data
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(), // This will throw if auth tag verification fails
    ]);

    return decrypted.toString('utf8');
  } catch (error) {
    // Re-throw with a generic message to avoid leaking information
    throw new Error('Decryption failed: invalid key or corrupted data');
  }
}

/**
 * Generates a cryptographically secure random key of the specified size.
 *
 * @param keySize - Key size in bits (128, 192, or 256)
 * @returns Random key buffer
 */
export function generateKey(keySize: 128 | 192 | 256 = 256): Buffer {
  const keyBytes = keySize / 8;
  return randomBytes(keyBytes);
}

/**
 * Generates a cryptographically secure random salt.
 *
 * @param length - Salt length in bytes (default: 32)
 * @returns Random salt buffer
 */
export function generateSalt(length: number = 32): Buffer {
  return randomBytes(length);
}

/**
 * Generates a cryptographically secure random ID.
 *
 * @param length - ID length in bytes (default: 16, produces 32 hex characters)
 * @returns Random ID as hex string
 */
export function generateId(length: number = 16): string {
  return randomBytes(length).toString('hex');
}

/**
 * Validates that the key has the correct length for the specified key size.
 *
 * @param key - The key to validate
 * @param keySize - Expected key size in bits
 * @throws Error if key length is invalid
 */
function validateKeyLength(key: Buffer, keySize: number): void {
  const expectedBytes = keySize / 8;
  if (key.length !== expectedBytes) {
    throw new Error(
      `Invalid key length: expected ${expectedBytes} bytes for ${keySize}-bit key, got ${key.length} bytes`
    );
  }
}

/**
 * Securely compares two buffers in constant time to prevent timing attacks.
 *
 * @param a - First buffer
 * @param b - Second buffer
 * @returns true if buffers are equal, false otherwise
 */
export function constantTimeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i]! ^ b[i]!;
  }

  return result === 0;
}

/**
 * Securely erases a buffer by overwriting it with zeros.
 * Note: This is a best-effort operation; JavaScript/Node.js may
 * have already copied the data in memory.
 *
 * @param buffer - The buffer to erase
 */
export function secureErase(buffer: Buffer): void {
  buffer.fill(0);
}
