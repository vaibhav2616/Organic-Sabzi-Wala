# 🚀 Deployment & Mobile App Guide

This guide will help you deploy your repository to the web and turn it into an Android App (.apk).

## Part 1: Backend Deployment (Render)
We will deploy the Django backend first.

1.  **Sign Up**: Go to [Render.com](https://render.com) and sign up with GitHub.
2.  **New Web Service**: Click "New +" -> "Web Service".
3.  **Connect Repo**: Select your `Organic-Sabzi-Wala` repository.
4.  **Configuration**:
    - **Name**: `organic-sabzi-wala-api` (or unique name)
    - **Region**: Singapore or nearest to you.
    - **Branch**: `master` or `backend`
    - **Runtime**: `Python 3`
    - **Build Command**: `pip install -r backend/requirements.txt && python backend/manage.py collectstatic --no-input`
    - **Start Command**: `cd backend && gunicorn config.wsgi --timeout 120`
5.  **Environment Variables** (Advanced -> Add Environment Variable):
    - `PYTHON_VERSION`: `3.11.0`
    - `DJANGO_SECRET_KEY`: (Generate a random string)
    - `WC_CONSUMER_KEY`: (Your WooCommerce Key)
    - `WC_CONSUMER_SECRET`: (Your WooCommerce Secret)
    - `WC_API_URL`: `https://www.organicsabziwala.com/wp-json/wc/v3/`
    - `ALLOWED_HOSTS`: `*` (or your frontend domain later)
6.  **Create Service**: Click "Create Web Service".
7.  **Copy URL**: Once deployed, copy the URL (e.g., `https://organic-sabzi-wala-api.onrender.com`).

## Part 2: Frontend Deployment (Vercel)
Now deploy the React frontend.

1.  **Sign Up**: Go to [Vercel.com](https://vercel.com) and sign up with GitHub.
2.  **Add New Project**: Import `Organic-Sabzi-Wala`.
3.  **Configure**:
    - **Framework Preset**: Vite
    - **Root Directory**: Click "Edit" and select `frontend`.
4.  **Environment Variables**:
    - `VITE_API_URL`: Paste your Render Backend URL from Part 1 (e.g., `https://organic-sabzi-wala-api.onrender.com/api/`).
5.  **Deploy**: Click "Deploy".
6.  **Copy URL**: Once live, test the website on your phone!

## Part 3: Generate Android App (.apk)
Now turn your live website into an App.

1.  **Go to PWABuilder**: Visit [pwabuilder.com](https://www.pwabuilder.com).
2.  **Enter URL**: Paste your **Vercel Frontend URL** and click "Start".
3.  **Review**: It will check your Manifest and Service Worker (we configured these!).
4.  **Package**: Click "Package for Stores".
5.  **Android**: Click "Generate" under Android.
    - **Signing Key**: Select "None" if just for testing, or create one for Play Store.
    - **Download**: You will get a `.zip` file.
6.  **Install**: Extract the zip. Transfer the `.apk` file (usually `universal.apk` or `signed.apk`) to your phone and install it!

🎉 **Congratulations! Your Vegetable Store is now an App!**
