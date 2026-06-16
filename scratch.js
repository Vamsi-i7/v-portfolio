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
  const { data: experiences, error: expError } = await supabase.from('experience').select('*');
  if (expError) console.error("Exp Error:", expError.message);
  else console.log("Experiences:", JSON.stringify(experiences, null, 2));

  const { data: journey, error: journeyError } = await supabase.from('journey_entries').select('*');
  if (journeyError) console.error("Journey Error:", journeyError.message);
  else console.log("Journey Entries:", JSON.stringify(journey, null, 2));

  const { data: achievements, error: achError } = await supabase.from('achievements').select('*');
  if (achError) console.error("Achievements Error:", achError.message);
  else console.log("Achievements:", JSON.stringify(achievements, null, 2));
}

run();

