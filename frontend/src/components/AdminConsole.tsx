import React, { FormEvent, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { ExternalLink, Pencil, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import type { CitizenProfile, ManagedOfficialSite } from '../types/scheme';
import { parseCitizenProfile } from '../lib/citizenCloudSync';
import { supabase } from '../lib/supabase';

interface AdminConsoleProps {
  user: User | null;
  sites: ManagedOfficialSite[];
  onSitesChange: (sites: ManagedOfficialSite[]) => void;
}

interface CitizenRecord {
  userId: string;
  profile: CitizenProfile;
  updatedAt: string;
}

const EMPTY_FORM = { title: '', url: '', description: '', category: 'Government scheme' };

function isOfficialUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      (url.hostname === 'gov.in' ||
        url.hostname.endsWith('.gov.in') ||
        url.hostname === 'nic.in' ||
        url.hostname.endsWith('.nic.in'));
  } catch {
    return false;
  }
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ user, sites, onSitesChange }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessError, setAccessError] = useState('');
  const [profiles, setProfiles] = useState<CitizenRecord[]>([]);
  const [profileError, setProfileError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setIsChecking(true);
    setAccessError('');
    setProfiles([]);
    setIsAdmin(false);

    if (!user || !supabase) {
      setIsChecking(false);
      return;
    }

    supabase
      .from('app_admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setAccessError(`Could not check admin access: ${error.message}`);
          setIsChecking(false);
          return;
        }
        setIsAdmin(Boolean(data));
        setIsChecking(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!isAdmin || !supabase) return;
    let active = true;
    supabase
      .from('citizen_app_data')
      .select('user_id, profile, updated_at')
      .not('profile', 'is', null)
      .order('updated_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setProfileError(`Could not load citizen profiles: ${error.message}`);
          return;
        }
        try {
          setProfiles((data ?? []).flatMap(row => row.profile
            ? [{ userId: row.user_id, profile: parseCitizenProfile(row.profile), updatedAt: row.updated_at }]
            : []));
          setProfileError('');
        } catch (parseError) {
          setProfileError(parseError instanceof Error ? parseError.message : 'A stored citizen profile is invalid.');
        }
      });
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const handleAddSite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    if (!user || !supabase) {
      setFormError('Sign in with an authorized admin account to add a site.');
      return;
    }
    if (!isOfficialUrl(form.url.trim())) {
      setFormError('Use an HTTPS .gov.in or .nic.in official portal URL.');
      return;
    }

    setIsSaving(true);
    const siteData = {
        title: form.title.trim(),
        url: form.url.trim(),
        description: form.description.trim(),
        category: form.category.trim() || 'Government scheme',
      };
    const query = editingSiteId
      ? supabase.from('managed_official_sites').update(siteData).eq('id', editingSiteId)
      : supabase.from('managed_official_sites').insert({ ...siteData, created_by: user.id });
    const { data, error } = await query
      .select('id, title, url, description, category, created_at')
      .single();
    setIsSaving(false);
    if (error) {
      setFormError(`Could not add official portal: ${error.message}`);
      return;
    }
    const updatedSite: ManagedOfficialSite = {
      id: data.id,
      title: data.title,
      url: data.url,
      description: data.description,
      category: data.category,
      createdAt: data.created_at
    };
    onSitesChange(editingSiteId
      ? sites.map(site => site.id === editingSiteId ? updatedSite : site)
      : [updatedSite, ...sites]);
    setForm(EMPTY_FORM);
    setEditingSiteId(null);
  };

  const handleRemoveSite = async (siteId: string) => {
    if (!supabase) {
      setFormError('Supabase is not configured.');
      return;
    }
    setFormError('');
    const { error } = await supabase.from('managed_official_sites').delete().eq('id', siteId);
    if (error) {
      setFormError(`Could not remove official portal: ${error.message}`);
      return;
    }
    onSitesChange(sites.filter(site => site.id !== siteId));
  };

  if (isChecking) {
    return <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Checking administrator access…</p>;
  }

  if (!user) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-950">Admin Console</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in with an authorized Supabase administrator account to manage scheme portals and review saved citizen profiles.</p>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
        <ShieldAlert className="h-6 w-6 text-amber-700" aria-hidden="true" />
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">Admin access is not enabled</h1>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          This account cannot view citizen profiles or edit official portals. An existing project owner must grant access in Supabase; regular users cannot promote themselves.
        </p>
        {accessError && <p role="alert" className="mt-3 text-sm text-red-700">{accessError}</p>}
        <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
          {`insert into public.app_admins (user_id)
select id from auth.users where email = 'ADMIN_EMAIL'
on conflict (user_id) do nothing;`}
        </pre>
        <p className="mt-2 text-xs text-slate-600">Replace ADMIN_EMAIL with the verified administrator account email, then run this once in the Supabase SQL Editor.</p>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Restricted tools</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Admin Console</h1>
        <p className="mt-2 text-sm text-slate-600">Manage official scheme portals and review profiles citizens chose to save.</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-xl font-semibold text-slate-900">Add an official scheme portal</h2>
        <form onSubmit={handleAddSite} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Portal name
            <input required maxLength={120} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Official URL
            <input required type="url" placeholder="https://example.gov.in" value={form.url} onChange={event => setForm({ ...form, url: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Category
            <input maxLength={80} value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Short description
            <textarea maxLength={1000} rows={3} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </label>
          {formError && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{formError}</p>}
          <button disabled={isSaving} type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 justify-self-start rounded-full bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isSaving ? 'Saving…' : editingSiteId ? 'Save changes' : 'Add portal'}
          </button>
          {editingSiteId && (
            <button type="button" onClick={() => { setEditingSiteId(null); setForm(EMPTY_FORM); }} className="min-h-11 justify-self-start rounded-full px-4 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Cancel edit
            </button>
          )}
        </form>

        <div className="mt-7 divide-y divide-slate-100">
          {sites.map(site => (
            <article key={site.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
              <div>
                <p className="font-semibold text-slate-900">{site.title}</p>
                <p className="mt-1 text-xs text-slate-500">{site.category} · {site.description}</p>
                <a href={site.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline">
                  {site.url}<ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSiteId(site.id);
                    setForm({ title: site.title, url: site.url, description: site.description, category: site.category });
                    setFormError('');
                  }}
                  aria-label={`Edit ${site.title}`}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => void handleRemoveSite(site.id)} aria-label={`Remove ${site.title}`} className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-700">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
          {sites.length === 0 && <p className="py-4 text-sm text-slate-500">No admin-added portals yet.</p>}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Saved citizen profiles</h2>
            <p className="mt-1 text-sm text-slate-600">Restricted to explicitly authorized administrators.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{profiles.length} profiles</span>
        </div>
        {profileError && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{profileError}</p>}
        <div className="mt-4 space-y-3">
          {profiles.map(record => (
            <details key={record.userId} className="rounded-2xl border border-slate-200 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                Citizen {record.userId.slice(0, 8)} · Updated {new Date(record.updatedAt).toLocaleDateString()}
              </summary>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                {Object.entries(record.profile).map(([field, value]) => (
                  <div key={field} className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-slate-500">{field.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`)}</dt>
                    <dd className="mt-1 font-medium text-slate-900">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
          {!profileError && profiles.length === 0 && <p className="py-4 text-sm text-slate-500">No signed-in citizen profiles have been saved yet.</p>}
        </div>
      </section>
    </div>
  );
};
