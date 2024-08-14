import { HEXClientKey } from "../../../types"
import { WebSocket } from "ws"

export default class GameWebSocket extends WebSocket {
	key?: HEXClientKey
}
