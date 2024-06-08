import("dotenv").then(dotenv => dotenv.config())

import {
	Database,
	GameUser,
	GetRoomsFunctionParams,
	GetRoomsReturnType,
	PartialNonEmpty,
	Room,
	SafeObjectPropertyForJSON,
	User,
} from "./types"

import fs from "fs"

const roomsJsonPath = process.env.ROOMS_JSON_PATH!

export function getDatabase() {
	return JSON.parse(fs.readFileSync(roomsJsonPath, "utf-8")) as Database
}

export function stringifyData(data: Record<string, SafeObjectPropertyForJSON>) {
	return JSON.stringify(data, null, "\t")
}

export function random(min = 0, max = 10 * 9) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/*
	Global
-----------------------------------------------------------
	Room
*/

export function addRoom(room: Room) {
	const rooms = getRooms()
	rooms[room.id] = room
	fs.writeFileSync(roomsJsonPath, stringifyData(rooms), "utf-8")
	return room
}

export function checkRoom<ID extends number>(id: ID) {
	return getRooms({ rooms: true }).some(room => room.id === id)
}

export function getRoom<ID extends number>(id: ID) {
	return getRooms({ rooms: true }).find(room => room.id === id)!
}

export function getRooms<
	E extends boolean = false,
	R extends boolean = false,
	I extends boolean = false
>(
	options: Partial<GetRoomsFunctionParams<E, R, I>> = {}
): GetRoomsReturnType<E, R, I> {
	const defaultOptions = {
			entries: false,
			ids: false,
			rooms: false,
		},
		allOptions = { ...defaultOptions, ...options },
		rooms = getDatabase().rooms
	if (allOptions.entries) {
		return Object.entries(rooms) as GetRoomsReturnType<E, R, I>
	} else if (allOptions.ids) {
		return Object.keys(rooms) as GetRoomsReturnType<E, R, I>
	} else if (allOptions.rooms) {
		return Object.values(rooms) as GetRoomsReturnType<E, R, I>
	}
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

export function getUsers() {
	return
}

export function createUser<
	N extends string,
	I extends number,
	A extends boolean
>(name: N, id: I, options: { roomId?: number; is_admin?: A } = {}) {
	return {
		name,
		id,
		room: options.roomId ?? 0,
		is_admin: options.is_admin ?? false,
		lang: "en",
		last_seen: Date.now(),
	}
}

export function createGameUser<U extends User>(user: U): GameUser {
	return {
		...user,
		cards: [],
		points: 0,
		turn: false,
	}
}

export function checkUser<I extends number, N extends string>(
	options: PartialNonEmpty<{ id: I; name: N }>
) {}

export function deleteUser<I extends number, N extends string>(
	options: PartialNonEmpty<{ id: I; name: N }>
) {
	if ("id" in options) {
		options.id
	}
}

/*
	User
-----------------------------------------------------------
	Counters
*/

export function* newCounter(i = 1) {
	while (1) yield i++
}

export function id(generator: Generator<number, any, number>): number {
	return generator.next().value
}
