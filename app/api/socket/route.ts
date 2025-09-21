export async function GET() {
  // This endpoint is used to initialize the Socket.IO server
  // The actual Socket.IO server is initialized in the middleware or server setup
  return new Response("Socket.IO server endpoint", { status: 200 });
}

export async function POST() {
  // Handle Socket.IO server-side events if needed
  return new Response("Socket.IO POST endpoint", { status: 200 });
}
