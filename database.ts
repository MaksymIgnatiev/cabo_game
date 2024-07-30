import { Client, Database } from "./types"

import { counter } from "./functions"

export const db: Database = { rooms: {}, users: [] },
	clients: Map<string, Client> = new Map(),
	port = 8080,
	userID = counter(),
	roomID = counter()
