import { WebSocketMessageOut } from "../../../types"

export const error_key_exists: WebSocketMessageOut = {
		type: "error",
		message: "Key already generated",
		code: "KEY_EXISTS",
	},
	error_message_doesnt_have_key: WebSocketMessageOut = {
		type: "error",
		message: "Message doesn't have key",
		code: "MESSAGE_DOESNT_HAVE_KEY",
	},
	error_room_not_found: WebSocketMessageOut = {
		type: "error",
		message: "Room not found",
		code: "ROOM_NOT_FOUND",
	},
	error_user_not_found: WebSocketMessageOut = {
		type: "error",
		message: "User not found",
		code: "USER_NOT_FOUND",
	},
	error_message_doesnt_have_new_name: WebSocketMessageOut = {
		type: "error",
		message: "Message doesn't have new name",
		code: "MESSAGE_DOESNT_HAVE_NEW_NAME",
	}
