# HogBoarding

**Winning with PostHog**

HogBoard is a collaborative "Customer Success Map" tool designed for PostHog Solution Engineers. It enables teams to visualize a prospect's current data stack and map out their journey to adopting the PostHog Product OS.

![HogBoard Screenshot](https://raw.githubusercontent.com/posthog/hogboard/main/public/screenshot.png) *(Placeholder)*

## Features

### 🗺️ Success Mapping
*   **Visual Stack Builder:** Drag-and-drop capabilities onto an infinite canvas.
*   **Customer-Centric Taxonomy:** Organized by functional layers (Ingestion, Engineering, Analytics) rather than product names.
*   **Neutral-First Design:** Nodes start as "Neutral" (representing the customer's current stack) and can be toggled to "PostHog Powered".

### 🧠 Smart Nodes
*   **Context Aware:** Track the "Owner" and "Current Tool" (Competitor) for every capability.
*   **Adoption Flow:** Visualize the win. Click "Is Competitor" -> "Is PostHog" to turn nodes PostHog Orange.

### ⚡ Real-Time Multiplayer
*   **Collaborative:** Built on Liveblocks for real-time presence and state sync.
*   **Link Sharing:** Share unique room URLs (`/[roomId]`) with customers or colleagues.

## Tech Stack
*   **Framework:** Next.js 14+ (App Router)
*   **Canvas:** React Flow
*   **State / Multiplayer:** Liveblocks + Zustand
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React

## Getting Started

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/yourusername/hogboarding.git
    cd hogboarding
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file and add your Liveblocks key:
    ```env
    NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_test_...
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy to **Vercel** with one click.
Ensure you add the `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` to your Vercel Project Settings.
