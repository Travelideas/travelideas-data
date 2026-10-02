# KKday Data / Frontend Architecture

Updated: 2026-10-02

## 1. Project goal

This repository is the data and rendering layer for Travelideas KKday consumer-facing pages.

The source may include B2B/internal information, but consumer pages must never expose internal partner/KOL/affiliate wording or internal-only benefits.

The system must keep four layers separate:

1. Source ingestion
2. Canonical JSON data
3. Consumer filtering / editorial selection
4. Final rendering to GitHub Preview and Blogger

No consumer page should directly scrape or render raw source data.

---

## 2. Source of truth

Primary source:
- KKday public / source data site used internally for extraction
- Full source structure includes constants such as:
  - CAMPAIGNS
  - EVENT / EVENT_LIST
  - DEALS
  - DAILY
  - PICKS
  - PACKS
  - FREE_ITEMS
  - coupon-related mappings (ONLY_NAMES, CODE_GEO, PSCOPE, RULES, NO_CHECK, etc.)

Important rule:
- B2B source terms may remain in internal source metadata.
- They must never render to consumer pages.

Consumer-facing wording should use:
- KKday 官方
- KKday 活動
- KKday 商品
- KKday 優惠

Never render:
- KKpartners
- 夥伴
- KOL
- 聯盟
- 佣金
- 分潤
- 夥伴專屬福利
- internal partner instructions

---

## 3. Consumer pages

### Page A — KKday promotion / coupon page

Purpose:
- Main conversion page for current promotions.
- URL on Blogger:
  - https://www.travelideas.tw/p/kkday-promotion-code.html

Primary content order:
1. 本月主打 / 本月檔期
2. 當期重點商品優惠（selected DEALS only）
3. 主力折扣碼
4. 每週 / 每日目的地優惠
5. 機票 / 機加酒 / 包車 / 郵輪
6. 信用卡 / 支付優惠
7. 季節精選（only a few current themes)
8. 長期 / 常態優惠
9. 官方資訊警語
10. FAQ (Blogger fixed SEO content)

This page should NOT become a full product catalog.

Inputs:
- campaigns.json
- deals.json
- coupons.json
- credit-cards.json
- picks.json (editorial signals only; never show internal metrics directly)
- packs.json (only to select a few current seasonal themes; not full catalog)

Renderer:
- embed.js

GitHub Preview:
- kkday/index.html

Blogger:
- fixed SEO HTML + #travelideas-kkday-coupons
- loads the same production embed.js

---

### Page B — KKday popular products / travel themes

Purpose:
- Separate consumer page containing the large product/theme universe.
- This page is intended for a future Blogger page created by Travelideas.
- It should be browseable by destination/theme, not dominated by coupon cards.

Primary content:
1. Current seasonal themes
2. PACKS theme groups
3. Curated products inside each theme
4. Selected PICKS-driven themes
5. Relevant product promotions
6. Optional coupon references only when explicitly applicable

Core theme groups currently available from PACKS:
- KKday 獨家
- 雙十連假國旅
- 東南亞
- 極光
- 韓國冬季
- 避冬紐澳
- 滑雪
- 賞楓
- 白川鄉
- 銀山溫泉
- 破冰船
- JR PASS
- 包車接送
- 機票
- 韓國美妝保養
- K-POP
- 郵輪

Inputs:
- packs.json
- products.json
- picks.json
- deals.json (where relevant)
- coupons.json only for explicitly applicable codes

Planned renderer:
- topics-embed.js

Planned GitHub Preview:
- topics.html

Planned Blogger page:
- URL to be created later by Travelideas.

---

## 4. Explicit exclusions

### Internal-only B2B data
Never render to consumer pages:
- partner-only benefits
- KOL-only instructions
- commissions
- payout
- affiliate onboarding
- internal collaboration rules
- partner-specific operational notes

These may be retained only as source metadata if needed for verification.

### FREE_ITEMS / zero-cost items
Status: excluded from consumer pages for now.

Reason:
Travelideas has its own zero-cost/freebie offering and these items may conflict with it.

Therefore:
- FREE_ITEMS may be parsed and stored internally later.
- Do not render FREE_ITEMS on Page A or Page B unless explicitly enabled in the future.

---

## 5. Canonical JSON design

### campaigns.json
Role:
- monthly campaign schedule / major event windows

Source:
- CAMPAIGNS
- EVENT / EVENT_LIST (campaign-level fields only)

Used by:
- Page A

Should contain:
- campaign id
- title
- start/end
- public description
- landing URL
- priority
- related coupon codes
- related deal ids

Should NOT contain:
- partner operational instructions
- KOL notes
- commission info

---

### deals.json
Role:
- current product-level or campaign-level promotions

Source:
- DEALS
- EVENT / EVENT_LIST bogo / special product offers

Used by:
- Page A
- Page B (when relevant)

Examples:
- percentage discount
- fixed sale price
- buy-one-get-one
- limited-time sale
- gift with purchase
- clearance
- event-specific product deal

Important:
A deal is not the same thing as a coupon.
A deal may or may not require a code.

---

### coupons.json
Role:
- canonical coupon / promo code database

Source:
- code tables
- DAILY
- campaign/event codes
- CODE_GEO / PSCOPE / RULES / NO_CHECK mappings

Used by:
- Page A
- Page B only for explicit applicable product/theme references

Important:
Coupon eligibility must come from explicit source data.
Never infer product applicability.

---

### credit-cards.json
Role:
- credit card and payment offers

Used by:
- Page A

---

