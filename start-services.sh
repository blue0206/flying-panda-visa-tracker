echo "Installing backend dependencies...."
(cd ./backend && npm install)

echo "Installing frontend dependencies...."
(cd ./frontend && npm install)

echo "Starting Docker Compose...."
docker-compose up -d

echo "Starting Flying-Panda Visa Tracking server...."
(cd ./backend && npm run start) &

echo "Starting Flying-Panda Visa Tracking UI"
(cd ./frontend && npm run build && npm run preview) &

echo "All services starting. Press Ctrl+C to close services and exit."
wait
