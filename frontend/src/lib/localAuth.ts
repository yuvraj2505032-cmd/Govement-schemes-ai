const ACCOUNTS_STORAGE_KEY = 'janshayak_local_accounts';
const SESSION_STORAGE_KEY = 'janshayak_local_session';
const PASSWORD_ITERATIONS = 310_000;

export interface LocalAccount {
  id: string;
  email: string;
}

interface StoredAccount extends LocalAccount {
  salt: string;
  passwordHash: string;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(value: string): Uint8Array {
  if (!/^(?:[0-9a-f]{2})+$/i.test(value)) throw new Error('Stored account credentials are invalid.');
  return Uint8Array.from(value.match(/.{2}/g) ?? [], byte => parseInt(byte, 16));
}

function readAccounts(): StoredAccount[] {
  const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!stored) return [];

  const accounts: unknown = JSON.parse(stored);
  if (
    !Array.isArray(accounts) ||
    !accounts.every(account =>
      account &&
      typeof account.id === 'string' &&
      typeof account.email === 'string' &&
      typeof account.salt === 'string' &&
      typeof account.passwordHash === 'string'
    )
  ) {
    throw new Error('Saved local accounts are invalid. Clear this browser’s Janshayak account data and try again.');
  }
  return accounts;
}

function validateCredentials(email: string, password: string): { email: string; password: string } {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Enter a valid email address.');
  }
  if (password.length < 8 || password.length > 256) {
    throw new Error('Password must be between 8 and 256 characters.');
  }
  return { email: normalizedEmail, password };
}

async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PASSWORD_ITERATIONS, hash: 'SHA-256' },
    key,
    256
  );
  return bytesToHex(new Uint8Array(hash));
}

function createAccountId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return bytesToHex(bytes);
}

export async function createLocalAccount(email: string, password: string): Promise<LocalAccount> {
  const credentials = validateCredentials(email, password);
  const accounts = readAccounts();
  if (accounts.some(account => account.email === credentials.email)) {
    throw new Error('An account with this email already exists on this device. Sign in instead.');
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const account: StoredAccount = {
    id: createAccountId(),
    email: credentials.email,
    salt: bytesToHex(salt),
    passwordHash: await hashPassword(credentials.password, salt)
  };
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([...accounts, account]));
  localStorage.setItem(SESSION_STORAGE_KEY, account.id);
  return { id: account.id, email: account.email };
}

export async function signInLocalAccount(email: string, password: string): Promise<LocalAccount> {
  const credentials = validateCredentials(email, password);
  const account = readAccounts().find(candidate => candidate.email === credentials.email);
  if (!account) throw new Error('No local account was found for this email. Check the email or create an account.');

  const actualHash = await hashPassword(credentials.password, hexToBytes(account.salt));
  const expected = hexToBytes(account.passwordHash);
  const actual = hexToBytes(actualHash);
  const matches = expected.length === actual.length && expected.every((byte, index) => byte === actual[index]);
  if (!matches) throw new Error('Incorrect password. Try again.');

  localStorage.setItem(SESSION_STORAGE_KEY, account.id);
  return { id: account.id, email: account.email };
}

export function restoreLocalAccount(): LocalAccount | null {
  const accountId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!accountId) return null;

  const account = readAccounts().find(candidate => candidate.id === accountId);
  if (!account) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
  return { id: account.id, email: account.email };
}

export function signOutLocalAccount(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