### picks.json
Role:
- internal editorial intelligence

Source:
- PICKS / weekly selection analysis

Contains:
- current theme
- recommended products
- trend direction
- rationale
- source metrics

Consumer rule:
- do not directly render internal conversion rate, KOL wording, affiliate strategy, or internal instructions.
- use PICKS only to help decide which consumer themes/products to feature and how to order them.

Used by:
- Page A (selection/order only)
- Page B (selection/order only)

---

### packs.json
Role:
- canonical theme/resource-pack database

Source:
- PACKS

Contains:
- theme id
- public theme name
- public intro
- groups
- product ids
- product titles
- URLs if explicitly available/mapped
- public notes
- relevant explicit coupon codes

Used mainly by:
- Page B

Used selectively by:
- Page A for current seasonal highlights only

---

### products.json
Role:
- normalized product records

Contains:
- product id
- public title
- destination/category
- source-backed URL
- optional image
- optional reference price
- public note

Relationship:
- packs.json points to products
- deals.json may point to products
- coupons.json may point to products only when explicit
- products do not exist merely because a coupon applies to them

---

### freebies.json (future / disabled)
Role:
- FREE_ITEMS normalized storage

Status:
- ingestion allowed
- frontend rendering disabled

Used by:
- nothing until explicitly enabled

---

## 6. File / renderer responsibilities

### embed.js
Production renderer for Page A.

Reads only canonical production JSON.
Must NOT read staging JSON.

Expected inputs:
- campaigns.json
- deals.json
- coupons.json
- credit-cards.json
- picks.json
- packs.json (selected highlights only)

Outputs:
- dynamic consumer content for Blogger + GitHub Preview

---

### kkday/index.html
Production preview for Page A.

Purpose:
- preview exactly the same dynamic renderer used by Blogger
- no separate hand-built layout logic
- useful for validation before/after data changes

It loads:
- embed.js

---

### topics-embed.js (planned)
Production renderer for Page B.

Reads:
- packs.json
- products.json
- picks.json
- deals.json
- coupons.json where explicit

---

### topics.html (planned)
GitHub Preview for Page B.

Loads:
- topics-embed.js

---

### blogger-seo.html
Reference/template only.

Important:
Editing this file does NOT automatically update Blogger.

It is retained as:
- SEO copy template
- Blogger setup reference
- disaster recovery / reinstallation reference

Dynamic content must not depend on manually repasting this file.

---

### embed-loader.js
Legacy/helper loader.

If production Blogger loads embed.js directly, this is not part of the required production chain.

Should eventually be removed or clearly marked legacy if unused.

---

### staging files
Current legacy files:
- campaigns-staging.json
- credit-cards-staging.json
- embed-staging.js
- catalog/*

Rule:
- production renderers must not read these.
- after migration is complete, either archive or delete them.
- never maintain two manual production data pipelines.

---

## 7. Data flow

### Source ingestion

Raw source
→ extract source structures
→ normalize
→ remove / flag B2B-only fields
→ validate dates / URLs / eligibility
→ canonical JSON

### Page A flow

campaigns.json
deals.json
coupons.json
credit-cards.json
picks.json (editorial signal)
packs.json (current theme signal)
→ embed.js
→ kkday/index.html Preview
→ Blogger promotion page

### Page B flow

packs.json
products.json
picks.json (editorial signal)
deals.json
coupons.json (explicit relationship only)
→ topics-embed.js
→ topics.html Preview
→ future Blogger theme/product page

---

## 8. Filtering logic

Every source record should be classified as one of:

- public_direct
  - can render directly after wording cleanup

- public_editorial
  - source is useful, but internal wording/metrics must be transformed into consumer editorial content

- internal_only
  - never render publicly

- disabled
  - stored but intentionally not used (e.g. FREE_ITEMS for now)

Examples:

CAMPAIGNS → public_direct
DEALS → public_direct
DAILY → public_direct
PACKS → public_direct
PICKS → public_editorial
partner benefits → internal_only
commission/payout → internal_only
FREE_ITEMS → disabled

---

## 9. Public wording rule

Never copy internal editorial instructions into the consumer page.

Bad:
- 本月主打優先，常青優惠往後排
- KOL 建議主推
- 轉換率最高
- 夥伴限定
- 本週建議發文

Good:
- 本月熱門優惠
- 秋冬旅遊精選
- 限時商品優惠
- 熱門賞楓行程
- 冬季滑雪與雪景行程

Internal logic controls ordering; it is not itself consumer copy.

---

## 10. Current migration tasks

1. Build deals.json from current source DEALS + EVENT special offers.
2. Build packs.json from all 17 current PACKS groups.
3. Build picks.json from current PICKS while marking fields as internal/editorial.
4. Expand campaigns.json from summary-only records to proper campaign relations.
5. Keep FREE_ITEMS parsed but disabled (optional later).
6. Refactor embed.js to use deals/picks/packs correctly.
7. Build topics-embed.js + topics.html.
8. Verify both preview pages.
9. Remove or archive legacy staging/catalog pipeline after validation.
10. Keep this file updated whenever the architecture changes.

---

## 11. Non-negotiable rules

- One canonical production data layer.
- Preview and Blogger use the same renderer.
- No guessed dates, URLs, product ids, mappings, discounts, or eligibility.
- If source support is incomplete, omit the record.
- B2B terms never leak to To C pages.
- FREE_ITEMS remain disabled until explicitly enabled.
- Page A is promotion-focused.
- Page B is theme/product-catalog-focused.
- Internal editorial logic is never copied verbatim into public copy.
