export const keysInWebsocketMessage = [
		"user",
		"action",
		"room",
		"type",
	] as const,
	CMD = ["show"] as const,
	CMD_SHOW = ["db", "users", "rooms"] as const
