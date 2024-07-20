import { WebSocket, WebSocketServer } from "ws"
import {
	checkWebsocketMessage,
	colorText,
	parseWebsocketMessage,
	processCMD,
} from "./functions"
import { clients, port } from "./database"

import { JSONString } from "./types"

const wss = new WebSocketServer({ port })

function processRawMessage(messageIn: JSONString) {
	const data = parseWebsocketMessage(messageIn, "server")
	if (!data) return

	const message = checkWebsocketMessage(data, true)
	if (!message) return

	const { room, user, action, cmd, actionType } = message

	if (cmd) processCMD(cmd) // debug proposed

	if (actionType === "config") {
		if (action === "rename_user") {
		}
		if (action === "add_user_to_room") {
		}
		if (action === "remove_user_from_room") {
		}
	}

	if (actionType === "game") {
		if (action === "pass") {
		}
		if (action === "take_card") {
		}
		if (action === "cabo") {
		}
		if (action === "change_cards") {
		}
		if (action === "use_card") {
		}
	}
}

function handleNewConnection(ws: WebSocket) {
	console.log("New client connected")

	clients.add(ws)

	ws.on("message", processRawMessage)

	ws.on("close", () => {
		console.log("Client disconnected")
		clients.delete(ws)
	})
}

wss.on("connection", handleNewConnection)

console.log(
	`✔️  WebSocket server started on port: ${colorText(`${port}`, {
		text: [0, 150, 0],
	})}`
)
