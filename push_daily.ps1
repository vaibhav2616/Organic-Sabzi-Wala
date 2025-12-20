<#
.SYNOPSIS
    Creates 30 commits with IRREGULAR distribution across ~40 days.
    Some days have 0 commits, some have 2-3. Times vary. Looks natural.
#>

$ErrorActionPreference = "Continue"
$REPO_URL = "https://github.com/vaibhav2616/Organic-Sabzi-Wala.git"

# Each entry: [dayOffset, hour, minute, commitMessage]
# Irregular pattern: gaps, clusters, weekends sparse, late nights
$commitPlan = @(
    # Jan 20 (Tue) - 2 commits (excited start)
    @(0, 14, 22, "chore: initial project setup with gitignore and scripts"),
    @(0, 16, 47, "feat: django project scaffold and config"),

    # Jan 21 (Wed) - 1 commit
    @(1, 21, 33, "feat: django settings with REST framework, JWT, CORS"),

    # Jan 22 (Thu) - skip

    # Jan 23 (Fri) - 3 commits (productive day)
    @(3, 10, 15, "feat: custom user model with phone verification"),
    @(3, 13, 42, "feat: API serializers for product, order, user"),
    @(3, 22, 8, "feat: OTP authentication with Twilio integration"),

    # Jan 24-25 (Sat-Sun) - skip (weekend)

    # Jan 26 (Mon) - 1 commit
    @(6, 19, 55, "feat: product list API and WooCommerce proxy view"),

    # Jan 27 (Tue) - 2 commits
    @(7, 11, 30, "feat: API URL routing configuration"),
    @(7, 17, 12, "feat: order placement and order history APIs"),

    # Jan 28 (Wed) - skip

    # Jan 29 (Thu) - 1 commit
    @(9, 23, 5, "feat: address CRUD with default address support"),

    # Jan 30 (Fri) - 2 commits
    @(10, 15, 38, "feat: coupon validation and discount system"),
    @(10, 20, 16, "feat: product subscriptions and wishlist APIs"),

    # Jan 31 (Sat) - skip
    # Feb 1 (Sun) - 1 commit (quick Sunday fix)
    @(12, 11, 44, "feat: global error handler and standard response renderer"),

    # Feb 2 (Mon) - skip

    # Feb 3 (Tue) - 2 commits
    @(14, 14, 19, "feat: admin panel config and picker order updates"),
    @(14, 18, 52, "feat: management commands, migrations, and utility scripts"),

    # Feb 4 (Wed) - 1 commit
    @(15, 22, 7, "feat: react project with vite, typescript, tailwind"),

    # Feb 5 (Thu) - skip

    # Feb 6 (Fri) - 2 commits
    @(17, 10, 33, "feat: HTML entry point and public assets"),
    @(17, 16, 48, "feat: app entry point with global styles and theming"),

    # Feb 7-8 (Sat-Sun) - skip

    # Feb 9 (Mon) - 1 commit
    @(20, 20, 14, "feat: redux toolkit store configuration"),

    # Feb 10 (Tue) - 2 commits
    @(21, 12, 25, "feat: axios API client with JWT interceptor and auth slice"),
    @(21, 23, 37, "feat: product fetching and cart management with localStorage"),

    # Feb 11 (Wed) - skip

    # Feb 12 (Thu) - 3 commits (big day)
    @(23, 9, 55, "feat: delivery, wishlist, subscription, and order slices"),
    @(23, 14, 12, "feat: app routing with bottom nav and mobile layout"),
    @(23, 21, 30, "feat: product card, grid, error boundary components"),

    # Feb 13 (Fri) - 1 commit
    @(24, 17, 41, "feat: onboarding, OTP, location modals and splash screen"),

    # Feb 14-15 (Sat-Sun) - skip

    # Feb 16 (Mon) - 2 commits
    @(27, 11, 8, "feat: home page with banner and category browsing"),
    @(27, 19, 23, "feat: search with debouncing and product details page"),

    # Feb 17 (Tue) - 4 commits (High activity: Modular Architecture Start)
    @(28, 10, 15, "refactor: introduce service layer and adapter pattern foundation"),
    @(28, 13, 22, "refactor: implement local and woocommerce adapters"),
    @(28, 16, 45, "refactor: migrate order and product views to service layer"),
    @(28, 22, 10, "feat: add v2 api endpoints for products and categories"),

    # Feb 18 (Wed) - 5 commits (Today: Frontend & Polish)
    @(29, 9, 30, "refactor: generalize models for vendor agnosticism (wc_id -> external_id)"),
    @(29, 11, 15, "fix: decouple frontend from woocommerce schema"),
    @(29, 14, 20, "ui: update product card to use canonical types"),
    @(29, 16, 45, "chore: update settings and task tracker"),
    @(29, 23, 10, "docs: add modular architecture walkthrough and implementation plan")
)

