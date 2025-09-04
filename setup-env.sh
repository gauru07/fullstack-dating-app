#!/bin/bash

# Create .env.local file with placeholder values
cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stream Chat Configuration
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Optional: Clerk Authentication (if using Clerk instead of Supabase Auth)
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF

echo "✅ Environment file created at .env.local"
echo "⚠️  Please update the placeholder values with your actual API keys:"
echo "   - Supabase URL and keys from https://app.supabase.com/"
echo "   - Stream API keys from https://getstream.io/"
echo ""
echo "🚀 Your app is running on http://localhost:3000"
