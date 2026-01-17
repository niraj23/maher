# The Colour of Zack

A Next.js application to track product purchases and sales, calculate profits, and analyze performance across different stores.

## Features

- **Product Management**: Add, edit, and delete products with purchase and sale information
- **Store Organization**: Organize products by store (e.g., The Real Real, eBay, etc.)
- **Profit Tracking**: Automatically calculate profit/loss for each product
- **Analytics Dashboard**:
  - Total profit, revenue, and profit margin
  - Profit by time period (this week, this year, all time)
  - Most profitable products
  - Store performance comparison
  - Visual charts and graphs
- **Simple Authentication**: Single-user password protection

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Deployment**: Netlify

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to SQL Editor and run the entire schema from `supabase-schema.sql`

4. Go to Settings > API and copy your:
   - Project URL
   - `anon` public key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_secure_password
```

**Important**: Change the `ADMIN_PASSWORD` from the default!

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Default login password: `admin` (change this in production!)

## Deployment

1. Set up Supabase database (run `supabase-schema.sql`)
2. Push code to GitHub
3. Deploy to Netlify (connect GitHub repo)
4. Add environment variables in Netlify dashboard
5. Done! 🎉

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── login/            # Login page
│   ├── page.tsx          # Main dashboard
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── Analytics.tsx     # Analytics dashboard
│   ├── ProductForm.tsx   # Product form
│   ├── ProductList.tsx   # Product list table
│   └── StoreManager.tsx  # Store management
├── lib/                  # Utility functions
│   ├── auth.ts          # Authentication
│   ├── db.ts            # Database operations
│   └── supabase.ts      # Supabase client
├── types/                # TypeScript types
└── supabase-schema.sql   # Database schema
```

## Usage

1. **Login**: Use your admin password to access the application
2. **Add Stores**: Go to the Stores tab and add stores where you buy products
3. **Add Products**: 
   - Go to Products tab
   - Click "Add Product"
   - Fill in product details (name, store, purchase price, purchase date)
   - Optionally add sale information when you sell the product
4. **View Analytics**: 
   - Go to Analytics tab to see:
     - Overall profit statistics
     - Profit by time period
     - Most profitable products
     - Store performance

## Security Notes

- This is a single-user application with simple password authentication
- For production use, consider:
  - Using a more robust authentication system
  - Enabling Row Level Security (RLS) in Supabase
  - Using environment variables for sensitive data
  - Implementing rate limiting

## License

MIT
