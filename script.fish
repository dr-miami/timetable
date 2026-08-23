#!/usr/bin/env fish
 
# The page you actually want opened once the server is up.
set URL "http://192.168.5.192:8080/src/"
 
# Start the dev server in the background.
npm start &
set SERVER_PID $last_pid
 
# Give http-server a moment to boot before hitting it.
sleep 1
 
# Open the URL in the default browser (Linux: xdg-open).
xdg-open $URL
 
# Keep the script attached to the server so Ctrl+C in this
# terminal stops npm start too, instead of leaving it running.
wait $SERVER_PID
