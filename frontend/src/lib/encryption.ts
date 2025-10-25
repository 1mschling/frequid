/**
 * ChaCha20-256 Encryption Utilities using Web Crypto API
 * 
 * This module provides strong symmetric encryption for re-encrypting request bodies
 * when external TLS termination is detected. It uses the ChaCha20-Poly1305 algorithm
 * via the Web Crypto API for authenticated encryption.
 * 
 * Key Features:
 * - ChaCha20-256 encryption with Poly1305 authentication
 * - Unique nonce/IV generation for each encryption operation
 * - Entropy enhancement from user liveliness data when available
 * - Secure random number generation using crypto.getRandomValues
 */

// Store recent user activity timestamps for entropy enhancement
let recentActivityTimestamps: number[] = [];
const MAX_ACTIVITY_SAMPLES = 10;

/**
 * Records user activity timing for entropy enhancement
 * Should be called from the liveliness detection system
 */
export function recordActivityEntropy(timestamp: number) {
  recentActivityTimestamps.push(timestamp);
  if (recentActivityTimestamps.length > MAX_ACTIVITY_SAMPLES) {
    recentActivityTimestamps.shift();
  }
}

/**
 * Generates a cryptographically secure nonce/IV for ChaCha20-Poly1305
 * 
 * ChaCha20-Poly1305 requires a 12-byte (96-bit) nonce.
 * This function generates a secure random nonce and optionally enhances
 * it with entropy from user liveliness data (activity timing).
 * 
 * @returns Uint8Array of 12 bytes containing the nonce
 */
export function generateNonce(): Uint8Array {
  const nonce = new Uint8Array(12);
  
  // Generate cryptographically secure random bytes
  crypto.getRandomValues(nonce);
  
  // Enhance with entropy from user activity timing if available
  if (recentActivityTimestamps.length > 0) {
    // XOR the nonce with entropy derived from activity timestamps
    const entropySource = new Uint8Array(12);
    for (let i = 0; i < recentActivityTimestamps.length && i < 12; i++) {
      // Use timing variations as entropy
      const timestamp = recentActivityTimestamps[i];
      entropySource[i] = (timestamp & 0xFF) ^ ((timestamp >> 8) & 0xFF);
    }
    
    // XOR the random nonce with activity-derived entropy
    for (let i = 0; i < 12; i++) {
      nonce[i] ^= entropySource[i % entropySource.length];
    }
  }
  
  return nonce;
}

/**
 * Generates a session-specific encryption key for ChaCha20-256
 * 
 * @returns CryptoKey suitable for ChaCha20-Poly1305 encryption
 */
export async function generateSessionKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: 'ChaCha20-Poly1305',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts data using ChaCha20-Poly1305 with a unique nonce
 * 
 * @param plaintext - The data to encrypt (as string)
 * @param key - The encryption key (CryptoKey)
 * @param nonce - The nonce/IV (12 bytes)
 * @returns Object containing encrypted data and nonce
 */
export async function encryptData(
  plaintext: string,
  key: CryptoKey,
  nonce: Uint8Array
): Promise<{ encrypted: Uint8Array; nonce: Uint8Array }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'ChaCha20-Poly1305',
      iv: nonce as BufferSource,
    },
    key,
    data
  );
  
  return {
    encrypted: new Uint8Array(encrypted),
    nonce,
  };
}

/**
 * Decrypts data using ChaCha20-Poly1305
 * 
 * @param encrypted - The encrypted data
 * @param key - The decryption key (CryptoKey)
 * @param nonce - The nonce/IV used during encryption
 * @returns Decrypted plaintext string
 */
export async function decryptData(
  encrypted: Uint8Array,
  key: CryptoKey,
  nonce: Uint8Array
): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'ChaCha20-Poly1305',
      iv: nonce as BufferSource,
    },
    key,
    encrypted as BufferSource
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Exports a CryptoKey to raw bytes for storage/transmission
 * 
 * @param key - The CryptoKey to export
 * @returns Uint8Array containing the raw key bytes
 */
export async function exportKey(key: CryptoKey): Promise<Uint8Array> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return new Uint8Array(exported);
}

/**
 * Imports a raw key into a CryptoKey object
 * 
 * @param keyData - The raw key bytes
 * @returns CryptoKey suitable for ChaCha20-Poly1305 operations
 */
export async function importKey(keyData: Uint8Array): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    'raw',
    keyData as BufferSource,
    {
      name: 'ChaCha20-Poly1305',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Converts a Uint8Array to a base64 string for storage/transmission
 */
export function arrayToBase64(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array));
}

/**
 * Converts a base64 string back to a Uint8Array
 */
export function base64ToArray(base64: string): Uint8Array {
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return array;
}

