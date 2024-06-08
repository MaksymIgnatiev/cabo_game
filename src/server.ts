import http from "http"
import next from "next"
import { parse } from "url"
import { WebSocketServer } from "ws"

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
	const server = http.createServer((req, res) => {
		const parsedUrl = parse(req.url!, true)
		handle(req, res, parsedUrl)
	})

	// Set up the WebSocket server
	const wss = new WebSocketServer({ server })

	// Handle WebSocket connections and messages
	wss.on("connection", ws => {
		console.log("Client connected")

		ws.on("message", message => {
			// Handle incoming game-related messages
			console.log("Received game message:", message)
		})

		ws.on("close", () => {
			console.log("Client disconnected")
		})
	})

	server.listen(3000, () => {
		console.log("> Ready on http://localhost:3000")
	})
})
