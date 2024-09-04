import "dotenv/config"

import { clients, db } from "./database"
import {
	CMD_SHOW,
	cardRoles,
	cardWords,
	keysInWebsocketMessage,
} from "./src/app/data/tests"
import {
	error_key_exists,
	error_message_doesnt_have_key,
	error_message_doesnt_have_new_name,
	error_room_not_found,
	error_user_not_found,
} from "./src/app/data/websocketMessages"
import {
	AnyUser,
	Blue,
	Card,
	CardPoint,
	ColorTextOptionParams,
	FullCMD,
	GameAction,
	GameUser,
	GameWebSocket,
	GetRoomsFunctionParams,
	GetRoomsFunctionParamsWord,
	GetRoomsReturnType,
	Green,
	HEXString,
	HSLString,
	Hue,
	IsRoleCard,
	JSONString,
	JSONValue,
	Lightness,
	PartialNonEmpty,
	RGBString,
	Red,
	Room,
	Saturation,
	SimpleAction,
	User,
	UserSettings,
	WebSocketMessageClient,
	WebSocketMessageServer,
} from "./types"

import { HEX_CHARS } from "./src/app/data/plain"

export function getDatabase() {
	return db
}

export function stringifyData<
	T extends JSONValue[] | Record<string, JSONValue>
>(data: T) {
	return JSON.stringify(data, null, "\t")
}

export function random<Min extends number, Max extends number>(
	min = 0 as Min,
	max = (10 ** 9) as Max
) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function loadToGlobalView<N extends string>(key: N, value: any) {
	Object.defineProperty(globalThis, key, {
		value,
		writable: false,
		configurable: false,
	})
}

export function setValueInLocalStorage<K extends string, V extends string>(
	key: K,
	value: V
) {
	localStorage.setItem(key, value)
}

export function getValueFromLocalStorage<K extends string>(key: K) {
	return localStorage.getItem(key)
}

export function validHexString(str: string): str is HEXString {
	return (
		str[0] === "#" &&
		(str.length === 4 || str.length === 7) &&
		!Number.isNaN(parseInt(str.slice(1), 16))
	)
}

export function HexToHsl<S extends HEXString>(hex: S): HSLString
export function HexToHsl<S extends HEXString, V extends boolean = false>(
	hex: S,
	values: true
): [Hue, Saturation, Lightness]
export function HexToHsl<S extends HEXString, V extends boolean = false>(
	hex: S,
	values: false
): HSLString

export function HexToHsl<S extends HEXString, V extends boolean>(
	hex: S,
	values = false as V
): V extends true ? [Hue, Saturation, Lightness] : HSLString {
	var p = hex.length === 4 ? 1 : 2,
		rs = hex.slice(1, 1 + p),
		gs = hex.slice(1 + p, 1 + p * 2),
		bs = hex.slice(1 + p * 2, 1 + p * 3)

	if (p === 1) [rs, gs, bs] = [rs + rs, gs + gs, bs + bs]

	var r = parseInt(rs, 16) / 255,
		g = parseInt(gs, 16) / 255,
		b = parseInt(bs, 16) / 255,
		max = Math.max(r, g, b),
		min = Math.min(r, g, b),
		h = 0,
		s = 0,
		l = (max + min) / 2

	if (max !== min) {
		s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)
		switch (max) {
			case r:
				h = (g - b) / (max - min) + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / (max - min) + 2
				break
			case b:
				h = (r - g) / (max - min) + 4
				break
		}
		h /= 6
	}

	;[h, s, l] = [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]

	return (values ? [h, s, l] : `hsl(${h}, ${s}%, ${l}%)`) as V extends true
		? [Hue, Saturation, Lightness]
		: HSLString
}

