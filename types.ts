import { SetStateAction } from "react"

// ---------- Utility types ----------

export type NotEmpty<T> = keyof T extends never ? never : T

type AppendToObject<T, U> = {
	[K in keyof U]: U[K] extends
		| string
		| number
		| boolean
		| symbol
		| bigint
		| object
		| Function
		? T & { [P in K]: U[K] }
		: never
}[keyof U]

export type PartialNonEmpty<T> = T extends object
	? { [K in keyof T]: AppendToObject<{}, { [P in K]: T[K] }> }[keyof T]
	: never

/*
	Utility types
------------------------------------------------------------
	Global
*/

export type JSONString = string

export type JSONValue =
	| string
	| number
	| boolean
	| null
	| { [key: string]: JSONValue }
	| JSONValue[]

export type Language = "en" | "ru"

export type HexSymbol =
	| "0"
	| "1"
	| "2"
	| "3"
	| "4"
	| "5"
	| "6"
	| "7"
	| "8"
	| "9"
	| "a"
	| "b"
	| "c"
	| "d"
	| "e"
	| "f"
	| "A"
	| "B"
	| "C"
	| "D"
	| "E"
	| "F"

export type HexColorLength = 3 | 6

export type Hue = number

export type Saturation = number

export type Lightness = number

export type HEXString = `#${string}`

export type RGBString = `rgb(${number}, ${number}, ${number})`

export type HSLString = `hsl(${number}, ${number}%, ${number}%)`

export type HSLTuple = [Hue, Saturation, Lightness]

/*
	Global
------------------------------------------------------------
	Parameters & Return types
*/

export type HomePageComponentParams = {
	URLRoomId?: string
}

export type GetRoomsFunctionParams<
	E extends boolean,
	R extends boolean,
	I extends boolean
> = {
	entries: E
	rooms: R
	ids: I
}

export type GetRoomsFunctionParamsWord = {
	entries: [string, Room][]
	rooms: Room[]
	ids: string[]
}

export type GetRoomsReturnType<
	E extends boolean,
	R extends boolean,
	I extends boolean
> = E extends true
	? [string, Room][]
	: R extends true
	? Room[]
	: I extends true
	? string[]
	: Record<string, Room>

export type CollectDataCostructorParams = {
	ariaLabel: string
	title: string
	inputPlaseholder: string
	buttonText: string
	errorText: string
	onSubmit: <T extends string>(text: T) => void
}

export type CollectDataParams = {
	hasNickname: boolean
	hasRoomId: boolean
	toggleTransition: () => void
	setUser: React.Dispatch<SetStateAction<User | GameUser>>
}

export type SettingsParams = {
	userSettings: UserSettings
	setUserSettings: React.Dispatch<SetStateAction<UserSettings>>
}

/*
	Parameters & Return types
------------------------------------------------------------
	User
*/

export type BaseUser = {
	name: string
	id: number
	roomId: number | undefined
	is_admin: boolean
	lang: Language
	last_seen: number
}

export type User = BaseUser & {
	type: "user"
}

export type GameUser = BaseUser & {
	type: "game_user"
	roomId: number
	cards: Card<CardPoints>[]
	points: number
	turn: boolean
}

export type AnyUser = User | GameUser

export type Side = "left" | "right"

export type Position = "top" | "bottom"

export type SettingsButtonPosition = `${Position}-${Side}`

export type UserSettings = {
	lang: Language
	settButOnpPos: SettingsButtonPosition
	settButClsPos: SettingsButtonPosition
}

/*
	User
------------------------------------------------------------
	Room
*/

export type Room = {
	id: number
	users: GameUser[]
	turn: number
	last_lap: boolean
	waiting: boolean
}

/*
	Room
------------------------------------------------------------
	Card
*/

type CardWords = "peak" | "spy" | "swap"

type CardPoints = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

type IsRoleCard<T extends CardPoints> = T extends 7 | 8
	? "peak"
	: T extends 9 | 10
	? "spy"
	: T extends 11 | 12
	? "swap"
	: null

export type Card<N extends CardPoints> = {
	points: N
	role: IsRoleCard<N>
	new: boolean
}

type PeakCard = Card<7> | Card<8>

type SpyCard = Card<9> | Card<10>

type SwapCard = Card<11> | Card<12>

type WordCard = PeakCard | SpyCard | SwapCard

type RegularCard =
	| Card<0>
	| Card<1>
	| Card<2>
	| Card<3>
	| Card<4>
	| Card<5>
	| Card<6>
	| Card<13>

type AnyCard = WordCard | RegularCard

/*
	Card
-------------------------------------------------------------
	Game
*/
//
/*
	Game
-------------------------------------------------------------
	Config (database)
*/

export type SafeObjectPropertyForJSON =
	| string
	| number
	| boolean
	| null
	| Array<any>
	| Record<string, any>

export type Database = {
	users: (User | GameUser)[]
	rooms: Record<string, Room>
}

/*
	Config (database)
-------------------------------------------------------------
	WebSocket
*/

type GameUseCard = `use_card_${CardWords}`

type GameActionIn = "use_card" | "pass" | "take_card" | "cabo" | "change_cards"

export type SimpleActionIn =
	| "add_user_to_room"
	| "remove_user_from_room"
	| "rename_user"

type GameActionOut = "use_card" | "pass" | "take_card" | "cabo" | "change_cards"

export type SimpleActionOut = "add_user_to_room" | "remove_user_from_room"

export type GameActionMessageIn<Action extends GameActionIn = GameActionIn> = {
	user: GameUser
	room: Room
} & (Action extends "use_card"
	? { action: GameUseCard; card: WordCard }
	: Action extends "pass"
	? { action: "pass" }
	: Action extends "take_card"
	? { action: "take_card"; card: AnyCard }
	: Action extends "cabo"
	? { action: "cabo" }
	: Action extends "change_cards"
	? { action: "change_cards"; cards: AnyCard[] }
	: never)

export type SimpleActionsMessageIn<
	Action extends SimpleActionIn = SimpleActionIn
> = {
	user: GameUser
	room: number
} & (Action extends "add_user_to_room"
	? { action: "add_user_to_room" }
	: Action extends "remove_user_from_room"
	? { action: "remove_user_from_room" }
	: Action extends "rename_user"
	? { action: "rename_user"; newName: string }
	: never)

export type WebSocketMessageIn = (
	| SimpleActionsMessageIn
	| GameActionMessageIn
) & {
	type: "to_server"
	cmd?: "show_database" | "show_users" | "show_rooms"
}

export type SimpleActionsMessageOut<
	Action extends SimpleActionOut = SimpleActionOut
> = {
	user: GameUser
	room: number
} & (Action extends "add_user_to_room"
	? { action: "add_user_to_room" }
	: Action extends "remove_user_from_room"
	? { action: "remove_user_from_room" }
	: never)

export type GameActionMessageOut<Action extends GameActionOut = GameActionOut> =
	{
		user: GameUser
		room: Room
	} & (Action extends "use_card"
		? { action: GameUseCard; card: WordCard }
		: Action extends "pass"
		? { action: "pass" }
		: Action extends "take_card"
		? { action: "take_card"; card: AnyCard }
		: Action extends "cabo" | "change_cards"
		? { action: "cabo" }
		: Action extends "change_cards"
		? { action: "change_cards"; cards: AnyCard[] }
		: never)

export type WebSocketMessageOut = (
	| GameActionMessageOut
	| SimpleActionsMessageOut
) & {
	type: "to_client"
}

// the best comment ever (part 2)
