# Rule: No Credentials in Code

**Scope:** All files

Zero tolerance. Any API key, token, password, or secret must live in:
- `.env.local` for local development (gitignored)
- EAS Secrets for CI/production builds

**Violations that will cause the pre-push hook to fail:**
- Any string matching `sk-ant-` (Anthropic key)
- Any string matching `Bearer ` followed by a 40+ char token
- Any string matching `password` as a variable name with a non-empty string value
- Any string matching `00D` followed by 15 chars (Salesforce org ID in a string literal)

**The fix:** move to `process.env.EXPO_PUBLIC_*` (public) or SecureStore (private runtime values).
