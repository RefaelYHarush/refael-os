#!/usr/bin/env bash
# מפעיל התחברות עם גוגל ב-Supabase דרך Management API
# שימוש: SUPABASE_PAT=xxx GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=xxx ./scripts/enable-google-auth.sh

set -e
PROJECT_REF="ubfebxeqetfxlqkxqwtb"
API="https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth"

if [ -z "$SUPABASE_PAT" ] || [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
  echo "נדרשים: SUPABASE_PAT, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET"
  echo "  SUPABASE_PAT - מ־ https://supabase.com/dashboard/account/tokens"
  echo "  GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET - מ־ Google Cloud Console → Credentials → OAuth 2.0 Client ID"
  exit 1
fi

BODY=$(cat <<EOF
{
  "external_google_enabled": true,
  "external_google_client_id": "$GOOGLE_CLIENT_ID",
  "external_google_secret": "$GOOGLE_CLIENT_SECRET"
}
EOF
)

RESP=$(curl -s -w "\n%{http_code}" -X PATCH "$API" \
  -H "Authorization: Bearer $SUPABASE_PAT" \
  -H "Content-Type: application/json" \
  -d "$BODY")
HTTP_CODE=$(echo "$RESP" | tail -n1)
BODY_ONLY=$(echo "$RESP" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo "ההגדרה עודכנה. התחברות עם גוגל מופעלת."
else
  echo "שגיאה ($HTTP_CODE): $BODY_ONLY"
  exit 1
fi