export function HEXtoRGB<S extends HEXString>(hex: S): RGBString
export function HEXtoRGB<S extends HEXString, V extends boolean = false>(
	hex: S,
	values: false
): RGBString
export function HEXtoRGB<S extends HEXString, V extends boolean = false>(
	hex: S,
	values: true
): [Red, Green, Blue]
export function HEXtoRGB<S extends HEXString, V extends boolean = false>(
	hex: S,
	values = false as V
): V extends true ? [Red, Green, Blue] : RGBString {
	var p = hex.length === 4 ? 1 : 2,
		rs = hex.slice(1, 1 + p),
		gs = hex.slice(1 + p, 1 + p * 2),
		bs = hex.slice(1 + p * 2, 1 + p * 3)

	if (p === 1) [rs, gs, bs] = [rs + rs, gs + gs, bs + bs]

	var r = parseInt(rs, 16) / 255,
		g = parseInt(gs, 16) / 255,
		b = parseInt(bs, 16) / 255

	return (values ? [r, g, b] : `rgb(${r}, ${g}, ${b})`) as V extends true
		? [Red, Green, Blue]
		: RGBString
}

/** Shuffles the given array in-place. Returning the link to the given array
 * @param array Array to be shuffled */
export function shuffleArray<A extends any[]>(array: A) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

/**
 * Range generator for generating ranges. Accepts up to 3 parameters.
 * @param start start of a range (default = 0)
 * @param end end of a range (default = 0)
 * @param step step betweeen values (default = 1)
 *
 */
export function range<E extends number>(end: E): number[]
export function range<S extends number, E extends number>(
	start: S,
	end: E
): number[]
export function range<S extends number, E extends number, R extends number>(
	start: S,
	end: E,
	step: R
): number[]
export function range<S extends number, E extends number, R extends number>(
	start = 0 as S,
	end = 0 as E,
	step = 1 as R
) {
	if (start > 0 && end == 0) {
		end = start as number as E
		start = 0 as S
	}
	return Array.from(
		{ length: Math.max(Math.ceil((end - start) / step), 0) },
		(_, i) => start + i * step
	)
}

/**
 * Makes text and backbgound colorful using `ANSI` escape characters
 * @param str Text to be colored
 * @param options param that reepresents HEX color of text foreground /
 * tuple with 3 colors that represents RGB chanels /
 * object with fields `text` and/or `background`, each of which represents a tuple with 3 values for rgb chanels for foreground/background
 * @returns `ANSI` string with mixed color around text, or the original string if somwthing goes wrong
 */
export function colorText<Hex extends HEXString>(str: string, hex: Hex): string
export function colorText<RGB extends [Red, Green, Blue]>(
	str: string,
	rgb: RGB
): string
export function colorText<O extends ColorTextOptionParams>(
	str: string,
	options: O
): string
export function colorText<
	O extends [Red, Green, Blue] | HEXString | ColorTextOptionParams
>(str: string, options: O) {
	var [tr, tg, tb, br, bg, bb] = [
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
		] as (number | undefined)[],
		checker = (e: number) => (e > 255 ? 255 : e < 0 ? 0 : e)
	if (typeof options === "string") {
		if (validHexString(options)) {
			var colors = HEXtoRGB(options, true)
			if (colors.every(e => !Number.isNaN(e))) [tr, tg, tb] = colors
		}
	} else if (Array.isArray(options)) {
		;[tr, tg, tb] = options.map(checker) as [Red, Green, Blue]
	} else if (typeof options === "object") {
		if ("text" in options)
			if (typeof options.text !== "string")
				[tr, tg, tb] = options.text.map(checker) as [Red, Green, Blue]
			else if (validHexString(options.text))
				[tr, tg, tb] = HEXtoRGB(options.text, true)

		if ("background" in options)
			if (typeof options.background !== "string") {
				;[br, bg, bb] = options.background.map(checker) as [
					Red,
					Green,
					Blue
				]
			} else if (validHexString(options.background))
				[br, bg, bb] = HEXtoRGB(options.background, true)
	}

	return tr !== undefined || br !== undefined
		? `\u001b[${tr !== undefined ? `38;2;${tr || ""};${tg};${tb}` : ""}${
				br !== undefined
					? `${tr !== undefined ? ";" : ""}48;2;${br};${bg};${bb}`
					: ""
		  }m${str}\u001b[0m`
		: str
}

