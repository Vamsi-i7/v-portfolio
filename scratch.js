import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {});

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY
);

async function run() {
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) console.error("Bucket Error:", bucketError.message);
  else console.log("Buckets:", buckets.map(b => b.name));

  const { data: certs, error: certError } = await supabase.from('certificates').select('issuer_logo_path, certificate_image_path');
  if (certError) console.error("Cert Error:", certError.message);
  else console.log("Certs stored paths:", certs);
}

run();
