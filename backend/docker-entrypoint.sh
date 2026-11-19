#!/bin/sh
set -e

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "[entrypoint] Applying Prisma migrations..."
  npx prisma migrate deploy || echo "[entrypoint] Warning: Prisma migrate deploy failed or no migrations found, continuing..."
fi

exec "$@"
