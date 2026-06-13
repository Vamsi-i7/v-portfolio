import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function test() {
  const { data: pData, error: pErr } = await supabase.from('projects').select('*');
  console.log('Projects public:', pData?.length, 'error:', pErr?.message);

  const { data: eData, error: eErr } = await supabase.from('experience').select('*');
  console.log('Experience public:', eData?.length, 'error:', eErr?.message);
}
test();
