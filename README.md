# ⚽ RivalMatch

**RivalMatch** is the ultimate platform (the "Tinder" or "LinkedIn" of local soccer) designed to connect amateur and local soccer teams across different areas quickly, easily, and efficiently. 

Do you have your squad ready and the field booked, but you can't find anyone to play against? RivalMatch solves that problem by allowing captains and coaches to coordinate casual matches, challenges, and local games seamlessly.

---

## 🚀 Key Features (MVP)

* **👤 User & Team Profiles:** Registration for captains and coaches with language preference support (English/Spanish), team logo customization, and membership for up to 3 simultaneous teams.
* **📍 Geographic Search & Location:** Find nearby matches, rivals, and fields by configuring an expanded search radius (up to 100 km).
* **⚔️ Match Challenges ("Match Requests"):** Create game requests specifying the game format (5v5, 7v7, 11v11), date, time, venue, and cost-splitting details.
* **💬 Real-Time Chat:** Internal messaging system between captains powered by *WebSockets* to coordinate last-minute details (jerseys, refereeing, confirmations).
* **⭐ Fair Play System:** Post-match ratings focused on punctuality, fair play, and skill-level accuracy.

---

## 🛠️ Tech Stack

The project is built with a modern and scalable approach:

* **Frontend (User Interface):** 
  * Developed in **React / React Native (TypeScript - .tsx)** using clean, modern components with **Tailwind CSS**.
  * Official iconography via *Google Material Symbols*.
* **Backend & Database:**
  * **Supabase** (BaaS) powered by **PostgreSQL** and **PostGIS** spatial extensions for optimal geographic coordinate management.
  * Native authentication and real-time channels (*Realtime Subscriptions*).

---

## 🗄️ Database Schema

The system features key relational tables optimized for performance and security:
1. `profiles`: User data, roles (*captain/coach*), language, and avatars.
2. `teams`: Team information, skill levels, formats, and spatial location.
3. `team_members`: Relationship and logical restrictions limiting users to a maximum of 3 teams.
4. `match_requests`: Management of published challenges, match statuses (*open, confirmed, completed*), and venue details.
5. `chat_messages`: Persistent real-time messaging associated with each match.

---

## 📋 Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/rivalmatch.git
   cd rivalmatch
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root of the project with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run in development mode:**
   ```bash
   npm run dev
   ```

---

## 🗺️ Roadmap

- [x] UI/UX design and wireframing.
- [x] Relational database configuration and PostGIS support in Supabase.
- [x] Implementation of Authentication, Profiles, and Roles.
- [x] Real-time chat connection via Supabase Realtime.
- [ ] Pilot Beta launch with local soccer leagues.
- [ ] Future expansion to other team sports.

---

## 📄 License
This project is distributed under the MIT license. Feel free to contribute, open *issues*, or propose improvements for the soccer community.