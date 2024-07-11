import { clients, port } from "./database"
import {
	checkWebsocketMessage,
	colorText,
	parseWebsocketMessage,
	processCMD,
} from "./functions"

import { WebSocketServer } from "ws"
import { JSONString } from "./types"

const wss = new WebSocketServer({ port })

function processRawMessage(messageIn: JSONString) {
	const data = parseWebsocketMessage(messageIn)
	if (!data) return

	const message = checkWebsocketMessage(data, true)
	if (!message) return

	const { room, user, action, cmd } = message
	if (cmd) processCMD(cmd) // debug proposed

	if (action === "add_user_to_room") {
	}
}

wss.on("connection", ws => {
	console.log("New client connected")
	clients.add(ws)
	ws.on("message", processRawMessage)

	ws.on("close", () => {
		console.log("Client disconnected")
		clients.delete(ws)
	})
})

console.log(
	`✔️  WebSocket server started on port: ${colorText(`${port}`, {
		text: [0, 150, 0],
	})}`
)
