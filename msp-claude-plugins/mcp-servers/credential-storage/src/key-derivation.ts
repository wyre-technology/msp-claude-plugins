/**
 * Key derivation module using PBKDF2.
 * Derives per-user encryption keys from a master key.
 */

import { pbkdf2Sync, timingSafeEqual } from 'node:crypto';
import { generateSalt, DEFAULT_ENCRYPTION_CONFIG } from './encryption.js';
import type { KeyDerivationParams, EncryptionConfig } from './types.js';

/**
 * Default key derivation configuration
 */
export const DEFAULT_KEY_DERIVATION_CONFIG: KeyDerivationParams = {
  salt: Buffer.alloc(0), // Will be generated
  iterations: 100000,
  keyLength: 32, // 256 bits
  digest: 'sha512',
};

/**
 * Result of a key derivation operation
 */
export interface DerivedKeyResult {
  /** The derived key */
  key: Buffer;
  /** The salt used for derivation */
  salt: Buffer;
  /** Number of iterations used */
  iterations: number;
}

/**
 * Derives a user-specific encryption key from the master key.
 *
 * Uses PBKDF2 with a user-specific salt to derive unique keys for each user.
 * This ensures that even with the same master key, each user's data is
 * encrypted with a different key.
 *
 * @param masterKey - The master encryption key
 * @param userId - The user identifier (used in key derivation)
 * @param salt - Optional salt (will be generated if not provided)
 * @param config - Optional encryption configuration
 * @returns Derived key result with key, salt, and iterations
 */
export function deriveUserKey(
  masterKey: Buffer,
  userId: string,
  salt?: Buffer,
  config: Partial<EncryptionConfig> = {}
): DerivedKeyResult {
  const mergedConfig = { ...DEFAULT_ENCRYPTION_CONFIG, ...config };

  // Generate or use provided salt
  const derivationSalt = salt ?? generateSalt(mergedConfig.saltLength);

  // Combine master key with user ID to create a unique derivation input
  // This ensures different users get different keys even with the same salt
  const keyMaterial = Buffer.concat([masterKey, Buffer.from(userId, 'utf8')]);

  // Derive the key using PBKDF2
  const derivedKey = pbkdf2Sync(
    keyMaterial,
    derivationSalt,
    mergedConfig.pbkdf2Iterations,
    mergedConfig.keySize / 8,
    'sha512'
  );

  return {
    key: derivedKey,
    salt: derivationSalt,
    iterations: mergedConfig.pbkdf2Iterations,
  };
}

/**
 * Derives a credential-specific encryption key.
 *
 * For additional security, each credential can have its own derived key.
 * This limits the impact if a single key is compromised.
 *
 * @param userKey - The user's derived key
 * @param credentialId - The credential identifier
 * @param salt - The salt for this credential
 * @param iterations - Number of PBKDF2 iterations
 * @returns The derived credential key
 */
export function deriveCredentialKey(
  userKey: Buffer,
  credentialId: string,
  salt: Buffer,
  iterations: number = DEFAULT_KEY_DERIVATION_CONFIG.iterations
): Buffer {
  // Combine user key with credential ID
  const keyMaterial = Buffer.concat([userKey, Buffer.from(credentialId, 'utf8')]);

  // Derive credential-specific key
  return pbkdf2Sync(keyMaterial, salt, iterations, 32, 'sha512');
}

/**
 * Key wrapping - encrypts a key using another key.
 *
 * Used for secure key storage and transport.
 *
 * @param keyToWrap - The key to be wrapped (protected)
 * @param wrappingKey - The key used to wrap
 * @returns Wrapped key data
 */
export interface WrappedKey {
  /** The wrapped (encrypted) key */
  wrappedKey: Buffer;
  /** The IV used for wrapping */
  iv: Buffer;
  /** The authentication tag */
  authTag: Buffer;
}

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/**
 * Wraps a key using AES-256-GCM key wrapping.
 *
 * @param keyToWrap - The key to protect
 * @param wrappingKey - The key encryption key (KEK)
 * @returns The wrapped key with IV and auth tag
 */
export function wrapKey(keyToWrap: Buffer, wrappingKey: Buffer): WrappedKey {
  if (wrappingKey.length !== 32) {
    throw new Error('Wrapping key must be 256 bits (32 bytes)');
  }

  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', wrappingKey, iv);

  const wrappedKey = Buffer.concat([cipher.update(keyToWrap), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return { wrappedKey, iv, authTag };
}

/**
 * Unwraps a key that was wrapped using wrapKey.
 *
 * @param wrapped - The wrapped key data
 * @param wrappingKey - The key encryption key (KEK)
 * @returns The unwrapped key
 * @throws Error if unwrapping fails
 */
export function unwrapKey(wrapped: WrappedKey, wrappingKey: Buffer): Buffer {
  if (wrappingKey.length !== 32) {
    throw new Error('Wrapping key must be 256 bits (32 bytes)');
  }

  const decipher = createDecipheriv('aes-256-gcm', wrappingKey, wrapped.iv);
  decipher.setAuthTag(wrapped.authTag);

  try {
    return Buffer.concat([decipher.update(wrapped.wrappedKey), decipher.final()]);
  } catch {
    throw new Error('Key unwrapping failed: invalid wrapping key or corrupted data');
  }
}

/**
 * Verifies that a derived key matches an expected value.
 *
 * Uses timing-safe comparison to prevent timing attacks.
 *
 * @param derivedKey - The derived key to verify
 * @param expectedKey - The expected key value
 * @returns true if keys match, false otherwise
 */
export function verifyDerivedKey(derivedKey: Buffer, expectedKey: Buffer): boolean {
  if (derivedKey.length !== expectedKey.length) {
    return false;
  }
  return timingSafeEqual(derivedKey, expectedKey);
}

/**
 * Generates a master key from a password/passphrase.
 *
 * This should only be used during initial setup or key recovery.
 * In production, master keys should be provided via secure key management.
 *
 * @param password - The password/passphrase
 * @param salt - Salt for derivation (should be stored securely)
 * @param iterations - Number of iterations (higher = more secure but slower)
 * @returns The derived master key
 */
export function masterKeyFromPassword(
  password: string,
  salt: Buffer,
  iterations: number = 200000 // Higher iterations for master key
): Buffer {
  return pbkdf2Sync(password, salt, iterations, 32, 'sha512');
}

/**
 * Key rotation support - derives a new key version.
 *
 * @param currentKey - The current key
 * @param version - The new version number
 * @param salt - Salt for the new version
 * @returns The new versioned key
 */
export function deriveVersionedKey(
  currentKey: Buffer,
  version: number,
  salt: Buffer
): Buffer {
  const versionBuffer = Buffer.alloc(4);
  versionBuffer.writeUInt32BE(version, 0);

  const keyMaterial = Buffer.concat([currentKey, versionBuffer]);

  return pbkdf2Sync(keyMaterial, salt, 50000, 32, 'sha512');
}
