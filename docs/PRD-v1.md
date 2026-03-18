# PRD: Melbourne Architectural Houses

**Version:** 1.0
**Author:** Harry Heyworth / Side Projects Agent
**Date:** 2026-03-18
**Status:** Approved — Ready for Agent Build

---

## 1. Product Overview

**Product Name:** Melbourne Architectural Houses (working title: "MelbArch")
**One-Line Description:** A private, single-user database and browsing website of architecturally significant houses in Melbourne, Australia — searchable, filterable, and richly detailed — built to help a discerning buyer identify and directly approach owners of exceptional homes.
**Problem:** No single resource exists that aggregates Melbourne's architecturally significant residential buildings with enough depth (architect, style, year, imagery from architectural sources rather than real estate listings) to be useful for serious research. Existing resources are scattered across magazine archives, architecture books, architect websites, and award databases — all disconnected.
**Target Launch:** MVP as soon as coded — no hard date.
**Location:** Private personal website (single user). No public access.

---

## 2. Target Users

### Persona 1: Harry — The Discerning Buyer-Researcher
- **Behaviour:** Passionate about exceptional architecture. Wants to systematically discover and research architecturally significant houses in Melbourne — not just the iconic ones, but also the lesser-known mid-tier works. Willing to approach owners directly if a house resonates.
- **Pain:** No consolidated resource exists. Finding architecturally notable houses requires individually searching magazine archives, book indexes, architect portfolio sites, award databases, and real estate history — hours of work per house.
- **Current tools:** Google, ArchitectureAU, Dezeen, physical books, real estate sites (which focus on sale price, not design quality).
- **Success:** Can browse a curated database of 200–500+ Melbourne houses filtered by architect, style, era, suburb, award, and see proper architectural photography — all in one place.

---

## 3. Goals & Success Metrics

| Metric | Target (Launch) | Target (Month 3) |
| --- | --- | --- |
| Houses in database (seeded via research) | ≥ 100 | ≥ 300 |
| Filterable attributes per house | ≥ 10 | ≥ 15 |
| Image sources (not from real estate listings) | ≥ 1 per house | ≥ 3 per house |
| Page load time (browse page) | < 2 seconds | < 1.5 seconds |
| Search/filter response time | < 500ms | < 300ms |
| Research pipeline: new houses addable in | < 5 min/house | < 2 min/house |

---

## 4. User Stories

### US-01: Browse all houses with filters
**As a** researcher, **I want to** browse all houses in the database with live filtering **so that** I can narrow down to houses matching specific criteria without having to search manually.

**Acceptance Criteria:**
- [ ] Given I am on the browse page, when the page loads, then I see a grid/list of all houses with thumbnail image, house name/address, architect, year, and suburb.
- [ ] Given I apply a filter (e.g. "Style: Brutalist"), when the filter is applied, then only matching houses are shown — no page reload, live update.
- [ ] Given I apply multiple filters simultaneously (e.g. "Architect: Glenn Murcutt" + "Era: 1970s"), when filters are applied, then results match ALL selected filters (AND logic).
- [ ] Given the database has 0 results for a filter combination, when filters are applied, then an empty state message "No houses match these filters" is shown.
- [ ] Edge case: When I apply a filter and no results exist, the empty state includes a "Clear filters" button.

### US-02: View a single house detail page
**As a** researcher, **I want to** click into a house and see all its details and images **so that** I can fully assess whether it's worth pursuing.

**Acceptance Criteria:**
- [ ] Given I click a house card, when the detail page loads, then I see: full address, architect name(s), year built, architectural style, building materials, suburb, awards/recognition, source references, owner contact info (if known), notes field, and all associated images.
- [ ] Given the house has multiple images, when I view the detail page, then images are shown in a gallery (lightbox on click).
- [ ] Given a field has no data (e.g. owner contact unknown), when I view the detail, then that field shows "Unknown" or is hidden — no broken UI.
- [ ] Edge case: When a house has no images, the detail page shows a placeholder image with source citation prompt.

### US-03: Search by keyword
**As a** researcher, **I want to** search by keyword across all fields **so that** I can find houses by partial architect name, suburb, description text, or award name.

