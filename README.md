# 🥦 Organic Sabzi Wala

A full-stack mobile-first e-commerce application for organic vegetable delivery, built with **React + TypeScript** (frontend) and **Django REST Framework** (backend).

## Features

### 🛒 Customer Facing
- **Product Browsing** — Grid display with categories, search with debouncing
- **Product Details** — Image gallery, pricing, stock status, subscriptions
- **Shopping Cart** — Optimistic UI updates, bill summary, coupon system
- **Checkout Flow** — OTP authentication, saved addresses, COD/wallet payments
- **Order Management** — Order history, real-time tracking, order details
- **Subscriptions** — Daily, alternate day, weekly, monthly delivery schedules
- **Wishlist** — Save products for later
- **Dark Mode** — Full dark mode support across all pages
- **PWA Ready** — Mobile-first responsive design

### 🔧 Backend
- **WooCommerce Integration** — Product proxy with caching and throttling
- **OTP Authentication** — Twilio SMS verification with JWT tokens
- **Order System** — Full order lifecycle with status tracking
- **Address Management** — Multiple addresses with default selection
- **Coupon System** — Percentage/flat discounts with validation
- **Picker API** — Order fulfillment management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Redux Toolkit, Vite |
| Styling | TailwindCSS 4, Lucide Icons, Framer Motion |
| Backend | Django 5, Django REST Framework |
| Auth | JWT (SimpleJWT) + Twilio OTP |
| Database | SQLite (dev) / PostgreSQL (prod) |
| API | WooCommerce REST API v3 |
| Caching | Local Memory Cache (Redis ready) |

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Fill in your API keys
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Copy `backend/.env.example` to `backend/.env` and fill in:
- `DJANGO_SECRET_KEY` — Django secret key
- `WC_CONSUMER_KEY` — WooCommerce consumer key
- `WC_CONSUMER_SECRET` — WooCommerce consumer secret
- `TWILIO_ACCOUNT_SID` — Twilio account SID
- `TWILIO_AUTH_TOKEN` — Twilio auth token
- `TWILIO_SERVICE_SID` — Twilio verify service SID

## Project Structure
```
├── backend/
│   ├── api/              # Django app (models, views, serializers)
│   ├── config/           # Django project settings
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example      # Environment template
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios client
│   │   ├── components/   # Reusable components
│   │   ├── features/     # Redux slices
│   │   ├── pages/        # Route pages
│   │   └── hooks/        # Custom hooks
│   ├── package.json
│   └── vite.config.ts
└── .gitignore
```

## License
Private — All rights reserved.
