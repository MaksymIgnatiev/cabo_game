import { clients, db, port } from "./database"
import { checkWebsocketMessage, parseWebsocketMessage } from "./functions"

import { WebSocketServer } from "ws"
import { JSONString } from "./types"

const wss = new WebSocketServer({ port })

wss.on("connection", ws => {
	console.log("New client connected")
	clients.add(ws)
	ws.on("message", (messageIn: JSONString) => {
		const data = parseWebsocketMessage(messageIn)
		if (!data) return
		const message = checkWebsocketMessage(data, true)
		if (!message) return

		const { room, user, action, cmd } = message
		if (cmd == "show_database") console.log(db)

		if (action === "add_user_to_room") {
		}
	})

	ws.on("close", () => {
		console.log("Client disconnected")
		clients.delete(ws)
	})
})

console.log(`WebSocket server started on port ${port}`)
