import React, { FormEvent, useState } from 'react';
import { Cloud, Eye, EyeOff, LogIn, LogOut, Monitor, ShieldCheck, UserRound, X } from 'lucide-react';

type AuthResult = { error?: string; notice?: string };

export interface SupabaseAccountProps {
  configured: boolean;
  configurationError: string | null;
  userEmail: string | null;
  localUserEmail: string | null;
  localAuthError: string | null;
  syncStatus: string;
  onSignIn: (email: string, password: string, importLocalData: boolean) => Promise<AuthResult>;
  onSignUp: (email: string, password: string, importLocalData: boolean) => Promise<AuthResult>;
  onLocalSignIn: (email: string, password: string) => Promise<AuthResult>;
  onLocalSignUp: (email: string, password: string, importLocalData: boolean) => Promise<AuthResult>;
  onSignOut: () => Promise<string | null>;
}

export const SupabaseAccount: React.FC<SupabaseAccountProps> = ({
  configured,
  configurationError,
  userEmail,
  localUserEmail,
  localAuthError,
  syncStatus,
  onSignIn,
  onSignUp,
  onLocalSignIn,
  onLocalSignUp,
  onSignOut
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocalAuth, setIsLocalAuth] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cloudConsent, setCloudConsent] = useState(false);
  const [importLocalData, setImportLocalData] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const activeEmail = localUserEmail || userEmail;

  const resetFeedback = () => {
    setError('');
    setFeedback('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();
    setIsBusy(true);

    try {
      const result = isLocalAuth
        ? isSignUp
          ? await onLocalSignUp(email, password, importLocalData)
          : await onLocalSignIn(email, password)
        : isSignUp
          ? await onSignUp(email, password, importLocalData)
          : await onSignIn(email, password, importLocalData);
      if (result.error) {
        setError(result.error);
      } else {
        setFeedback(result.notice || 'Signed in successfully.');
        if (!result.notice) setIsOpen(false);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Account request failed.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleSignOut = async () => {
    resetFeedback();
    setIsBusy(true);
    try {
      const signOutError = await onSignOut();
      if (signOutError) setError(signOutError);
      else setIsOpen(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not sign out.');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          resetFeedback();
          setIsOpen(true);
        }}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:px-3"
        aria-label={activeEmail ? `Account ${activeEmail}` : 'Sign in or create an account'}
      >
        {activeEmail
          ? <UserRound className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          : <ShieldCheck className="h-4 w-4 text-blue-800" aria-hidden="true" />}
        <span className="hidden max-w-36 truncate sm:inline">{activeEmail || 'Account'}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-title"
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/30"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-teal-900 px-6 pb-6 pt-5 text-white">
              <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full border border-white/10" aria-hidden="true" />
              <div className="absolute -right-1 -top-5 h-28 w-28 rounded-full border border-white/10" aria-hidden="true" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                    <ShieldCheck className="h-5 w-5 text-teal-200" aria-hidden="true" />
                  </div>
                  {isLocalAuth && localAuthError && (
                    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                      {localAuthError}
                    </p>
                  )}
                  <h2 id="account-title" className="text-xl font-bold tracking-tight">
                    {activeEmail ? (localUserEmail ? 'Your device account' : 'Your cloud account') : 'Welcome to Janshayak'}
                  </h2>
                  <p className="mt-1 max-w-xs text-sm leading-5 text-blue-100">
                    {activeEmail
                      ? 'Manage your account and saved scheme data.'
                      : 'Sign in to keep your scheme information organized.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close account dialog"
                  className="rounded-full p-2 text-white/75 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {activeEmail ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-800 shadow-sm ring-1 ring-slate-200">
                      {localUserEmail
                        ? <Monitor className="h-5 w-5" aria-hidden="true" />
                        : <Cloud className="h-5 w-5" aria-hidden="true" />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{activeEmail}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {localUserEmail ? 'Device-only account' : 'Cloud sync account'}
                      </p>
                    </div>
                  </div>
                  <p className={`rounded-xl p-3 text-sm leading-5 ${
                    localUserEmail ? 'bg-amber-50 text-amber-950' : 'bg-blue-50 text-blue-950'
                  }`}>
                    {localUserEmail
                      ? 'Your account and saved information stay in this browser on this device. They are not synced or recoverable if browser data is cleared.'
                      : syncStatus}
                  </p>
                  {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleSignOut}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              ) : (
                <>
                  <div role="tablist" aria-label="Choose account type" className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isLocalAuth}
                      onClick={() => {
                        setIsLocalAuth(true);
                        setIsSignUp(false);
                        setImportLocalData(false);
                        resetFeedback();
                      }}
                      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 text-sm font-semibold transition ${
                        isLocalAuth ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Monitor className="h-4 w-4" aria-hidden="true" />
                      On this device
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={!isLocalAuth}
                      disabled={!configured}
                      title={!configured ? 'Cloud accounts are unavailable until Supabase is configured.' : undefined}
                      onClick={() => {
                        setIsLocalAuth(false);
                        setIsSignUp(false);
                        setImportLocalData(false);
                        resetFeedback();
                      }}
                      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${
                        !isLocalAuth ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Cloud className="h-4 w-4" aria-hidden="true" />
                      Cloud sync
                    </button>
                  </div>

                  {!isLocalAuth && !configured ? (
                    <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-5 text-amber-950">
                      {configurationError || 'Cloud accounts are not configured. You can still create an account on this device.'}
                    </p>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {isLocalAuth
                            ? (isSignUp ? 'Create a device account' : 'Sign in on this device')
                            : (isSignUp ? 'Create a cloud account' : 'Sign in to cloud sync')}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {isLocalAuth
                            ? 'Works without a cloud setup. Your account is available only in this browser.'
                            : 'Access your saved schemes and tracker across signed-in devices.'}
                        </p>
                      </div>

                      <label className="block text-sm font-semibold text-slate-700">
                        Email address
                        <input
                          type="email"
                          autoComplete="email"
                          maxLength={254}
                          required
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="you@example.com"
                          className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        />
                      </label>

                      <label className="block text-sm font-semibold text-slate-700">
                        Password
                        <span className="relative mt-1.5 block">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            autoComplete={isSignUp ? 'new-password' : 'current-password'}
                            minLength={8}
                            maxLength={256}
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder={isSignUp ? 'At least 8 characters' : 'Enter your password'}
                            className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 pr-12 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(value => !value)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-slate-500 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                          >
                            {showPassword
                              ? <EyeOff className="h-4 w-4" aria-hidden="true" />
                              : <Eye className="h-4 w-4" aria-hidden="true" />}
                          </button>
                        </span>
                      </label>

                      {isLocalAuth ? (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
                          Your password is stored as a secure hash on this device. Local accounts do not have password recovery or cloud backup.
                        </div>
                      ) : (
                        <>
                          <label className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
                            <input
                              type="checkbox"
                              required
                              checked={cloudConsent}
                              onChange={(event) => setCloudConsent(event.target.checked)}
                              className="mt-1 accent-blue-800"
                            />
                            <span>I agree to store my saved schemes and tracker details, including any application reference number I add, in my Supabase account. I will not add Aadhaar numbers, OTPs, or passwords to notes.</span>
                          </label>
                          <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3 text-xs leading-5 text-slate-700">
                            <input
                              type="checkbox"
                              checked={importLocalData}
                              onChange={(event) => setImportLocalData(event.target.checked)}
                              className="mt-1 accent-blue-800"
                            />
                            <span>If this account has no cloud data yet, also copy saved schemes and tracker items from this device. Leave unchecked on a shared device.</span>
                          </label>
                        </>
                      )}

                      {isLocalAuth && isSignUp && (
                        <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3 text-xs leading-5 text-slate-700">
                          <input
                            type="checkbox"
                            checked={importLocalData}
                            onChange={(event) => setImportLocalData(event.target.checked)}
                            className="mt-1 accent-blue-800"
                          />
                          <span>Copy this device’s current saved schemes, tracker items, and profile into the new account.</span>
                        </label>
                      )}

                      {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
                      {feedback && <p role="status" className="text-sm font-medium text-emerald-700">{feedback}</p>}
                      <button
                        type="submit"
                        disabled={isBusy || (!isLocalAuth && !cloudConsent)}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <LogIn className="h-4 w-4" aria-hidden="true" />
                        {isBusy ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
                      </button>
                      <p className="text-center text-sm text-slate-600">
                        {isSignUp ? 'Already have an account?' : 'New to Janshayak?'}{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setIsSignUp(value => !value);
                            setPassword('');
                            setImportLocalData(false);
                            resetFeedback();
                          }}
                          className="font-semibold text-blue-800 underline decoration-blue-300 underline-offset-2 hover:text-blue-950"
                        >
                          {isSignUp ? 'Sign in' : 'Create account'}
                        </button>
                      </p>
                    </form>
                  )}
                  <p className="text-center text-[11px] leading-4 text-slate-400">
                    Never share Aadhaar numbers, OTPs, or account passwords in profile notes.
                  </p>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
};
