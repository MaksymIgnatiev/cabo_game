import { SetStateAction } from "react"
import { WebSocket } from "ws"

type TheBestTypeNameButNotTheBestUsacaseBecauseThisTypeDescribesTheWorstTypeInTypescitpEverAndYouWillBePunishedForItIfYouWillUseIt =
	any

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

export type PartialNonEmpty<T extends object> = {
	[K in keyof T]: AppendToObject<{}, { [P in K]: T[K] }>
}[keyof T]

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

type HexChar =
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

type IsHexChar<T extends string> = Lowercase<T> extends HexChar ? T : never
type CaseInsensitive<T extends string> = string extends T
	? string
	: T extends `${infer F}${infer R}`
	? `${Uppercase<F> | Lowercase<F>}${CaseInsensitive<R>}`
	: T
type HexColor<T extends string> =
	T extends `#${HexChar}${HexChar}${HexChar}${infer Rest1}`
		? Rest1 extends ``
			? T
			: Rest1 extends `${HexChar}${HexChar}${HexChar}`
			? T
			: never
		: never

let a: HexColor<"#00F000"> = "#00F000"
//  ^?

// type hexstring<S extends string> = HexColor<S>

export type HexColorLength = 3 | 6

export type Hue = number

export type Saturation = number

export type Lightness = number

export type Red = number

export type Green = number

export type Blue = number

export type HEXString = `#${string}`

export type RGBString = `rgb(${Red}, ${Green}, ${Blue})`

export type HSLString = `hsl(${Hue}, ${Saturation}%, ${Lightness}%)`

export interface GameWebSocket extends WebSocket {
	key?: string
}

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
	setUser: React.Dispatch<SetStateAction<User>>
}

export type SettingsParams = {
	userSettings: UserSettings
	setUserSettings: React.Dispatch<SetStateAction<UserSettings>>
}

export type ColorTextOptionParams = PartialNonEmpty<{
	text: [Red, Green, Blue] | HEXString
	background: [Red, Green, Blue] | HEXString
}>

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

export type User = {
	type: "user"
} & BaseUser

export type GameUser = {
	type: "game_user"
	roomId: number
	cards: Card[]
	points: number
	turn: boolean
} & BaseUser

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

type CardWord = "peak" | "spy" | "swap"

export type CardPoint =
	| 0
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 10
	| 11
	| 12
	| 13

export type IsRoleCard<T extends CardPoint> = T extends 7 | 8
	? "peak"
	: T extends 9 | 10
	? "spy"
	: T extends 11 | 12
	? "swap"
	: null

export type Card<N extends CardPoint = CardPoint> = {
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

/*
	Card
------------------------------------------------------------
	Game
*/

/*
	Game
------------------------------------------------------------
	Config (database)
*/

export type Database = {
	users: (User | GameUser)[]
	rooms: Record<string, Room>
}

export type Client = {
	ws: GameWebSocket
	lastSeen: number
}

/*
	Config (database)
------------------------------------------------------------
	WebSocket
*/

export type CMD = "show"

export type FullCMD<T extends CMD = CMD> = T extends "show"
	? `show ${"db" | "users" | "rooms"}`
	: never

type GameUseCard = `use_card_${CardWord}`

type GameAction = "use_card" | "pass" | "take_card" | "cabo" | "change_cards"

type GameActionIn = GameAction // maybe will be different implementation for messages `in` and `out`

type GameActionOut = GameAction // maybe will be different implementation for messages `in` and `out`

type SimpleAction = "add_user_to_room" | "remove_user_from_room" | "rename_user"

type ConfigAction = "confirm" | "reject" | "generate_key"

export type ErrorMessageCode =
	| "KEY_EXISTS"
	| "MESSAGE_DOESNT_HAVE_KEY"
	| "ROOM_NOT_FOUND"
	| "USER_NOT_FOUND"
	| "MESSAGE_DOESNT_HAVE_NEW_NAME"

export type SimpleActionIn = SimpleAction

export type SimpleActionOut = SimpleAction

export type GameActionMessageIn<Action extends GameActionIn = GameActionIn> = {
	actionType: "game"
} & (Action extends "use_card"
	? { action: "use_card"; card: WordCard; word: CardWord }
	: Action extends "pass"
	? { action: "pass" }
	: Action extends "take_card"
	? { action: "take_card"; card: Card }
	: Action extends "cabo"
	? { action: "cabo" }
	: Action extends "change_cards"
	? { action: "change_cards"; cards: Card[] }
	: never)

export type SimpleActionsMessageIn<
	Action extends SimpleActionIn = SimpleActionIn
> = { actionType: "config" } & (Action extends "add_user_to_room"
	? { action: "add_user_to_room" }
	: Action extends "remove_user_from_room"
	? { action: "remove_user_from_room" }
	: Action extends "rename_user"
	? { action: "rename_user"; newName: string }
	: never)

export type ConfigActionMessageIn<Action extends ConfigAction = ConfigAction> =
	Action extends "confirm"
		? { action: "confirm" }
		: Action extends "reject"
		? { action: "reject" }
		: Action extends "generate_key"
		? { action: "generate_key" }
		: never

export type WebSocketMessageIn<Config extends boolean = false> = {
	type: Config extends true ? "config" : "to_server"
	key?: string
} & (Config extends false
	? {
			user: number
			room: number
			cmd?: FullCMD
	  } & (SimpleActionsMessageIn | GameActionMessageIn)
	: ConfigActionMessageIn)

export type SimpleActionsMessageOut<
	Action extends SimpleActionOut = SimpleActionOut
> = Action extends "add_user_to_room"
	? { action: "add_user_to_room" }
	: Action extends "remove_user_from_room"
	? { action: "remove_user_from_room" }
	: Action extends "rename_user"
	? { action: "rename_user"; newName: string }
	: never

export type GameActionMessageOut<Action extends GameActionOut = GameActionOut> =
	Action extends "use_card"
		? { action: GameUseCard; card: WordCard }
		: Action extends "pass"
		? { action: "pass" }
		: Action extends "take_card"
		? { action: "take_card"; card: Card }
		: Action extends "cabo"
		? { action: "cabo" }
		: Action extends "change_cards"
		? { action: "change_cards"; cards: Card[] }
		: never

export type ConfigActionMessageOut<Action extends ConfigAction = ConfigAction> =
	Action extends "confirm"
		? { action: "confirm" }
		: Action extends "reject"
		? { action: "reject" }
		: Action extends "generate_key"
		? { action: "generate_key"; key: string }
		: never

export type ErrorMessage = {
	type: "error"
	message: string
	code: ErrorMessageCode
}

export type WebSocketMessageOut<Config extends boolean = false> =
	| ({
			type: Config extends true ? "config" : "to_client"
	  } & (Config extends false
			? {
					user: GameUser
					room: Room
			  } & (SimpleActionsMessageOut | GameActionMessageOut)
			: ConfigActionMessageOut))
	| ErrorMessage