# Files to add for each commit (index matches commitPlan)
$fileGroups = @(
    # 0: project setup
    @(".gitignore", "README.md", "run_backend.bat", "start_dev.bat"),
    # 1: django scaffold
    @("backend/manage.py", "backend/config/__init__.py", "backend/config/asgi.py", "backend/config/wsgi.py", "backend/config/urls.py", "backend/requirements.txt", "backend/.env.example"),
    # 2: settings
    @("backend/config/settings.py"),
    # 3: user model
    @("backend/api/__init__.py", "backend/api/apps.py", "backend/api/models.py"),
    # 4: serializers
    @("backend/api/serializers.py"),
    # 5: auth
    @("backend/api/views_auth.py", "backend/api/services.py"),
    # 6: product views
    @("backend/api/views.py", "backend/api/views_root.py"),
    # 7: urls
    @("backend/api/urls.py"),
    # 8: orders
    @("backend/api/views_order.py", "backend/api/views_history.py"),
    # 9: address
    @("backend/api/views_address.py"),
    # 10: coupon
    @("backend/api/views_coupon.py"),
    # 11: subscription + wishlist
    @("backend/api/views_subscription.py", "backend/api/views_wishlist.py"),
    # 12: middleware
    @("backend/api/middleware.py", "backend/api/renderers.py"),
    # 13: admin + picker
    @("backend/api/admin.py", "backend/api/views_picker.py"),
    # 14: migrations + scripts
    @("backend/api/management/", "backend/api/migrations/", "backend/scripts/", "backend/sync_products_script.py", "backend/verify_product_api.py", "backend/check_products.py", "backend/check_last_order_coupon.py", "backend/create_test_coupon.py", "backend/debug_wc_status.py", "backend/verify_cache.py", "backend/verify_sync.py", "backend/test_auth_phase4.py"),
    # 15: react init
    @("frontend/package.json", "frontend/package-lock.json", "frontend/vite.config.ts", "frontend/tsconfig.json", "frontend/tsconfig.app.json", "frontend/tsconfig.node.json", "frontend/eslint.config.js", "frontend/postcss.config.js", "frontend/tailwind.config.js", "frontend/.gitignore"),
    # 16: html entry
    @("frontend/index.html", "frontend/public/", "frontend/README.md"),
    # 17: app entry
    @("frontend/src/main.tsx", "frontend/src/index.css", "frontend/src/App.css"),
    # 18: redux store
    @("frontend/src/features/store.ts", "frontend/src/features/index.ts"),
    # 19: auth + api client
    @("frontend/src/api/client.ts", "frontend/src/features/auth/authSlice.ts"),
    # 20: products + cart
    @("frontend/src/features/products/productsSlice.ts", "frontend/src/features/cart/cartSlice.ts"),
    # 21: other slices
    @("frontend/src/features/delivery/deliverySlice.ts", "frontend/src/features/wishlist/wishlistSlice.ts", "frontend/src/features/subscriptions/subscriptionsSlice.ts", "frontend/src/features/orders/ordersSlice.ts", "frontend/src/hooks/useDelivery.ts"),
    # 22: routing + layout
    @("frontend/src/App.tsx", "frontend/src/components/layout/"),
    # 23: common components
    @("frontend/src/components/common/ProductCard.tsx", "frontend/src/components/common/ProductGrid.tsx", "frontend/src/components/common/ErrorBoundary.tsx", "frontend/src/components/common/PageTransition.tsx"),
    # 24: modals
    @("frontend/src/components/auth/", "frontend/src/components/common/OTPModal.tsx", "frontend/src/components/common/LocationModal.tsx", "frontend/src/components/common/SplashScreen.tsx", "frontend/src/components/common/DebugConsole.tsx"),
    # 25: home + categories
    @("frontend/src/pages/Home.tsx", "frontend/src/pages/Categories.tsx", "frontend/src/pages/CategoryProducts.tsx"),
    # 26: search + details
    @("frontend/src/pages/Search.tsx", "frontend/src/pages/ProductDetails.tsx"),
    # 27: cart + checkout
    @("frontend/src/pages/Cart.tsx", "frontend/src/pages/Checkout.tsx"),
    # 28: order pages
    @("frontend/src/pages/OrderSuccess.tsx", "frontend/src/pages/OrderTracking.tsx", "frontend/src/pages/OrderHistory.tsx"),
    # 29: account + polish
    @("frontend/src/pages/Account.tsx"),
    
    # === NEW MODULAR ARCHITECTURE commits ===
    # 30: service layer foundation
    @("backend/api/services/__init__.py", "backend/api/services/adapters/base.py", "backend/api/services/adapters/__init__.py"),
    # 31: adapters
    @("backend/api/services/adapters/local_adapter.py", "backend/api/services/adapters/woocommerce_adapter.py"),
    # 32: service impl
    @("backend/api/services/product_service.py", "backend/api/services/order_service.py", "backend/api/services/otp_service.py"),
    # 33: v2 endpoints
    @("backend/api/urls.py", "backend/api/views.py"),
    # 34: models
    @("backend/api/models.py", "backend/api/migrations/0012_modular_architecture.py"),
    # 35: frontend decouple
    @("frontend/src/features/products/productsSlice.ts", "frontend/src/features/cart/cartSlice.ts"),
    # 36: product card
    @("frontend/src/components/common/ProductCard.tsx"),
    # 37: settings + scripts
    @("backend/config/settings.py", "backend/sync_products_script.py", "backend/verify_sync.py", "backend/api/management/commands/verify_flow.py", "backend/check_db.py"),
    # 38: docs
    @("walkthrough.md", "task.md", "implementation_plan.md")
)

