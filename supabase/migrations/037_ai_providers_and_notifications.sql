-- ============================================================
-- 037_ai_providers_and_notifications.sql
--
-- Expands the allowed AI providers in ai_configs and ai_usage_log
-- to include 'groq' and 'gemini'.
-- ============================================================

ALTER TABLE ai_configs DROP CONSTRAINT IF EXISTS ai_configs_provider_check;
ALTER TABLE ai_configs ADD CONSTRAINT ai_configs_provider_check 
  CHECK (provider IN ('openai', 'anthropic', 'groq', 'gemini'));

ALTER TABLE ai_usage_log DROP CONSTRAINT IF EXISTS ai_usage_log_provider_check;
ALTER TABLE ai_usage_log ADD CONSTRAINT ai_usage_log_provider_check 
  CHECK (provider IN ('openai', 'anthropic', 'groq', 'gemini'));
