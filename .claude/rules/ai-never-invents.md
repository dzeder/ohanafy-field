# Rule: AI Never Invents Data

**Scope:** All files in src/ai/

The AI layer may:
- Interpret natural language input
- Summarize or clean text the user provided
- Suggest products from the catalog
- Surface patterns from the user's own history
- Generate structured output from structured input

The AI layer may NEVER:
- Create account names, contact names, or addresses
- Invent product names, SKU codes, or prices not in the product catalog
- Fabricate historical order data
- Generate visit notes that weren't dictated by the rep
- Hallucinate Salesforce record IDs

**Enforcement pattern:**
Every tool handler that touches account/product data must validate against the local WatermelonDB — not against Claude's knowledge. Claude's knowledge of specific company data is not reliable.

**The test:** every tool handler test should include a fixture with an unknown product name — the handler must return `confidence: 'low'` or an empty result, never a fabricated match.
