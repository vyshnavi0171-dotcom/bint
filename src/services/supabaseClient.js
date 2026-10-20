import { createClient } from '@supabase/supabase-js';

// Local storage keys for custom config
const SUPABASE_URL_KEY = 'civic_bin_supabase_url';
const SUPABASE_ANON_KEY = 'civic_bin_supabase_anon_key';

export const getSupabaseConfig = () => {
  const customUrl = localStorage.getItem(SUPABASE_URL_KEY);
  const customKey = localStorage.getItem(SUPABASE_ANON_KEY);

  const url = customUrl || import.meta.env.VITE_SUPABASE_URL || '';
  const key = customKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return { url, key, isCustom: !!customUrl };
};

export const setCustomSupabaseConfig = (url, key) => {
  if (url && key) {
    localStorage.setItem(SUPABASE_URL_KEY, url.trim());
    localStorage.setItem(SUPABASE_ANON_KEY, key.trim());
  } else {
    localStorage.removeItem(SUPABASE_URL_KEY);
    localStorage.removeItem(SUPABASE_ANON_KEY);
  }
};

let supabaseInstance = null;

export const getSupabaseClient = () => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    return null;
  }
  
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
};
