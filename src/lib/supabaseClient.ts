import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite environment variables with active project fallbacks
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 'https://pisevsostvpzjcxmhksf.supabase.co';
const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpc2V2c29zdHZwempjeG1oa3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NTU2NjQsImV4cCI6MjEwODIzMTY2NH0.eFAJp3Op_BGUAx-6_76jf6JPPapACIe32oeeimR_4ok';

/**
 * Checks if Supabase credentials have been configured
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

/**
 * Exported Supabase client singleton
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Storage Buckets configured in supabase_schema.sql
 */
export type SupabaseBucket = 
  | 'institution-assets' 
  | 'student-photos' 
  | 'staff-photos' 
  | 'question-assets' 
  | 'document-archives';

/**
 * Helper to upload a data URL (base64) or File to a Supabase storage bucket
 */
export async function uploadBase64ToSupabase(
  bucket: SupabaseBucket,
  filePath: string,
  base64Data: string
): Promise<string | null> {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized. Configure VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in .env');
    return base64Data; // Fallback to local base64
  }

  try {
    // Convert base64 data URL to Blob
    const response = await fetch(base64Data);
    const blob = await response.blob();

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob, {
        upsert: true,
        contentType: blob.type || 'image/jpeg'
      });

    if (error) {
      console.error('[Supabase Storage Error]:', error.message);
      return base64Data;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('[Supabase Upload Exception]:', err);
    return base64Data;
  }
}
