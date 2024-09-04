import { colorText, handleNewConnection } from "./functions"

import { WebSocketServer } from "ws"
import { port } from "./database"

// Creating new WebSocket Server on port: `port`
var wss = new WebSocketServer({ port })

// Adding a listener to the server to handle all messages
wss.on("connection", handleNewConnection)

console.log(
	`✔️  WebSocket server started on port: ${colorText(`${port}`, "#00cc00")}`
)
