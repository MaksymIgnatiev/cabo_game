import "dotenv/config"

import { clients, db } from "./database"
import {
	AnyUser,
	GameUser,
	GetRoomsFunctionParams,
	GetRoomsFunctionParamsWord,
	GetRoomsReturnType,
	HEXString,
	HSLString,
	Hue,
	JSONString,
	JSONValue,
	Lightness,
	PartialNonEmpty,
	Room,
	Saturation,
	User,
	UserSettings,
	WebSocketMessageIn,
} from "./types"

export function getDatabase() {
	return db
}

export function stringifyData<
	T extends JSONValue[] | Record<string, JSONValue>
>(data: T) {
	return JSON.stringify(data, null, "\t")
}

export function random(min = 0, max = 10 * 9) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function loadToGlobalView<N extends string>(name: N, func: Function) {
	;(globalThis as any)[name] = func
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

export function HEXToHSL<S extends HEXString>(hex: S): HSLString
export function HEXToHSL<S extends HEXString, B extends boolean = true>(
	hex: S,
	values: B
): [Hue, Saturation, Lightness]
export function HEXToHSL<S extends HEXString, B extends boolean = false>(
	hex: S,
	values: B
): HSLString

export function HEXToHSL<S extends HEXString, B extends boolean>(
	hex: S,
	values = false as B
): [Hue, Saturation, Lightness] | HSLString {
	const p = hex.length === 4 ? 1 : 2,
		r = parseInt(hex.slice(1, p), 16) / 255,
		g = parseInt(hex.slice(p, p * 2), 16) / 255,
		b = parseInt(hex.slice(p * 2, p * 3), 16) / 255,
		max = Math.max(r, g, b),
		min = Math.min(r, g, b)

	let h = 0,
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
	if (values) return [h, s, l]
	return `hsl(${h}, ${s}%, ${l}%)`
}

let a = HEXToHSL("#000", true)

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
	return getRooms({ rooms: true }).find(room => room.id === id)!
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
	const defaultOptions = {
			entries: false,
			ids: false,
			rooms: false,
		},
		isObjectOptions =
			typeof options === "object"
				? options
				: { [options ?? "entries"]: true },
		allOptions = { ...defaultOptions, ...isObjectOptions },
		rooms = db.rooms
	if (allOptions.entries || options === undefined)
		return Object.entries(rooms) as GetRoomsReturnType<E, R, I>
	else if (allOptions.ids)
		return Object.keys(rooms) as GetRoomsReturnType<E, R, I>
	else if (allOptions.rooms)
		return Object.values(rooms) as GetRoomsReturnType<E, R, I>

	return rooms as GetRoomsReturnType<E, R, I>
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

/*
	Room
------------------------------------------------------------
	User
*/
export function getUsers(): AnyUser[]
export function getUsers<I extends number>(roomId?: I): GameUser[] | undefined
export function getUsers<I extends number>(roomId?: I): AnyUser[] | undefined {
	return roomId ? db.rooms[roomId]?.users : db.users
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
		roomId: options.roomId,
		is_admin: options.is_admin ?? false,
		lang: "en",
		last_seen: Date.now(),
	}
}

export function createGameUser<U extends User>(user: U): GameUser {
	return {
		...user,
		type: "game_user",
		roomId: user.roomId ?? -1,
		cards: [],
		points: 0,
		turn: false,
	} as GameUser
}

export function checkUser<I extends number, N extends string>(
	options: PartialNonEmpty<{ id: I; name: N }>
) {
	const users = getUsers()
	if ("id" in options) return users.some(user => user.id === options.id)
	else if ("name" in options)
		return users.some(user => user.name === options.name)
	return false
}

export function getUser<I extends number, N extends string, R extends number>(
	options: PartialNonEmpty<{ id: I; name: N; roomId?: R }>
) {
	if (!options) return
	let users
	users = "roomId" in options ? getUsers(options.roomId) : getUsers()
	if (!users) return

	if ("id" in options) return users.find(user => user.id === options.id)
	else if ("name" in options)
		return users.find(user => user.name === options.name)
}

export function deleteUser<I extends number>(options: { id: I } | I) {
	const id = (typeof options === "object" ? options.id : options) as number,
		user = getUser({ id })

	if (!user?.roomId) return
	const userIndexInRoom = getUsers(user.roomId)?.findIndex(
		user => user.id === id
	)
	if (userIndexInRoom === undefined) return

	delete db.rooms[user.roomId].users[userIndexInRoom]
	delete db.users[id]
	return
}

export function createDefaultUserSettings(
	options?: PartialNonEmpty<UserSettings>
): UserSettings {
	const defaultSettings: UserSettings = {
		lang: "en",
		settButOnpPos: "top-right",
		settButClsPos: "top-right",
	}
	return { ...defaultSettings, ...options }
}

/*
	User
------------------------------------------------------------
	Counters
*/

export function* newCounter(i = 1): Generator<number, void, never> {
	while (1) yield i++
}

export function id(generator: Generator<number, any, never>): number {
	return generator.next().value
}

/*
	Counters
------------------------------------------------------------
	WebSocket
*/

export function parseWebsocketMessage(message: JSONString, dev = false) {
	try {
		return JSON.parse(message) as WebSocketMessageIn
	} catch (e) {
		return null
	}
}

export function checkWebsocketMessage(
	message: WebSocketMessageIn,
	dev = false
) {
	return dev
		? message
		: !!(
				message.user &&
				message.action &&
				message.room &&
				message.type === "to_server"
		  )
		? message
		: null
}

export function sendMessageToAllClients(message: JSONString) {
	clients.forEach(client =>
		client.readyState === WebSocket.OPEN ? client.send(message) : 0
	)
}

export function sendMessageToClient(client: WebSocket, message: JSONString) {
	client.readyState === WebSocket.OPEN ? client.send(message) : 0
}

export function sendMessageToWebSocket<
	T extends Record<string, JSONValue> | JSONString
>(client: WebSocket, message: T) {
	client.send(typeof message === "string" ? message : stringifyData(message))
}
