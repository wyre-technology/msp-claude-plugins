/**
 * TypeScript interfaces for the credential storage system.
 * Defines all data structures for credentials, encryption, and audit logging.
 */

/**
 * Supported credential types
 */
export type CredentialType = 'api_key' | 'oauth_token' | 'secret' | 'certificate';

/**
 * Supported vendor identifiers
 */
export type VendorId =
  | 'autotask'
  | 'datto_rmm'
  | 'it_glue'
  | 'syncro'
  | 'atera'
  | 'superops'
  | 'halopsa'
  | string; // Allow custom vendor IDs

/**
 * Metadata associated with a credential
 */
export interface CredentialMetadata {
  /** Human-readable label for the credential */
  label?: string;
  /** When the credential was created */
  createdAt: Date;
  /** When the credential was last updated */
  updatedAt: Date;
  /** When the credential expires (if applicable) */
  expiresAt?: Date;
  /** Last time the credential was accessed for use */
  lastAccessedAt?: Date;
  /** Number of times the credential has been accessed */
  accessCount: number;
  /** Whether the credential is currently active */
  isActive: boolean;
  /** Custom metadata fields */
  custom?: Record<string, unknown>;
}

/**
 * A stored credential (encrypted form)
 */
export interface StoredCredential {
  /** Unique identifier for this credential */
  id: string;
  /** User/tenant who owns this credential */
  userId: string;
  /** Vendor this credential is for */
  vendorId: VendorId;
  /** Type of credential */
  type: CredentialType;
  /** Encrypted credential data (base64 encoded) */
  encryptedData: string;
  /** Initialization vector used for encryption (base64 encoded) */
  iv: string;
  /** Authentication tag for GCM mode (base64 encoded) */
  authTag: string;
  /** Salt used for key derivation (base64 encoded) */
  salt: string;
  /** Version of the encryption schema */
  encryptionVersion: number;
  /** Credential metadata */
  metadata: CredentialMetadata;
}

/**
 * Decrypted credential data
 */
export interface DecryptedCredential {
  /** The credential ID */
  id: string;
  /** User/tenant who owns this credential */
  userId: string;
  /** Vendor this credential is for */
  vendorId: VendorId;
  /** Type of credential */
  type: CredentialType;
  /** The decrypted credential value(s) */
  data: CredentialData;
  /** Credential metadata */
  metadata: CredentialMetadata;
}

/**
 * Credential data structure - varies by type
 */
export type CredentialData =
  | ApiKeyCredential
  | OAuthTokenCredential
  | SecretCredential
  | CertificateCredential;

/**
 * API key credential
 */
export interface ApiKeyCredential {
  type: 'api_key';
  /** The API key value */
  apiKey: string;
  /** Optional API secret for key+secret pairs */
  apiSecret?: string;
  /** Optional additional headers */
  additionalHeaders?: Record<string, string>;
}

/**
 * OAuth token credential
 */
export interface OAuthTokenCredential {
  type: 'oauth_token';
  /** The access token */
  accessToken: string;
  /** The refresh token (if available) */
  refreshToken?: string;
  /** Token type (usually 'Bearer') */
  tokenType: string;
  /** Token expiration timestamp */
  expiresAt?: Date;
  /** OAuth scopes */
  scope?: string[];
}

/**
 * Generic secret credential
 */
export interface SecretCredential {
  type: 'secret';
  /** The secret value */
  value: string;
  /** Optional key-value pairs for complex secrets */
  additionalFields?: Record<string, string>;
}

/**
 * Certificate credential
 */
export interface CertificateCredential {
  type: 'certificate';
  /** The certificate in PEM format */
  certificate: string;
  /** The private key in PEM format */
  privateKey?: string;
  /** Certificate passphrase if encrypted */
  passphrase?: string;
}

/**
 * Input for creating a new credential
 */
export interface CreateCredentialInput {
  /** User/tenant who owns this credential */
  userId: string;
  /** Vendor this credential is for */
  vendorId: VendorId;
  /** Type of credential */
  type: CredentialType;
  /** The credential data to store */
  data: CredentialData;
  /** Optional label */
  label?: string;
  /** Optional expiration date */
  expiresAt?: Date;
  /** Optional custom metadata */
  custom?: Record<string, unknown>;
}

/**
 * Input for updating a credential
 */