**Acceptance Criteria:**
- [ ] Given I type in the search box, when I type 3+ characters, then results update live (debounced, ≤ 300ms).
- [ ] Given I search "Murcutt", when results appear, then all houses with "Murcutt" in any field (architect, notes, description) are returned.
- [ ] Given I search for a term with no matches, when results appear, then empty state is shown.
- [ ] Edge case: Search is case-insensitive and ignores leading/trailing whitespace.

### US-04: Add a house manually
**As a** researcher, **I want to** add a new house via a form **so that** I can capture houses I discover through research, reading, or driving around.

**Acceptance Criteria:**
- [ ] Given I click "Add House", when the form opens, then I can fill in all fields: address, suburb, architect, year built, style, materials, awards, source references, owner contact (optional), notes (freetext), image URLs.
- [ ] Given I submit with only required fields (address, architect, year), when saved, then the house appears in the browse list.
- [ ] Given I submit without required fields, when I attempt to save, then inline validation errors appear and the form is not submitted.
- [ ] Edge case: Duplicate address detection — if address already exists, show a warning before saving (not a hard block).

### US-05: Edit and update a house record
**As a** researcher, **I want to** edit any house record **so that** I can add new information as I discover it (e.g. finding owner contact details, adding images, correcting architect attribution).

**Acceptance Criteria:**
- [ ] Given I am on a house detail page, when I click "Edit", then all fields become editable in-place or a full edit form opens.
- [ ] Given I save changes, when saved, then the updated record is immediately reflected on the browse and detail pages.
- [ ] Given I cancel an edit, when cancelled, then no changes are saved and original data is restored.

### US-06: Add images to a house
**As a** researcher, **I want to** associate multiple images with a house, each with a source citation **so that** I know where each image came from (magazine article, architect portfolio, book scan) and can verify provenance.

**Acceptance Criteria:**
- [ ] Given I am editing a house, when I add an image, then I must provide either an image URL or upload a file, and a required source citation (e.g. "Architecture Australia, March 1987, p.42").
- [ ] Given I have added 5 images, when I view the detail page, then all 5 show in a gallery with source captions.
- [ ] Given an image URL is broken, when the gallery loads, then a broken-image placeholder is shown (no JS error).
- [ ] Edge case: Image uploads stored locally in `/public/uploads/` — no external storage in v1.

### US-07: Tag a house with awards/recognition
**As a** researcher, **I want to** record architectural awards a house has received **so that** I can filter by award-winning houses.

**Acceptance Criteria:**
- [ ] Given I am editing a house, when I add an award, then I can enter: award name, awarding body, year awarded.
- [ ] Given I filter by award type (e.g. "Robin Boyd Award"), when filter is applied, then only houses with that award appear.
- [ ] Given a house has multiple awards, when viewing the detail, then all awards are listed with year.

### US-08: Filter by suburb / region
**As a** researcher, **I want to** filter houses by suburb or inner/outer region **so that** I can focus on specific areas of Melbourne I'm interested in.

**Acceptance Criteria:**
- [ ] Given I open the suburb filter, when the filter opens, then I see a list of all suburbs present in the database (auto-populated).
- [ ] Given I select "Hawthorn" and "Toorak", when filters are applied, then only houses in those suburbs are shown.
- [ ] Given I type in the suburb filter field, when I type, then the suburb list narrows to matching suburbs (typeahead search).
- [ ] Edge case: Suburb names are normalised to title case on save — "HAWTHORN" and "hawthorn" both map to "Hawthorn".

### US-09: Mark houses of personal interest / notes
**As a** researcher, **I want to** mark houses as "interested", "contacted", or "not for me" and add private notes **so that** I can track my research progress.

**Acceptance Criteria:**
- [ ] Given I am viewing a house, when I click a status button, then the house is tagged with: Interested ⭐ / Contacted 📞 / Passed ✗ / Unreviewed (default).
- [ ] Given I filter by "Interested", when the filter is applied, then only starred houses appear.
- [ ] Given I add a private note to a house, when I save, then the note is stored and visible on the detail page in a "My Notes" section.
- [ ] Edge case: Notes support multiline text and basic markdown (bold, bullet lists).

### US-10: Bulk import from CSV/JSON
**As a** researcher, **I want to** import a batch of houses from a CSV or JSON file **so that** I can add research compiled outside the app (e.g. from a spreadsheet or AI research output) without entering each house manually.

