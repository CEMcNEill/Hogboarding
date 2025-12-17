# Product Requirements Document: PostHog StackBoard (MVP)

| **Project Name** | PostHog StackBoard (Internal Sales Tool) |
| --- | --- |
| **Owner** | Sales Engineering / TAE Team |
| **Status** | **Ready for Dev** |
| **Target Audience** | PostHog AEs, Solutions Engineers, and Prospects |
| **Core Metric** | Number of "Stack Maps" generated per week. |

---

## 1. Problem Statement

Currently, mapping a prospect's data stack during a sales call is ad-hoc. AEs use generic tools (Miro, Lucidchart) or verbal descriptions, leading to:

1. **Inconsistent Visuals:** No standardized way to show how PostHog fits into their specific architecture.
2. **Lost Context:** The "current state" vs. "future state" (with PostHog) is hard to visualize instantly.
3. **Friction:** Requiring customers to log in to a third-party tool kills the momentum of a demo.

## 2. Solution Overview

A collaborative "Success Map" tool. It starts by mapping the customer's **existing reality** (their current stack) and visualizes the journey to a unified PostHog Platform.

The output is a "Living Document" that evolves from initial discovery (State A: "Messy Stack") to successful adoption (State B: "Unified Platform").

---

## 3. Core Functional Requirements

### 3.1 The "Stack Components" Taxonomy (Sidebar)

The sidebar should represent **Capabilities** rather than just products. This allows AEs to map what the customer *has*, not just what we *sell*.

**Requirement:** The Sidebar is divided into functional layers of a modern data stack.

#### Section A: Ingestion & Sources
* **Client App** (Mobile/Web)
* **Server / Backend**
* **Data Warehouse** (Snowflake, BigQuery)
* **CDP** (Segment, Rudderstack)

#### Section B: Product Engineering
* **Feature Management** (Flags)
* **Session Recording**
* **Experimentation**
* **Error Tracking**
* **Surveys / Feedback**

#### Section C: Analytics & Insights
* **Product Analytics**
* **Marketing / Web Analytics**
* **Business Intelligence** (Tableau, Looker)

---

### 3.2 "Success Map" Node Logic

Nodes represent a **Capability** (e.g., "Feature Flags") and have a **Provider** state.

**Node Data Model:**
1.  **Capability:** (e.g., "Feature Management") - Fixed by node type.
2.  **Provider:** (e.g., "LaunchDarkly", "PostHog", "None").
3.  **Status:**
    *   **Legacy/Competitor** (Gray): The tool they currently use.
    *   **Evaluating** (Blue Dashed): Currently trialing PostHog for this capability.
    *   **PostHog** (Orange): Successfully adopted PostHog.

**Visuals:**
*   **Default Drop:** Neutral Gray card with the Capability Name (e.g., "Feature Management").
*   **Inspector Action:** "Convert to PostHog" -> Turns Orange, icon changes to PostHog official icon.
*   **Legacy Mode:** Shows the Competitor Logo (if available) or text.

---

### 3.3 Multiplayer & Collaboration

* **No Auth Required:** The app generates a unique, obfuscated UUID URL for every session (e.g., `stackboard.posthog.com/s/7x9d-2m4k`).
* **Instant Join:** Clicking the link joins the session immediately.
* **Live Presence:**
* Users see each other’s mouse cursors (labeled "Guest" or "PostHog Team").
* Drag operations are synced in real-time (<100ms latency).
* Text edits are synced in real-time.



### 3.4 The Canvas

* **Infinite Grid:** Pan and zoom capabilities.
* **Connections:** Simple "drag-to-connect" lines to show data flow (e.g., *Source* \rightarrow *Data Warehouse* \rightarrow *Product Analytics*).
* **Annotations:** Ability to add simple sticky notes for free-text context.

### 3.5 Export & Persistence

* **PDF Export:** A "Download Implementation Plan" button. This captures the current viewport or fits-to-content and generates a high-res PDF.
* **Session Persistence:** The board state must persist. If the AE closes the tab and re-opens the URL 2 weeks later, the board should still be there.

---

## 4. User Experience (UX) Flow

1. **The Setup:** AE visits the root URL. A new "Board" is instantly created with a clean grid.
2. **The Invite:** AE copies the URL from the header and drops it into Zoom chat.
3. **The Discovery:**
* AE asks: "What are you using for Feature Flags today?"
* Prospect says: "LaunchDarkly."
* AE drags "Feature Flags" to the board.
* AE inputs "LaunchDarkly" into the "Replacing" field.
* AE connects it to "Product Analytics" to show the correlation value.


4. **The Close:** The board is now a visual map of the "PostHog Platform" replacing 4-5 disparate tools.
5. **The Follow-up:** AE downloads the PDF and attaches it to the post-call email.

---

## 5. Technical Implementation Guidelines

**Recommended Stack:**

* **Frontend:** Next.js (App Router), Tailwind CSS.
* **Canvas Engine:** `React Flow` (Best for node-based diagrams).
* **Realtime/State:** `Liveblocks` + `Zustand`. (Liveblocks provides the WebSocket infra and "Presence" cursors out of the box).
* **Icons:** `@posthog/icons` (Official library).
* **Export:** `html-to-image` or `jspdf`.

**Data Structure (JSON Representation):**

```json
{
  "roomId": "uuid-v4",
  "nodes": [
    {
      "id": "node-1",
      "type": "product-os-node",
      "position": { "x": 100, "y": 200 },
      "data": {
        "productType": "feature-flags",
        "status": "evaluating",
        "replacing": "LaunchDarkly",
        "owner": "Engineering"
      }
    }
  ],
  "connections": [...]
}

```

---

## 6. Success Criteria (MVP)

* **Speed:** A new board loads in <1 second.
* **Simplicity:** A prospect can move a box without instructions.
* **Clarity:** The PDF export looks professional enough to be shared internally at the prospect's company.

## 7. Future Scope (Phase 2 - Not in MVP)

* **Config Gen:** Button to "Generate posthog.init()" code based on the nodes selected.
* **HubSpot Sync:** Automatically attaching the board URL to the Deal property in HubSpot.
* **Templates:** One-click setups for "B2B SaaS Stack" or "Mobile Consumer Stack."