import "dotenv/config"

import {
	AnyUser,
	Card,
	CardPoint,
	ColorTextOptionParams,
	FullCMD,
	GameUser,
	GetRoomsFunctionParams,
	GetRoomsFunctionParamsWord,
	GetRoomsReturnType,
	HEXString,
	HSLString,
	Hue,
	IsRoleCard,
	JSONString,
	JSONValue,
	Lightness,
	PartialNonEmpty,
	Room,
	Saturation,
	User,
	UserSettings,
	WebSocketMessageIn,
	WebSocketMessageOut,
} from "./types"
import { CMD_SHOW, keysInWebsocketMessage } from "./src/app/data/tests"
import { clients, db } from "./database"

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

export function validHEXString(hex: string): hex is HEXString {
	return hex[0] === "#" && (hex.length === 4 || hex.length === 7)
}

export function HEXToHSL<S extends HEXString>(hex: S): HSLString
export function HEXToHSL<S extends HEXString, B extends boolean = true>(
	hex: S,
	values: true
): [Hue, Saturation, Lightness]
export function HEXToHSL<S extends HEXString, B extends boolean = false>(
	hex: S,
	values: false
): HSLString

export function HEXToHSL<S extends HEXString, B extends boolean>(
	hex: S,
	values = false as B
): B extends true ? [Hue, Saturation, Lightness] : HSLString {
	const p = hex.length === 4 ? 1 : 2
	let rs = hex.slice(1, 1 + p),
		gs = hex.slice(1 + p, 1 + p * 2),
		bs = hex.slice(1 + p * 2, 1 + p * 3)

	if (p === 1) [rs, gs, bs] = [rs + rs, gs + gs, bs + bs]

	const r = parseInt(rs, 16) / 255,
		g = parseInt(gs, 16) / 255,
		b = parseInt(bs, 16) / 255,
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

	return (values ? [h, s, l] : `hsl(${h}, ${s}%, ${l}%)`) as B extends true
		? [Hue, Saturation, Lightness]
		: HSLString
}

export function HEXtoRGB<S extends HEXString>(
	hex: S
): [number, number, number] {
	const p = hex.length === 4 ? 1 : 2
	return [
		parseInt(hex.slice(1, 1 + p), 16),
		parseInt(hex.slice(1 + p, 1 + p * 2), 16),
		parseInt(hex.slice(1 + p * 2, 1 + p * 3), 16),
	]
}

/** Shuffles the given array in-place
 * @param array Array to be shuffled */
export function shuffleArray<A extends any[]>(array: A) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
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
	return Array.from(
		{
			length:
				(end <= 0 ? start : end - start) / step + (end <= 0 ? 0 : 1),
		},
		(_, i) => (end <= 0 ? 0 : start) + i * step
	)
}

/**
 * Makes text and backbgound colorful using `ANSI` escape characters
 * @param str Text to be colored
 * @param options param that reepresents HEX color of text foreground /
 * tuple with 3 colors that represents RGB chanels /
 * object with fields `text` and/or `background`, each of which represents a tuple with 3 values for rgb chanels for foreground/background
 * @returns `ANSI` string with mixed color around text
 */
export function colorText<Hex extends HEXString>(str: string, hex: Hex): string
export function colorText<RGB extends [number, number, number]>(
	str: string,
	rgb: RGB
): string
export function colorText<O extends ColorTextOptionParams>(
	str: string,
	options: O
): string
export function colorText<
	O extends [number, number, number] | HEXString | ColorTextOptionParams
>(str: string, options: O) {
	let [tr, tg, tb, br, bg, bb] = [
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
	] as (number | undefined)[]
	if (typeof options === "string") {
		if (validHEXString(options)) {
			const colors = HEXtoRGB(options)
			if (colors.every(e => !Number.isNaN(e))) [tr, tg, tb] = colors
		}
	} else if (Array.isArray(options)) [tr, tg, tb] = options
	else if (typeof options === "object") {
		if ("text" in options) {
			if (typeof options.text !== "string") [tr, tg, tb] = options.text
			else if (validHEXString(options.text))
				[tr, tg, tb] = HEXtoRGB(options.text)
		}
		if ("background" in options) {
			if (typeof options.background !== "string")
				[br, bg, bb] = options.background
			else if (validHEXString(options.background))
				[br, bg, bb] = HEXtoRGB(options.background)
		}
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
	return Object.keys(db.users).length
}

export function getWebSocketClientsCount() {
	return clients.size
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
	const allOptions = Object.assign(
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

export function createGameUser<U extends User>(user: U) {
	return Object.assign(user, {
		type: "game_user",
		roomId: user.roomId ?? -1,
		cards: [] as Card[],
		points: 0,
		turn: false,
	}) as unknown as GameUser
}

export function checkUser<I extends number>(id: I) {
	return getUsers().some(user => user.id === id)
}

export function getUser<I extends number, R extends number>(options: {
	id: I
	roomId?: R
}) {
	const users = getUsers(options.roomId)
	if (!users) return null

	return users.find(user => user.id === options.id)
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
	const arr = range(1, 13),
		cards = shuffleArray(arr)
	while (cards[0] === prevPoint) shuffleArray(arr)
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
): (P extends "server" ? WebSocketMessageIn : WebSocketMessageOut) | null {
	try {
		if (typeof message !== "string") return null
		const data = JSON.parse(message)
		if (typeof data !== "object") return null
		return data
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
		: keysInWebsocketMessage.every(key => Object.hasOwn(message, key))
		? message
		: null
}

export function sendMessageToAllClients(message: JSONString) {
	clients.forEach(client =>
		client.readyState === WebSocket.OPEN ? client.send(message) : 0
	)
}

export function sendMessageToClient<
	T extends Record<string, JSONValue> | JSONString
>(client: WebSocket, message: T) {
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

export function processCMD<C extends FullCMD>(cmd: C) {
	if (!cmd.trim()) return false

	const parts = cmd.split(" "),
		command = parts.shift()

	let done = false
	switch (command) {
		case "show": {
			const option = parts.shift() as
				| (typeof CMD_SHOW)[number]
				| undefined

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

/*
	WebSocket Server
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
	const points = random(1, 13) as CardPoint
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
