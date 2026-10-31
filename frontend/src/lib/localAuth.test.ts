import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import {
  createLocalAccount,
  restoreLocalAccount,
  signInLocalAccount,
  signOutLocalAccount
} from './localAuth';

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
const originalCrypto = Object.getOwnPropertyDescriptor(globalThis, 'crypto');

function resetBrowserStorage(): void {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: new MemoryStorage() });
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto });
}

afterEach(() => {
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
  else Reflect.deleteProperty(globalThis, 'localStorage');
  if (originalCrypto) Object.defineProperty(globalThis, 'crypto', originalCrypto);
  else Reflect.deleteProperty(globalThis, 'crypto');
});

describe('local device accounts', () => {
  it('creates an account and restores its session without storing the password', async () => {
    resetBrowserStorage();
    const account = await createLocalAccount('Citizen@Example.com', 'correct horse battery');
    assert.equal(account.email, 'citizen@example.com');
    assert.deepEqual(restoreLocalAccount(), account);
    assert.equal(localStorage.getItem('janshayak_local_accounts')?.includes('correct horse battery'), false);
  });

  it('rejects duplicate accounts and incorrect passwords', async () => {
    resetBrowserStorage();
    await createLocalAccount('citizen@example.com', 'correct horse battery');
    await assert.rejects(
      createLocalAccount('CITIZEN@example.com', 'another correct password'),
      /already exists/
    );
    await assert.rejects(signInLocalAccount('citizen@example.com', 'incorrect password'), /Incorrect password/);
  });

  it('requires an existing account to sign in and clears sessions on sign out', async () => {
    resetBrowserStorage();
    await assert.rejects(signInLocalAccount('citizen@example.com', 'correct horse battery'), /No local account/);
    const account = await createLocalAccount('citizen@example.com', 'correct horse battery');
    signOutLocalAccount();
    assert.equal(restoreLocalAccount(), null);
    assert.deepEqual(await signInLocalAccount('citizen@example.com', 'correct horse battery'), account);
  });
});
