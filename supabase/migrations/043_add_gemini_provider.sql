-- Migration: Add 'gemini' to the ai_configs provider check constraint
-- Previously only 'openai' and 'anthropic' were allowed.

-- Drop the old constraint on ai_configs
ALTER TABLE ai_configs
  DROP CONSTRAINT IF EXISTS ai_configs_provider_check;

-- Add the updated constraint that includes 'gemini'
ALTER TABLE ai_configs
  ADD CONSTRAINT ai_configs_provider_check
  CHECK (provider IN ('openai', 'anthropic', 'gemini'));

-- Drop the old constraint on ai_usage_log if it exists
ALTER TABLE ai_usage_log
  DROP CONSTRAINT IF EXISTS ai_usage_log_provider_check;

-- Add updated constraint on ai_usage_log too
ALTER TABLE ai_usage_log
  ADD CONSTRAINT ai_usage_log_provider_check
  CHECK (provider IN ('openai', 'anthropic', 'gemini'));
