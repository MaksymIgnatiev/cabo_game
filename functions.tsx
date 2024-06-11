import "dotenv/config"

import { clients, db } from "./database"
import {
	GameUser,
	GetRoomsFunctionParams,
	GetRoomsFunctionParamsWord,
	GetRoomsReturnType,
	JSONString,
	JSONValue,
	PartialNonEmpty,
	Room,
	User,
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

/*
	Global
-----------------------------------------------------------
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
-----------------------------------------------------------
	User
*/
export function getUsers(): User[]
export function getUsers<I extends number>(roomId?: I): GameUser[] | undefined
export function getUsers<I extends number>(
	roomId?: I
): (User | GameUser)[] | undefined {
	return roomId ? db.rooms[roomId]?.users : db.users
}

export function createUser<
	N extends string,
	I extends number,
	A extends boolean
>(name: N, id: I, options: { roomId?: number; is_admin?: A } = {}): User {
	return {
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
		roomId: user.roomId ?? -1,
		cards: [],
		points: 0,
		turn: false,
	}
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

export function deleteUser<I extends number, N extends string>(
	options: PartialNonEmpty<{ id: I; name: N }>
) {
	if ("id" in options) {
		const id = options.id as number,
			user = getUser({ id })

		if (!user?.roomId) return

		const userIndexInRoom = getUsers(user.roomId)?.findIndex(
			user => user.id === id
		)
		if (userIndexInRoom === undefined) return

		delete db.rooms[user.roomId].users[userIndexInRoom]
		delete db.users[id]
	} else if ("name" in options) {
		const name = options.name as string,
			user = getUser({ name })

		if (!user?.roomId) return

		const userIndexInRoom = getUsers(user.roomId)?.findIndex(
			user => user.name === name
		)

		if (userIndexInRoom === undefined) return
		delete db.rooms[user.roomId].users[userIndexInRoom]
		delete db.users[db.users.findIndex(user => user.name === name)]
	}
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

/*
	User
-----------------------------------------------------------
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
-----------------------------------------------------------
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
