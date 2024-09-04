import { Client, Database, HEXClientKey } from "./types"

import { counter } from "./functions"

export var db: Database = { rooms: {}, users: [] },
	clients: Map<HEXClientKey, Client> = new Map(),
	port = 8080,
	userID = counter(),
	roomID = counter()