**Acceptance Criteria:**
- [ ] Given I upload a CSV with the correct column headers, when the import runs, then all valid rows are added to the database and a summary shows (N added, M skipped due to duplicate address).
- [ ] Given I upload a CSV with missing required columns, when the import runs, then an error message lists which required columns are missing and nothing is imported.
- [ ] Given a CSV row has a duplicate address, when the import runs, then that row is skipped (not duplicated) and reported in the summary.
- [ ] Edge case: CSV column names are case-insensitive (e.g. "Architect" and "architect" both work).

---

## 5. Functional Requirements

### FR-01: House Data Model

**Core fields for every house record:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | UUID | Yes | Auto-generated |
| `address` | String | Yes | Full street address |
| `suburb` | String | Yes | Normalised to Title Case |
| `state` | String | No | Default "VIC" |
| `postcode` | String | No | 4-digit |
| `lat` | Float | No | For future map view |
| `lng` | Float | No | For future map view |
| `name` | String | No | Common name if known (e.g. "Baker House") |
| `yearBuilt` | Int | Yes | 4-digit year |
| `yearBuiltApprox` | Boolean | No | True if year is approximate |
| `architects` | String[] | Yes | Array — supports multiple architects |
| `architectureFirm` | String | No | Practice name if applicable |
| `style` | String[] | No | Array — e.g. ["Brutalist", "Modernist"] |
| `materials` | String[] | No | e.g. ["Concrete", "Glass", "Timber"] |
| `bedrooms` | Int | No | If known |
| `landSize` | Float | No | Square metres |
| `floorArea` | Float | No | Square metres |
| `description` | Text | No | Freetext description of the house |
| `architecturalNotes` | Text | No | Technical notes on design significance |
| `sourceReferences` | String[] | No | Where the house was documented |
| `ownerContact` | String | No | Sensitive — not displayed publicly |
| `myNotes` | Text | No | Private user notes |
| `status` | Enum | No | UNREVIEWED / INTERESTED / CONTACTED / PASSED |
| `featured` | Boolean | No | Manually flagged as particularly special |
| `createdAt` | DateTime | Auto | |
| `updatedAt` | DateTime | Auto | |

**Related entities:**

- **Image** — id, houseId, url (or local path), sourceType (MAGAZINE / BOOK / ARCHITECT_WEBSITE / STREET_VIEW / OTHER), sourceCitation, caption, sortOrder
- **Award** — id, houseId, awardName, awardingBody, yearAwarded, notes
- **Architect** — id, name, biography (optional), website (optional), nationality (optional), activePeriod (optional)

**Processing:**
- `suburb` normalised on save (trim, title case)
- `architects` field links to Architect records by name (fuzzy match on import, exact on manual entry)
- `style` values drawn from a managed controlled vocabulary (user can add new styles)

**Error handling:**
- Address + yearBuilt uniqueness check before save — warn (not block) on duplicate
- Invalid year (< 1850 or > current year) → validation error

---

### FR-02: Browse & Filter

**Trigger:** User loads browse page or changes any filter.

