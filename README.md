# FreshMart - Online Supermarket

A full-featured online supermarket store built with **Next.js 15**, **Tailwind CSS**, and **Supabase**.

## Features

- **Product Catalog** - Browse products by category with search and filtering
- **User Authentication** - Sign up, login, and profile management via Supabase Auth
- **Shopping Cart** - Add/remove items, adjust quantities (persists in localStorage for guests, Supabase for authenticated users)
- **Checkout Flow** - Complete checkout with delivery address and order notes
- **Order Management** - View order history and track order status
- **Admin Dashboard** - Manage products (CRUD), view/update orders, dashboard stats
- **Responsive Design** - Mobile-first design that works on all devices
- **Row Level Security** - Secure data access with Supabase RLS policies

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

### 1. Clone & Install

```bash
git clone https://github.com/balabesimple1/testclaude.git
cd testclaude
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the schema file: `supabase/schema.sql`
3. (Optional) Run the seed file for sample data: `supabase/seed.sql`

### 3. Configure Environment Variables

Copy the example env file and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase project URL and anon key (found in Settings > API):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the store.

## Database Schema

The database includes:

| Table | Description |
|-------|-------------|
| `categories` | Product categories (Fruits, Dairy, etc.) |
| `products` | Products with pricing, stock, and category |
| `profiles` | User profiles (extends Supabase auth) |
| `cart_items` | Shopping cart items per user |
| `orders` | Customer orders with shipping info |
| `order_items` | Individual items within each order |

### Making a User an Admin

To grant admin access, update the user's profile in Supabase:

```sql
UPDATE profiles SET is_admin = true WHERE id = 'user-uuid-here';
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Login & signup pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── orders/            # Order history page
│   ├── products/          # Product listing & detail pages
│   └── profile/           # User profile page
├── components/            # Reusable UI components
├── context/               # React Context providers (Auth, Cart)
├── lib/                   # Supabase client utilities
└── types/                 # TypeScript type definitions
supabase/
├── schema.sql             # Database schema with RLS policies
└── seed.sql               # Sample data for development
```

## License

MIT