export function getRoomsCount() {
	return Object.keys(db.rooms).length
}

export function getUsersCount() {
	return db.users.length
}

export function getWebSocketClientsCount() {
	return clients.size
}

export function generateHexID(length = 16) {
	return Array.from({ length })
		.map(() => HEX_CHARS[random(0, HEX_CHARS.length - 1)])
		.join("")
}

export function getClientByHexID(id: string) {
	return [...clients.entries()].find(([key]) => key === id)?.[1]
}

export function getWebSocketByHexID(id: string) {
	return getClientByHexID(id)?.ws
}

export function updateObject(
	original: Record<string, any>,
	update: Record<string, any>
) {
	for (var key in update)
		if (update.hasOwnProperty(key)) original[key] = update[key]
}

function processThenableObject(thenable: { then: (...args: any[]) => any }) {
	return function handleResult(callback: (...args: any[]) => any): any {
		return processInput(
			thenable.then((result: any) =>
				result?.name === "handleResult"
					? result(callback)
					: callback(result)
			)
		)
	}
}

function processFunction(input: unknown) {
	return function handleResult(callback: Function) {
		return processInput(callback(input))
	}
}

function processInput(input: any) {
	return input?.name === "handleResult"
		? input
		: input?.then && typeof input.then === "function"
		? processThenableObject(input)
		: processFunction(input)
}

/*
	Global
------------------------------------------------------------
	Room
*/

export function addRoom(room: Room) {
	db.rooms[room.id] = room
	return room
}

export function checkRoom<ID extends number>(id: ID) {
	return getRooms({ rooms: true }).some(room => room.id === id)
}

export function getRoom<ID extends number>(id: ID) {
	return getRooms({ rooms: true }).find(room => room.id === id)
}

export function getRooms(): [string, Room][]
export function getRooms<W extends "entries" | "ids" | "rooms">(
	option?: W
): GetRoomsFunctionParamsWord[W]

export function getRooms<
	E extends boolean = false,
	R extends boolean = false,
	I extends boolean = false
>(
	options?: PartialNonEmpty<GetRoomsFunctionParams<E, R, I>>
): GetRoomsReturnType<E, R, I>

export function getRooms<
	E extends boolean = false,
	R extends boolean = false,
	I extends boolean = false,
	W extends "entries" | "ids" | "rooms" = "entries"
>(
	options?: PartialNonEmpty<GetRoomsFunctionParams<E, R, I>> | W
): GetRoomsReturnType<E, R, I> {
	var allOptions = Object.assign(
			{
				entries: false,
				ids: false,
				rooms: false,
			},
			typeof options === "object"
				? options
				: { [options ?? "entries"]: true }
		),
		rooms = db.rooms

	return (
		allOptions.entries
			? Object.entries(rooms)
			: allOptions.ids
			? Object.keys(rooms)
			: allOptions.rooms
			? Object.values(rooms)
			: rooms
	) as GetRoomsReturnType<E, R, I>
}

export function createRoom<I extends number>(id: I): Room {
	return {
		id,
		users: [],
		turn: 1,
		last_lap: false,
		waiting: true,
	}
}

export function deleteRoom<I extends number>(id: I) {
	return id > 0 ? delete db.rooms[id] : null
}

/*
	Room
------------------------------------------------------------
	User
*/
export function getUsers(): AnyUser[]
export function getUsers<I extends number>(roomId?: I): AnyUser[] | undefined
export function getUsers<I extends number>(roomId?: I) {
	return roomId ? db.rooms[roomId]?.users : db.users
}

