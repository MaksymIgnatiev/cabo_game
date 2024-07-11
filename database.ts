import { WebSocket } from "ws"
import { newCounter } from "./functions"
import { Database } from "./types"

export const db: Database = { rooms: {}, users: [] },
	clients: Set<WebSocket> = new Set(),
	port = 8080,
	userID = newCounter(),
	roomID = newCounter()