**Available filters:**
- Architect name (multi-select, typeahead from existing architects)
- Architecture firm (multi-select)
- Style (multi-select, from controlled vocabulary)
- Era (decade selector: pre-1900, 1900s, 1910s, ... 2020s)
- Suburb (multi-select, typeahead)
- Materials (multi-select)
- Award (multi-select, from existing awards)
- Status (user's own: Unreviewed / Interested / Contacted / Passed)
- Featured only (toggle)
- Has images (toggle)
- Year built range (slider: min–max)

**Processing:**
- All filters are AND logic (narrowing)
- Results update live via API call with filter params
- Sort options: Year Built (asc/desc), Suburb (A–Z), Date Added (newest first), Architect (A–Z)

**Output:** Paginated list (grid or list view toggle), 24 per page. Each card shows: thumbnail, address, suburb, architect, year, status badge, featured star.

**Error handling:** No results → empty state with "Clear all filters" button.

---

### FR-03: Full-Text Search

**Trigger:** User types in global search box (debounced 300ms).

**Searches across:** address, suburb, name, architects, firm, style, materials, description, architecturalNotes, sourceReferences, award names.

**Processing:** Case-insensitive substring match. SQLite uses LIKE queries; if PostgreSQL used, use full-text search.

**Output:** Same card format as browse. Highlights matching term in results (optional — nice to have).

---

### FR-04: Image Management

**Trigger:** User adds/edits images on a house record.

**Storage:**
- External URLs: stored as URL string, fetched at display time
- Uploaded files: stored in `public/uploads/[houseId]/[filename]` on server filesystem
- Max upload size: 10MB per image
- Accepted formats: jpg, jpeg, png, webp

**Source types (required on every image):**
- MAGAZINE (e.g. "Architecture Australia, Nov 1992, p.18")
- BOOK (e.g. "Robin Boyd: Carrier of Architecture, p.112")
- ARCHITECT_WEBSITE (URL required)
- DIGITIZED_ARCHIVE (source document name + page)
- OTHER (freetext citation required)

**Error handling:**
- Broken URL at display time → grey placeholder with "Image unavailable" caption
- Oversized upload → "File too large (max 10MB)" error, form not submitted
- Unsupported format → "Only JPG, PNG, WebP accepted"

---

### FR-05: Awards Tracking

**Trigger:** User adds an award to a house record.

**Input:** awardName (string), awardingBody (string), yearAwarded (int, 4-digit), notes (optional text).

**Processing:** Awards stored as related records. Award names are free-form text in v1 (no controlled vocabulary — too varied). Existing award names shown as typeahead suggestions from the database.

**Output:** Awards listed on house detail. Filterable on browse page.

---

### FR-06: CSV/JSON Bulk Import

**Trigger:** User uploads a CSV or JSON file via the import page.

**CSV required columns:** `address`, `suburb`, `year_built`, `architects` (comma-separated within field, quoted)
**CSV optional columns:** `name`, `style`, `materials`, `description`, `architectural_notes`, `source_references`, `award_name`, `award_body`, `award_year`, `featured`

**Processing:**
1. Parse file, validate headers
2. For each row: validate required fields, check for duplicate address
3. All-or-nothing if validation errors found in any required field
4. Duplicate address rows: skip and report in summary (not an error — user may intentionally update)
5. New architect names: create Architect record with name only

**Output:** Import summary: N added, M skipped (duplicates), P errors (with row numbers and reasons).

**Error handling:**
- Missing required column → reject entire import, list missing columns
- Invalid year → row-level error, rest of import proceeds
- File too large (> 5MB) → reject before parsing

---

### FR-07: Architect Profiles

**Each architect record contains:**
- Name (required, unique)
- Alternative names / variations (e.g. "Glenn Marcus Murcutt")
- Biography (freetext, optional)
- Website (URL, optional)
- Nationality
- Active period (e.g. "1960–2010")
- Notable works in database (auto-populated from house links)

**Auto-creation:** When a new architect name is used in a house record and doesn't exist yet, a minimal Architect record is created automatically (name only). User can enrich it later.

---

### FR-08: Research Pipeline (Data Entry Workflow)

The app must make it fast to add a house discovered in a book or magazine. The workflow should be:

1. Open "Quick Add" form (accessible from anywhere via keyboard shortcut `N`)
2. Minimum viable entry: address + suburb + year + architect → Save (< 30 seconds)
3. Return later to enrich with images, awards, description, notes
4. Each house has a "completeness score" (% of optional fields filled) as a visual indicator

**Completeness score calculation:**
- Address, suburb, year, architect: always required (not counted)
- Each optional field filled: +1 point
- Has at least 1 image: +2 bonus points
- Has description: +2 bonus points
- Has architectural notes: +1 bonus point
- Has at least 1 award: +1 bonus point
- Maximum score: 20 points; display as percentage

---

## 6. Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | Browse page load | < 2 seconds |
| Performance | Search/filter response | < 500ms |
| Performance | Image gallery load | Progressive (thumbnails first) |
| Security | Authentication | Single hardcoded password (personal use only) — or IP-restricted, no public access |
| Security | No public routes | All pages behind auth |
| Data | Storage | Local SQLite (dev/personal) or PostgreSQL (if Docker deployed) |
| Data | Backups | Daily export to JSON via `/api/export` endpoint |
| Reliability | Single user | No concurrency requirements |
| Scalability | Database size | Target 500+ houses, 2000+ images — well within SQLite limits |
| Responsive | Device support | Desktop primary (1280px+). Mobile readable but not optimised. |
| Accessibility | Basic | Keyboard navigable, alt text on images |
| Deployment | Method | Docker-first (same as other projects). Single container + SQLite or docker-compose with Postgres. |

---

## 7. Technical Architecture

### Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes (same repo)
- **Database:** SQLite via Prisma (dev/personal), PostgreSQL-compatible schema for Docker deploy
- **ORM:** Prisma
- **Search:** Prisma LIKE queries (SQLite) — no external search service in v1
- **Image storage:** Local filesystem (`/public/uploads/`) — no S3 in v1
- **Auth:** Single-password basic auth via middleware (personal use only)
- **Package manager:** pnpm
- **Deployment:** Docker container via docker-compose

### Environment Variables
```
DATABASE_URL=file:./dev.db          # SQLite local
# or: postgresql://...              # PostgreSQL via Docker
ADMIN_PASSWORD=<set-this>           # Single password for personal auth
APP_URL=http://localhost:3030
```

### Project Structure
```
melb-arch-houses/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx
│   │   ├── houses/
│   │   │   ├── page.tsx              # Browse + filter
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx          # House detail
│   │   │   │   └── edit/page.tsx     # Edit house
│   │   │   └── new/page.tsx          # Add house form
│   │   ├── architects/
│   │   │   ├── page.tsx              # Architect list
│   │   │   └── [id]/page.tsx         # Architect detail + their houses
│   │   ├── import/page.tsx           # Bulk import
│   │   └── api/
│   │       ├── houses/
│   │       │   ├── route.ts          # GET (list+filter), POST (create)
│   │       │   └── [id]/
│   │       │       ├── route.ts      # GET, PATCH, DELETE
│   │       │       └── images/route.ts
│   │       ├── architects/route.ts
│   │       ├── import/route.ts
│   │       └── export/route.ts       # JSON export for backup
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── houses/
│   │   │   ├── HouseCard.tsx
│   │   │   ├── HouseGrid.tsx
│   │   │   ├── HouseForm.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── QuickAddModal.tsx
│   │   └── shared/
│   │       ├── SearchBar.tsx
│   │       └── Navbar.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts                   # Middleware auth helper
│   │   ├── filters.ts                # Filter logic
│   │   └── completeness.ts           # Completeness score calculator
│   └── types/
│       └── index.ts
├── public/
│   └── uploads/                      # Local image storage
├── prisma/seed.ts                    # Seed with 20 example houses
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

### Data Models (Prisma)

```prisma
model House {
  id                  String    @id @default(cuid())
  address             String
  suburb              String
  state               String    @default("VIC")
  postcode            String?
  lat                 Float?
  lng                 Float?
  name                String?
  yearBuilt           Int
  yearBuiltApprox     Boolean   @default(false)
  architectureFirm    String?
  style               String[]  // Array stored as JSON in SQLite
  materials           String[]
  bedrooms            Int?
  landSizeSqm         Float?
  floorAreaSqm        Float?
  description         String?
  architecturalNotes  String?
  sourceReferences    String[]
  ownerContact        String?
  myNotes             String?
  status              HouseStatus @default(UNREVIEWED)
  featured            Boolean   @default(false)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  images              Image[]
  awards              Award[]
  architects          HouseArchitect[]
}

model Architect {
  id            String    @id @default(cuid())
  name          String    @unique
  altNames      String[]
  biography     String?
  website       String?
  nationality   String?
  activePeriod  String?
  createdAt     DateTime  @default(now())
  houses        HouseArchitect[]
}

model HouseArchitect {
  houseId       String
  architectId   String
  house         House     @relation(fields: [houseId], references: [id])
  architect     Architect @relation(fields: [architectId], references: [id])
  @@id([houseId, architectId])
}

model Image {
  id             String      @id @default(cuid())
  houseId        String
  house          House       @relation(fields: [houseId], references: [id])
  url            String?     // External URL
  localPath      String?     // Local upload path
  sourceType     ImageSource
  sourceCitation String
  caption        String?
  sortOrder      Int         @default(0)
  createdAt      DateTime    @default(now())
}

model Award {
  id           String   @id @default(cuid())
  houseId      String
  house        House    @relation(fields: [houseId], references: [id])
  awardName    String
  awardingBody String?
  yearAwarded  Int?
  notes        String?
}

enum HouseStatus {
  UNREVIEWED
  INTERESTED
  CONTACTED
  PASSED
}

enum ImageSource {
  MAGAZINE
  BOOK
  ARCHITECT_WEBSITE
  DIGITIZED_ARCHIVE
  OTHER
}
```

### API Contracts

#### GET /api/houses
**Auth:** Required
**Query params:** `q` (search), `suburb[]`, `architect[]`, `style[]`, `material[]`, `award[]`, `status[]`, `era[]`, `featured` (bool), `hasImages` (bool), `yearMin`, `yearMax`, `sort`, `page`, `limit`
**Response:**
```json
{
  "houses": [HouseCard],
  "total": 123,
  "page": 1,
  "pages": 6
}
```

#### POST /api/houses
**Auth:** Required
**Request:** Full house object (required fields validated)
**Response (201):** Created house with id

#### GET /api/houses/[id]
**Auth:** Required
**Response:** Full house object including images, awards, architects

#### PATCH /api/houses/[id]
**Auth:** Required
**Request:** Partial house fields to update
**Response:** Updated house object

#### DELETE /api/houses/[id]
**Auth:** Required
**Response:** `{ ok: true }`

#### POST /api/import
**Auth:** Required
**Request:** `multipart/form-data` with file + type (csv|json)
**Response:** `{ added: N, skipped: M, errors: [...] }`

#### GET /api/export
**Auth:** Required
**Response:** JSON download of all houses + images + awards + architects

---

## 8. UI/UX Requirements

### Design Direction
- Clean, editorial, architecture-magazine aesthetic
- Lots of white space, elegant typography
- Dark navy / warm white / stone grey palette
- Large image-forward cards (houses are visual)
- Desktop-first (1280px+ primary)

### Design System
- **Colour palette:**
  - Primary: `#1A1A2E` (dark navy)
  - Accent: `#C9A96E` (warm gold — architectural drawings evoke this)
  - Background: `#FAFAF8` (warm white)
  - Surface: `#FFFFFF`
  - Text primary: `#1A1A2E`
  - Text secondary: `#6B7280`
- **Typography:** Inter for UI; Playfair Display or DM Serif Display for house names/headings
- **Component library:** shadcn/ui + Tailwind CSS
- **Border radius:** Minimal — `rounded-sm` or `rounded` (architectural, not bubbly)

### Screen: Login Page
- Minimal centered card, just password field + "Enter" button
- No branding needed — private tool

### Screen: Browse Page (`/houses`)
**Components:**
- Left sidebar (desktop): Filter panel — collapsible filter groups (Architect, Style, Era, Suburb, Awards, Status, Materials)
- Top bar: Search box (full-width, prominent), sort dropdown, view toggle (grid/list), result count
- Main area: House grid (3 columns on 1280px, 2 on 900px)
- Each card: hero image (16:9), house name or address, suburb, architect, year, status badge (⭐/📞/✗), featured gold border

**States:**
- Loading: skeleton cards
- Empty: "No houses match your filters" + Clear filters button
- No data at all: "No houses yet — add your first"

### Screen: House Detail (`/houses/[id]`)
**Components:**
- Full-width hero image at top
- Two-column layout below: left = images gallery, right = all metadata
- Metadata sections: Overview (address, architect, year, style, materials, firm), Architectural Notes (freetext), Awards (list), Sources (references), My Notes (editable inline), Owner Contact (if present)
- Status bar at top right: status buttons (Unreviewed / Interested / Contacted / Passed)
- "Edit" button top right
- Completeness score shown as progress bar

**Image gallery:**
- Thumbnails below hero
- Click → fullscreen lightbox
- Each image shows source caption
- "Add image" button below gallery

### Screen: Quick Add Modal
- Triggered by `N` keyboard shortcut from anywhere
- Modal with minimal fields: Address, Suburb, Year, Architect (typeahead), then "Save & Close" or "Save & Open Full Form"
- Auto-focus on address field when opened

### Screen: Add/Edit House Form (`/houses/new` and `/houses/[id]/edit`)
- Full form, all fields visible in sections: Basic Info, Architects, Style & Materials, Details, Awards, Images, Notes & Contact
- Architects field: tag-style input (add multiple architects)
- Style field: tag-style input from controlled vocabulary + add new
- Images: drag-and-drop upload area + URL input + source citation required

### Screen: Architects List (`/architects`)
- Simple table: Name, Active Period, No. of Houses
- Click → Architect detail page showing their biography + grid of their houses in database

### Screen: Import (`/import`)
- Drag-and-drop CSV/JSON upload
- Column reference table shown on page (what headers are expected)
- After upload: preview first 5 rows, confirm button, then import summary

---

## 9. Out of Scope — v1

- ❌ Map view (lat/lng collected for future use, no map rendered in v1)
- ❌ Automated web scraping / AI research pipeline (research is done manually and entered via form or CSV)
- ❌ Public sharing or multi-user access
- ❌ Email notifications or alerts
- ❌ Sale history / real estate integration
- ❌ PDF generation
- ❌ Mobile app — web only
- ❌ External image hosting (S3, Cloudinary) — local filesystem only in v1
- ❌ Automatic image fetching from URLs at build time — images loaded at display time from their source URLs
- ❌ Map/satellite street view integration
- ❌ Social features (sharing, comments)

### Agent Constraints
- Do NOT implement any real estate or listing API integrations
- Do NOT add Google Maps or mapping libraries
- Do NOT add user registration or multi-user auth
- Do NOT use external storage (S3, Cloudinary, etc.)
- Do NOT implement AI/ML features (no OpenAI calls, no scraping)
- STOP after completing the assigned phase — do not scope-creep

---

## 10. Implementation Plan

### Phase 1: Foundation & Auth (Session 1)
- [ ] Scaffold Next.js 14 project (TypeScript, Tailwind, shadcn/ui, pnpm)
- [ ] Write Prisma schema (all models from Section 7)
- [ ] Run initial migration with SQLite
- [ ] Implement single-password middleware auth
- [ ] Create login page
- [ ] Seed with 10 sample Melbourne houses (real data)
- [ ] Create Dockerfile + docker-compose.yml (app + optional Postgres)
- [ ] Create `.env.example`
- **Deliverable:** App runs locally, login works, database has seed data
- **Verify:** `pnpm dev` starts, login with password works, `/houses` shows seed data

### Phase 2: Browse & Filter (Session 2)
- [ ] Build `GET /api/houses` with all filter params
- [ ] Build Browse page UI — grid, filter sidebar, search bar
- [ ] Implement all filters (live update, no page reload)
- [ ] Implement sort options
- [ ] Implement pagination
- **Deliverable:** Full browse/filter experience with seed data
- **Verify:** Filters work, search works, pagination works, empty state shows

### Phase 3: House Detail & Forms (Session 3)
- [ ] Build `GET /api/houses/[id]` (full record with relations)
- [ ] Build House Detail page — all fields, gallery, awards, status buttons
- [ ] Build Quick Add modal (keyboard shortcut N)
- [ ] Build Add House form (`/houses/new`)
- [ ] Build Edit House form (`/houses/[id]/edit`)
- [ ] Implement completeness score display
- **Deliverable:** Full CRUD for houses
- **Verify:** Add a house → appears in browse. Edit → changes saved. Detail shows all fields.

### Phase 4: Images & Awards (Session 4)
- [ ] Build image upload API (`POST /api/houses/[id]/images`)
- [ ] Build image URL addition with citation
- [ ] Build ImageGallery component with lightbox
- [ ] Build Awards add/edit/delete on house record
- [ ] Implement image source type selection + citation requirement
- **Deliverable:** Houses can have multiple images with source citations and awards
- **Verify:** Upload image → shows in gallery with caption. Add award → shows in detail + filterable.

### Phase 5: Architects & Import (Session 5)
- [ ] Build Architect list and detail pages
- [ ] Build `GET /api/architects` and `GET /api/architects/[id]`
- [ ] Auto-create architect records when new names added to houses
- [ ] Build import page UI
- [ ] Build `POST /api/import` (CSV + JSON support)
- [ ] Build `GET /api/export` (JSON backup)
- **Deliverable:** Architect directory works. CSV/JSON import/export functional.
- **Verify:** Import 20-row CSV → all added. Export JSON → all data present. Architect page shows their houses.

### Phase 6: Polish & Seed Data (Session 6)
- [ ] Full responsive review (1280px, 1024px, 768px)
- [ ] Keyboard shortcuts (N = quick add)
- [ ] Empty states on all pages
- [ ] Error boundaries
- [ ] Expand seed data to 30+ real Melbourne houses with real architect data
- [ ] Final README with setup instructions
- **Deliverable:** Production-ready personal tool with real data
- **Verify:** All pages render at 1280px without issues. Keyboard shortcut works. 30+ seed houses present.

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| SQLite array fields not natively supported | style[], materials[] won't work as arrays in SQLite | Store as JSON strings in SQLite; use actual arrays in Postgres. Prisma handles this differently per provider — use `Json` type for array fields in SQLite mode |
| Image URLs from architectural sources go dead | Images disappear over time | Encourage uploads over URLs. Show broken-image placeholder gracefully. Future v2: cache/mirror images. |
| Finding 100+ Melbourne houses is research-intensive | Database starts nearly empty | Seed with 30 real houses at launch. App is built for ongoing data entry — completeness score motivates enrichment. |
| Single-password auth is weak | If URL found, anyone can access | App is on Tailscale-only network anyway — IP restriction makes password secondary. |
| `pnpm dev` on local with SQLite vs Docker with Postgres schema drift | Migrations may differ | Use `@db.Text` annotations and avoid Postgres-specific features. Test with both datasource configs. |

---

## 12. Open Questions

All questions resolved:
- **Auth:** Single hardcoded password via middleware — sufficient for personal tool on private network
- **Database:** SQLite for simplicity; Prisma schema designed to be compatible with Postgres for Docker deployment
- **Images:** Local filesystem only in v1 — good enough for personal use
- **Research pipeline:** Manual entry only in v1 — AI-assisted research is out of scope and a potential v2 rabbit hole
- **Port:** Use 3030 (check port registry before running)

---

## 13. References

- Architecture Australia magazine (archmedia.com.au)
- Houses Magazine (housesmagazine.com.au)
- Robin Boyd Foundation (robinboyd.org.au)
- Australian Institute of Architects (architecture.com.au/awards)
- National Archives of Australia — digitized architecture documents
- Open House Melbourne (openhousemelbourne.org) — annual list of notable buildings
- "The Australian Dream: Housing Experiences of Older Australians"
- "Robin Boyd: Carrier of Architecture" (Goad & Dunstan)
- "The Weatherboard House" (Garry Kinnane)
- "New Directions in Australian Architecture" (Philip Drew)
- Architect firm websites: Denton Corker Marshall, Elenberg Fraser, Architectus, Wood Marsh, ARM Architecture, Robin Boyd (1919–1971), Harry Seidler, Jørn Utzon (Melbourne commissions), McGlashan & Everist, Daryl Jackson, Edmond & Corrigan, Nonda Katsalidis, Six Degrees Architects, Fender Katsalidis, Peter Elliott Architecture
- SOP-025: Writing a PRD for Agentic Software Builds

---

## Appendix A: Seed House Examples (for Phase 1)

These should be used as seed data — real, verifiable Melbourne houses:

1. **Walsh House** — Robin Boyd, 1958, Ivanhoe — Modernist, steel + glass
2. **Mildura House** — Robin Boyd, 1954, Camberwell
3. **Featherston House** — Robin Boyd, 1968, Ivanhoe
4. **Heide II** — McGlashan & Everist, 1963, Bulleen — Arts centre / private house origin
5. **Attwoods House** — Glenn Murcutt, 1990s (Melbourne commission)
6. **Toorak House** — Jørn Utzon, 1963, Toorak
7. **Corrigan House** — Edmond & Corrigan, 1989, Brunswick
8. **35 Fitzroy Street** — Wood Marsh, 1994, Fitzroy — seminal terrace renovation
9. **Kerferd Road House** — Nonda Katsalidis, 1992, Port Melbourne
10. **St Kilda House** — Six Degrees, 2000s, St Kilda

(Agent should research correct details for each — addresses, exact years, awards received.)

---

## Appendix B: Australian Architecture Awards Reference

Key awards to track in the database:

- **Robin Boyd Award** — AIA National (residential architecture, most prestigious)
- **AIA Victorian Architecture Awards** — Residential Architecture (Houses)
- **AIA Victorian Architecture Awards** — Residential Architecture (Alterations & Additions)
- **Houses Awards** — Houses Magazine annual awards
- **RAIA Gold Medal** — Lifetime achievement (architect-level, not house-level)
- **Dulux Colour Award**
- **ArchiTeam Awards** — Smaller practices
- **World Architecture Festival** — Residential category

---

*PRD Status: Approved. Ready for Phase 1 agent build.*