export function getGameUsers(): GameUser[]
export function getGameUsers<I extends number>(roomId?: I): GameUser[]
export function getGameUsers<I extends number>(roomId?: I) {
	return (roomId ? db.rooms[roomId]?.users : db.users).filter(
		user => user.type === "game_user"
	)
}

export function createUser<
	N extends string,
	I extends number,
	A extends boolean
>(name: N, id: I, options: { roomId?: number; is_admin?: A } = {}): User {
	return {
		type: "user",
		name,
		id,
		roomId: options.roomId ?? -1,
		is_admin: options.is_admin ?? false,
		lang: "en",
		last_seen: Date.now(),
	}
}

export function createGameUser(user: User): GameUser {
	return Object.assign(user, {
		type: "game_user" as const,
		roomId: user.roomId,
		cards: [] as Card[],
		points: 0,
		turn: false,
	})
}

export function checkUser<I extends number>(id: I) {
	return getUsers().some(user => user.id === id)
}

export function getUser<I extends number, R extends number>(options: {
	id: I
	roomId?: R
}): AnyUser | undefined
export function getUser<I extends number>(id: I): AnyUser | undefined
export function getUser<I extends number, R extends number>(
	option: { id: I; roomId?: R } | I
) {
	return getUsers(typeof option === "object" ? option.roomId : option)?.find(
		user => user.id === (typeof option === "object" ? option.id : option)
	)
}

export function getGameUser<I extends number>(id: I): GameUser | undefined
export function getGameUser<I extends number, R extends number>(
	id: I,
	roomId: R
): GameUser | undefined
export function getGameUser<I extends number, R extends number>(option: {
	id: I
	roomId?: R
}): GameUser | undefined
export function getGameUser<I extends number, R extends number>(
	option: { id: I; roomId?: R } | I,
	roomId?: R
) {
	return getGameUsers(
		typeof option === "object" ? option.roomId ?? roomId : option
	)?.find(
		user => user.id === (typeof option === "object" ? option.id : option)
	)
}

export function deleteUser<I extends number>(options: { id: I } | I) {
	var id = (typeof options === "object" ? options.id : options) as number,
		user = getUser(id)

	if (!user?.roomId) return
	var userIndexInRoom = getUsers(user.roomId)?.findIndex(
		user => user.id === id
	)
	if (userIndexInRoom === undefined) return

	delete db.rooms[user.roomId].users[userIndexInRoom]
	delete db.users[id]
}

export function deleteUserfromRoom<UI extends number, RI extends number>(
	userId: UI,
	roomId: RI
) {
	if (roomId > 0) return false
	var room = getRoom(roomId)
	if (!room) return false
	var idx = room.users.findIndex(user => user.id === userId)
	if (idx === -1) return false
	room.users.splice(idx, 1)
	return true
}

export function createDefaultUserSettings(
	options?: PartialNonEmpty<UserSettings>
): UserSettings {
	return Object.assign(
		{
			lang: "en",
			settButOnpPos: "top-right",
			settButClsPos: "top-right",
		} as UserSettings,
		options
	)
}

export function updateUser(id: number, newData: User) {
	var user = getUser(id)
	return user ? (updateObject(user, newData), true) : false
}

export function updateGameUser(id: number, newData: GameUser) {
	var user = getUser(id)
	return user ? (updateObject(user, newData), true) : false
}

/*
	User
------------------------------------------------------------
	Counters
*/

export function* counter(i = 1): Generator<number, void, never> {
	while (1) yield i++
}

export function id(generator: Generator<number, any, never>): number {
	return generator.next().value
}

export function* cardSequence<P extends number>(prevPoint: P) {
	var cards = shuffleArray(range(1, 13))
	while (cards[0] === prevPoint) shuffleArray(cards)
	yield* cards
}

/*
	Counters
------------------------------------------------------------
	WebSocket
*/

