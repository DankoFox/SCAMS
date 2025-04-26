# 📚  Smart Campus System

This project is a web-based application for managing classroom and room bookings across various university buildings. Users — including students, lecturers, and staff — can:

- View building and room information
- Check room availability by schedule
- Book available rooms (for authorized users)

Built with:

- **React** + **TypeScript** using **Vite**
- **Supabase** (authentication and database)
- **Bun** or **npm** for package management

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DankoFox/SCAMS.git
cd SCAMS
```

---

### 2. Install Dependencies

You can use either **Bun** or **npm**:

#### Using Bun (recommended for speed):
```bash
bun install
```

#### Using npm:
```bash
npm install
npm install react-bootstrap bootstrap
```

---

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add your **Supabase project credentials**:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> These values are found in your [Supabase Dashboard](https://app.supabase.com) under **Project Settings → API**.

---

### 4. Run the Development Server

#### With Bun:
```bash
bun dev
```

#### With npm:
```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 📁 Project Structure

```
├── public/                   # Static files
└── src/
    ├── assets/              # Static assets (e.g., images)
    ├── components/          # Reusable UI components (e.g., NavBar)
    ├── pages/               # Route components (Home, Login, etc.)
    ├── supabaseClient.ts    # Supabase initialization
    └── App.tsx              # App entry point
```

---

## 🔐 Authentication & Authorization

- Authentication is handled via Supabase.
- Users must complete their profile before accessing the full functionality.
- Role-based access (e.g., staff can book rooms) will be implemented progressively.

