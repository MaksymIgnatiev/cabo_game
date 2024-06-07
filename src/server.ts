import { createServer } from "http"
import next from "next"
import { parse } from "url"
import WebSocket from "ws"

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
	const server = createServer((req, res) => {
		const parsedUrl = parse(req.url!, true)
		handle(req, res, parsedUrl)
	})

	const ws = new WebSocket.Server({ server })

	ws.on("connection", ws => {
		console.log("Client connected")

		ws.on("message", message => {
			console.log("Received:", message)
		})

		ws.on("close", () => {
			console.log("Client disconnected")
		})
	})

	server.listen(3000, () => {
		console.log("-> Ready on http://localhost:3000 <-")
	})
})