export function parseWebsocketMessage<P extends "server" | "client">(
	message: unknown,
	place: P
):
	| (P extends "server"
			? WebSocketMessageServer<boolean>
			: WebSocketMessageClient<boolean>)
	| null {
	try {
		if (typeof message !== "string") return null
		var data = JSON.parse(message)
		if (typeof data !== "object") return null
		return data
	} catch (e) {
		return null
	}
}

export function checkWebsocketMessage<
	A extends SimpleAction | GameAction | undefined = undefined
>(message: WebSocketMessageServer<boolean>, action?: A, dev = false) {
	var data: WebSocketMessageServer<boolean> | null = null
	if (dev) data = message
	else if (keysInWebsocketMessage.every(key => Object.hasOwn(message, key))) {
		if (action === "add_user_to_room")
			if (message.action === "add_user_to_room") data = message
		if (action === "remove_user_from_room")
			if (message.action === "remove_user_from_room") data = message
		if (action === "rename_user")
			if (
				message.action === "rename_user" &&
				typeof message.newName === "string" &&
				message.newName.trim() !== ""
			)
				data = message
		if (action === "pass") if (message.action === "pass") data = message
		if (action === "take_card")
			if (message.action === "take_card") data = message
		if (action === "cabo") if (message.action === "cabo") data = message
		if (action === "use_card")
			if (
				message.action === "use_card" &&
				typeof message.card === "object" &&
				typeof message.card.new === "boolean" &&
				typeof message.card.points === "number" &&
				7 >= message.card.points &&
				message.card.points <= 12 &&
				cardWords.includes(message.card.role) &&
				cardWords.includes(message.word)
			)
				data = message
		if (action === "change_cards")
			if (
				message.action === "change_cards" &&
				Array.isArray(message.cards) &&
				message.cards.every(
					card =>
						typeof card === "object" &&
						typeof card.new === "boolean" &&
						cardRoles.includes(card.role) &&
						typeof card.points === "number" &&
						0 >= card.points &&
						card.points <= 13
				)
			)
				data = message
	}

	return data
}

export function sendMessageToAllClients(
	message: WebSocketMessageClient | JSONString
) {
	clients.forEach(client =>
		client.ws.readyState === WebSocket.OPEN
			? client.ws.send(
					typeof message === "string"
						? message
						: stringifyData(message)
			  )
			: 0
	)
}

export function sendMessageToClient(
	client: GameWebSocket,
	message: WebSocketMessageClient<boolean> | JSONString
) {
	client.readyState === WebSocket.OPEN
		? client.send(
				typeof message === "string" ? message : stringifyData(message)
		  )
		: 0
}

/*
	WebSocket
------------------------------------------------------------
	WebSocket Server
*/

export function handleNewConnection(ws: GameWebSocket) {
	console.log(colorText("New client connected", "#0a0"))
	ws.on("message", processRawMessage(ws))

	ws.on("close", () => {
		console.log(colorText("Client disconnected", "#a00"))
		if (ws.key) clients.delete(ws.key)
	})
}

