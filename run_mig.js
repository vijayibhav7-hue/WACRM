const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
  'https://rbantecbeispzogwhhxf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYW50ZWNiZWlzcHpvZ3doaHhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc0OTgxOCwiZXhwIjoyMTA2MzI1ODE4fQ.3zbra8xWmuCERm4HY_vHaRTWQdPoCFJbMnrUpkAzujk'
);
async function run() {
  const { error: e1 } = await sb.rpc('exec_sql', { sql: 
    "ALTER TABLE ai_configs DROP CONSTRAINT IF EXISTS ai_configs_provider_check; ALTER TABLE ai_configs ADD CONSTRAINT ai_configs_provider_check CHECK (provider IN ('openai', 'anthropic', 'gemini')); ALTER TABLE ai_usage_log DROP CONSTRAINT IF EXISTS ai_usage_log_provider_check; ALTER TABLE ai_usage_log ADD CONSTRAINT ai_usage_log_provider_check CHECK (provider IN ('openai', 'anthropic', 'gemini'));"
  });
  console.log('rpc error:', e1 ? e1.message : 'none');
}
run();
