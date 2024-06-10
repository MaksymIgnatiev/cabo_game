import { WebSocket, WebSocketServer } from "ws"

import { newCounter } from "./functions"
import { Database } from "./types"

const port = 8080,
	wss = new WebSocketServer({ port }),
	counter = newCounter()

export const db: Database = { rooms: {}, users: [] },
	clients: Set<WebSocket> = new Set()

wss.on("connection", ws => {
	clients.add(ws)
	ws.on("message", message => {
		clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(message)
			}
		})
	})

	ws.on("close", () => clients.delete(ws))
})

console.log(`WebSocket server started on port ${port}`)