export function processRawMessage(ws: GameWebSocket) {
	return (messageIn: JSONString) => {
		var data = parseWebsocketMessage(messageIn, "server")
		if (!data) return

		var message = checkWebsocketMessage(data, undefined, true)
		if (!message) return

		if (checkWebSocketMessageType(message, "config"))
			// if message for configuration proposes
			processConfigMessage(ws, message)
		else if (checkWebSocketMessageType(message, "to_server")) {
			// regular message to server
			var { room, user, action, cmd, actionType, key } = message

			if (key === undefined)
				return sendMessageToClient(ws, error_message_doesnt_have_key)

			if (cmd) processCMD(cmd) // debug proposed
			if (actionType === "config") {
				if (action === "rename_user") processRenameUser(message)
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
	}
}

export function processCMD<C extends FullCMD>(cmd: C) {
	if (!cmd.trim()) return false

	var parts = cmd.split(" "),
		command = parts.shift()

	var done = false
	switch (command) {
		case "show": {
			var option = parts.shift() as (typeof CMD_SHOW)[number] | undefined

			if (option) {
				if (option === "db") console.log(db)
				else if (option === "users") console.log(getUsers())
				else if (option === "rooms") console.log(getRooms())
				else break
				done = true
			}
		}
	}
	return done
}

export function processConfigMessage(
	ws: GameWebSocket,
	message: WebSocketMessageServer<true>
) {
	if (message.action === "confirm") {
	} else if (message.action === "reject") {
	} else if (message.action === "generate_key") {
		if (ws.key === undefined) {
			var key = generateHexID()
			ws.key = key
			clients.set(key, {
				ws,
				key,
				lastSeen: Date.now(),
			})
			sendMessageToClient(ws, {
				type: "to_client",
				action: "generate_key",
				key,
			})
		} else {
			sendMessageToClient(ws, error_key_exists)
		}
	}
}

export function checkWebSocketMessageType<
	T extends WebSocketMessageServer<boolean>["type"]
>(
	message: WebSocketMessageServer<boolean>,
	type: T
): message is T extends "config"
	? WebSocketMessageServer<true>
	: WebSocketMessageServer<false> {
	return message.type === type
}

export function processRenameUser(message: WebSocketMessageServer) {
	var { room, user } = message,
		roomFound = getRoom(room),
		ws = getWebSocketByHexID(message.key!)
	if (!roomFound)
		return ws ? sendMessageToClient(ws, error_room_not_found) : void 0
	if (message.action !== "rename_user") return
	if (message.newName === undefined) {
		return ws
			? sendMessageToClient(ws, error_message_doesnt_have_new_name)
			: void 0
	}

	var userFound = roomFound.users.find(u => u.id === user)

	if (!userFound)
		return ws ? sendMessageToClient(ws, error_user_not_found) : void 0

	userFound.name = message.newName
	var messageOut: WebSocketMessageClient = {
		type: "to_client",
		action: "rename_user",
		room: roomFound,
		newName: message.newName,
		user: userFound,
	}

	sendMessageToAllClients(messageOut)
}

/*
	WebSocket Server
------------------------------------------------------------
	Client
*/

export function handleRawClientMessage(messageIn: JSONString) {
	var data = parseWebsocketMessage(messageIn, "client")
	if (!data) return

	processClientMessage(data)
}

export function processClientMessage(message: WebSocketMessageClient<boolean>) {
	if (message.type === "config") {
	} else if (message.type === "error") {
	} else if (message.type === "to_client") {
		var { action } = message
	}
}

export function processConfigMessageClient(
	ws: GameWebSocket,
	message: WebSocketMessageClient<true>
) {}

/*
	Client
------------------------------------------------------------
	Game
*/

export function checkUsersCards<U extends GameUser, C extends Card[]>(
	user: U,
	cards: C
) {
	return cards.every(card => user.cards.includes(card))
}

export function checkSameCards<C extends Card[]>(cards: C) {
	return cards.every(card => cards[0].points === card.points)
}

export function getCardRole<C extends CardPoint>(points: C): IsRoleCard<C> {
	return (
		points == 7 || points == 8
			? "peak"
			: points == 9 || points == 10
			? "spy"
			: points == 11 || points == 12
			? "swap"
			: null
	) as IsRoleCard<C>
}

export function createCard<P extends CardPoint>(points: P): Card<P> {
	return {
		points,
		role: getCardRole(points),
		new: true,
	}
}

export function generateCard(): Card
export function generateCard<I extends boolean>(initial: I): Card
export function generateCard<I extends boolean>(initial = false as I): Card {
	var points = random(0, 13) as CardPoint
	return {
		points,
		role: getCardRole(points),
		new: initial,
	}
}

export function generateCards<N extends number>(count: N) {
	return Array.from({ length: count }, generateCard)
}

/*
	Game
------------------------------------------------------------
	...
*/