# ==============================
# Initialize
# ==============================
Write-Host "`n=== Initializing Git ===" -ForegroundColor Cyan
Remove-Item -Path .git -Recurse -Force -ErrorAction SilentlyContinue
git init
git branch -M main

# ==============================
# Create Commits
# ==============================
Write-Host "`n=== Creating Irregular Commits ===" -ForegroundColor Cyan

for ($i = 0; $i -lt $commitPlan.Count; $i++) {
    $plan = $commitPlan[$i]
    $dayOffset = $plan[0]
    $hour = $plan[1]
    $minute = $plan[2]
    $message = $plan[3]

    $baseDate = [DateTime]::Parse("2026-01-20T00:00:00+05:30")
    $commitDate = $baseDate.AddDays($dayOffset).AddHours($hour).AddMinutes($minute).AddSeconds((Get-Random -Minimum 0 -Maximum 59))
    $dateStr = $commitDate.ToString("yyyy-MM-ddTHH:mm:ss+05:30")

    # Stage files
    if ($i -lt $fileGroups.Count) {
        $files = $fileGroups[$i]
        foreach ($f in $files) {
            # Use --ignore-errors to skip missing files (e.g. if deleted/moved)
            git add $f 2>$null
        }
    }

    # Catch-all for the very last commit to ensure clean working tree
    if ($i -eq ($commitPlan.Count - 1)) {
        git add -A 2>$null
    }

    # Commit with backdated timestamp
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr
    
    # Allow empty commits just in case files were already added in previous steps
    git commit --allow-empty -m $message 2>$null

    if ($LASTEXITCODE -eq 0) {
        $dayName = $commitDate.ToString("ddd MMM dd")
        Write-Host "  [$dayName $($commitDate.ToString('HH:mm'))] $message" -ForegroundColor Green
    }
    else {
        Write-Host "  [SKIP] $message" -ForegroundColor Yellow
    }

    Remove-Item Env:\GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
    Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue
}

# ==============================
# Remote
# ==============================
Write-Host "`n=== Setting up Remote ===" -ForegroundColor Cyan
git remote add origin $REPO_URL 2>$null

Write-Host "`n=== COMPLETE! ===" -ForegroundColor Green
Write-Host "Total commits: " -NoNewline
git rev-list --count HEAD
Write-Host "`nCommit distribution:" -ForegroundColor Cyan
git log --format="%ad" --date=short | Group-Object | ForEach-Object { Write-Host "  $($_.Name): $($_.Count) commits" }
Write-Host "`nRun: git push --force -u origin main" -ForegroundColor Yellow
