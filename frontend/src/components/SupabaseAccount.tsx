import React, { FormEvent, useState } from 'react';
import { Cloud, LogIn, LogOut, UserRound, X } from 'lucide-react';

type AuthResult = { error?: string; notice?: string };

export interface SupabaseAccountProps {
  configured: boolean;
  configurationError: string | null;
  userEmail: string | null;
  syncStatus: string;
  onSignIn: (email: string, password: string, importLocalData: boolean) => Promise<AuthResult>;
  onSignUp: (email: string, password: string, importLocalData: boolean) => Promise<AuthResult>;
  onSignOut: () => Promise<string | null>;
}

export const SupabaseAccount: React.FC<SupabaseAccountProps> = ({
  configured,
  configurationError,
  userEmail,
  syncStatus,
  onSignIn,
  onSignUp,
  onSignOut
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cloudConsent, setCloudConsent] = useState(false);
  const [importLocalData, setImportLocalData] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setFeedback('');
    setIsBusy(true);

    try {
      const result = isSignUp
        ? await onSignUp(email, password, importLocalData)
        : await onSignIn(email, password, importLocalData);
      if (result.error) {
        setError(result.error);
      } else {
        setFeedback(result.notice || 'Signed in successfully.');
        if (!result.notice) setIsOpen(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Account request failed.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleSignOut = async () => {
    setError('');
    setIsBusy(true);
    try {
      const signOutError = await onSignOut();
      if (signOutError) setError(signOutError);
      else setIsOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not sign out.');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError('');
          setFeedback('');
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        aria-label={userEmail ? `Cloud account ${userEmail}` : 'Cloud account sign in'}
      >
        {userEmail ? <UserRound className="h-4 w-4 text-emerald-700" /> : <Cloud className="h-4 w-4 text-blue-700" />}
        <span className="hidden sm:inline max-w-36 truncate">{userEmail || 'Cloud sync'}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cloud-account-title"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="cloud-account-title" className="text-lg font-bold text-slate-900">
                  {userEmail ? 'Cloud sync account' : isSignUp ? 'Create a cloud account' : 'Sign in to cloud sync'}
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  Saved schemes and application tracker sync across your signed-in devices.
                </p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close account dialog">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {!configured ? (
              <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                {configurationError}
              </p>
            ) : userEmail ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-700">{userEmail}</p>
                <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                  {syncStatus}
                </p>
                {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Email
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                  <input
                    type="password"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    minLength={8}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
                <label className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">
                  <input
                    type="checkbox"
                    required
                    checked={cloudConsent}
                    onChange={(event) => setCloudConsent(event.target.checked)}
                    className="mt-0.5"
                  />
                  I agree to store my saved schemes and tracker details, including any application reference number I add, in my Supabase account. I will not add Aadhaar numbers, OTPs, or passwords to notes.
                </label>
                <label className="flex items-start gap-2 rounded-lg border border-slate-200 p-3 text-xs leading-relaxed text-slate-700">
                  <input
                    type="checkbox"
                    checked={importLocalData}
                    onChange={(event) => setImportLocalData(event.target.checked)}
                    className="mt-0.5"
                  />
                  If this account has no cloud data yet, also copy saved schemes and tracker items from this device. Leave unchecked on a shared device.
                </label>
                {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                {feedback && <p role="status" className="text-sm text-emerald-700">{feedback}</p>}
                <button
                  type="submit"
                  disabled={isBusy || !cloudConsent}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <LogIn className="h-4 w-4" />
                  {isBusy ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setFeedback('');
                  }}
                  className="w-full text-sm font-medium text-blue-800 underline"
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
};