export interface UpdateCredentialInput {
  /** The credential data to store (optional - if not provided, only metadata is updated) */
  data?: CredentialData;
  /** Optional new label */
  label?: string;
  /** Optional new expiration date */
  expiresAt?: Date;
  /** Whether the credential is active */
  isActive?: boolean;
  /** Optional custom metadata */
  custom?: Record<string, unknown>;
}

/**
 * Query options for listing credentials
 */
export interface CredentialQuery {
  /** Filter by user ID */
  userId?: string;
  /** Filter by vendor ID */
  vendorId?: VendorId;
  /** Filter by credential type */
  type?: CredentialType;
  /** Filter by active status */
  isActive?: boolean;
  /** Include only non-expired credentials */
  excludeExpired?: boolean;
}

/**
 * Encryption configuration
 */
export interface EncryptionConfig {
  /** AES key size in bits (256 recommended) */
  keySize: 128 | 192 | 256;
  /** PBKDF2 iterations (minimum 100000 recommended) */
  pbkdf2Iterations: number;
  /** Salt length in bytes */
  saltLength: number;
  /** IV length in bytes for AES-GCM */
  ivLength: number;
}

/**
 * Key derivation parameters
 */
export interface KeyDerivationParams {
  /** The salt used for derivation */
  salt: Buffer;
  /** Number of PBKDF2 iterations */
  iterations: number;
  /** Derived key length in bytes */
  keyLength: number;
  /** Hash algorithm */
  digest: 'sha256' | 'sha384' | 'sha512';
}

/**
 * Audit log entry types
 */
export type AuditAction =
  | 'credential_created'
  | 'credential_read'
  | 'credential_updated'
  | 'credential_deleted'
  | 'credential_rotated'
  | 'credential_accessed'
  | 'credential_deactivated'
  | 'credential_reactivated'
  | 'backup_created'
  | 'backup_restored';

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  /** Unique ID for this log entry */
  id: string;
  /** When the action occurred */
  timestamp: Date;
  /** The action that was performed */
  action: AuditAction;
  /** The credential ID involved (if applicable) */
  credentialId?: string;
  /** The user who performed the action */
  actorUserId: string;
  /** The user whose credential was affected */
  targetUserId: string;
  /** The vendor ID involved */
  vendorId?: VendorId;
  /** IP address of the request (if available) */
  ipAddress?: string;
  /** User agent of the request (if available) */
  userAgent?: string;
  /** Whether the action was successful */
  success: boolean;
  /** Error message if the action failed */
  errorMessage?: string;
  /** Additional context (never contains sensitive data) */
  context?: Record<string, unknown>;
}

/**
 * Storage backend interface
 */
export interface StorageBackend {
  /** Read a credential by ID */
  read(id: string): Promise<StoredCredential | null>;
  /** Write a credential */
  write(credential: StoredCredential): Promise<void>;
  /** Delete a credential */
  delete(id: string): Promise<boolean>;
  /** List credentials matching a query */
  list(query: CredentialQuery): Promise<StoredCredential[]>;
  /** Check if a credential exists */
  exists(id: string): Promise<boolean>;
}

/**
 * Audit logger interface
 */
export interface AuditLogger {
  /** Log an audit entry */
  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void>;
  /** Query audit logs */
  query(options: AuditQueryOptions): Promise<AuditLogEntry[]>;
}

/**
 * Options for querying audit logs
 */
export interface AuditQueryOptions {
  /** Filter by credential ID */
  credentialId?: string;
  /** Filter by actor user ID */
  actorUserId?: string;
  /** Filter by target user ID */
  targetUserId?: string;
  /** Filter by action type */
  action?: AuditAction;
  /** Filter by start date */
  startDate?: Date;
  /** Filter by end date */
  endDate?: Date;
  /** Maximum number of entries to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Backup metadata
 */
export interface BackupMetadata {
  /** Unique backup ID */
  id: string;
  /** When the backup was created */
  createdAt: Date;
  /** User who created the backup */
  createdBy: string;
  /** Number of credentials in the backup */
  credentialCount: number;
  /** Backup format version */
  version: number;
  /** Checksum of the backup data */
  checksum: string;
}

/**
 * Credential storage options
 */
export interface CredentialStorageOptions {
  /** Storage backend to use */
  storage: StorageBackend;
  /** Audit logger to use */
  auditLogger: AuditLogger;
  /** Master encryption key (should be securely provided) */
  masterKey: Buffer;
  /** Encryption configuration */
  encryptionConfig?: Partial<EncryptionConfig>;
}
