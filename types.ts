import { Dispatch, SetStateAction } from "react"

import { WebSocket } from "ws"

export type TheBestTypeNameButNotTheBestUsacaseBecauseThisTypeDescribesTheWorstTypeInTypescitpEverAndYouWillBePunishedForItIfYouWillUseIt =
	any

// ---------- Utility types ----------

export type NotEmpty<T> = keyof T extends never ? never : T

type AppendToObject<T extends object, U extends object> = {
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

type Range<
	N extends number,
	Acc extends Array<number> = []
> = Acc["length"] extends N ? Acc : Range<N, [...Acc, Acc["length"]]>

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

type HexChar = Range<10>[number] | "a" | "b" | "c" | "d" | "e" | "f"

export type IsHexChar<T extends string> = T extends HexChar ? T : never

// type HexColor<T extends string> =
//	T extends `#${HexChar}${HexChar}${HexChar}${infer Rest1}`
//		? Rest1 extends ``
//			? CaseInsensitive<T>
//			: Rest1 extends `${HexChar}${HexChar}${HexChar}`
//			? CaseInsensitive<T>
//			: never
//		: never

type CaseInsensitive<T extends string> = T extends `${infer F}${infer R}`
	? `${Uppercase<F> | Lowercase<F>}${CaseInsensitive<R>}`
	: ""

type HexColorRec<T extends string, N extends number> = N extends 0
	? T
	: HexColorRec<`${T}${HexChar}`, [-1, 0, 1, 2, 3, 4, 5][N]>

type HexColor3 = CaseInsensitive<HexColorRec<"#", 3>>

export type HexColorLength = 3 | 6

export type HEXClientKey = string

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
	roomId: number
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

export type UserObject = {
	user: User
	gameUser: GameUser
	userSettings: UserSettings
	setUser: Dispatch<SetStateAction<User>>
	setUserSettings: Dispatch<SetStateAction<UserSettings>>
	setGameUser: Dispatch<SetStateAction<GameUser>>
	ws: GameWebSocket
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
	key: HEXClientKey
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

export type GameAction =
	| "use_card"
	| "pass"
	| "take_card"
	| "cabo"
	| "change_cards"

type GameActionServer = GameAction // maybe will be different implementation for messages `in` and `out`

type GameActionClient = GameAction // maybe will be different implementation for messages `in` and `out`

export type SimpleAction =
	| "add_user_to_room"
	| "remove_user_from_room"
	| "rename_user"

type ConfigAction = "confirm" | "reject" | "generate_key"

export type ErrorMessageCode =
	| "KEY_EXISTS"
	| "MESSAGE_DOESNT_HAVE_KEY"
	| "ROOM_NOT_FOUND"
	| "USER_NOT_FOUND"
	| "MESSAGE_DOESNT_HAVE_NEW_NAME"

export type SimpleActionServer = SimpleAction

export type SimpleActionClient = SimpleAction

export type GameActionMessageServer<
	Action extends GameActionServer = GameActionServer
> = {
	actionType: "game"
} & (Action extends "use_card"
	? { action: "use_card"; card: WordCard; word: CardWord }
	: Action extends "take_card"
	? { action: "take_card"; card: Card }
	: Action extends "change_cards"
	? { action: "change_cards"; cards: Card[] }
	: Action extends "pass"
	? { action: "pass" }
	: Action extends "cabo"
	? { action: "cabo" }
	: never)

export type SimpleActionMessageServer<
	Action extends SimpleActionServer = SimpleActionServer
> = { actionType: "config" } & (Action extends "rename_user"
	? { action: "rename_user"; newName: string }
	: Action extends "add_user_to_room"
	? { action: "add_user_to_room" }
	: Action extends "remove_user_from_room"
	? { action: "remove_user_from_room" }
	: never)

export type ConfigActionMessageServer<
	Action extends ConfigAction = ConfigAction
> = { action: Action }

export type WebSocketMessageServer<Config extends boolean = false> = {
	type: Config extends true ? "config" : "to_server"
	key?: string
} & (Config extends false
	? {
			user: number
			room: number
			cmd?: FullCMD
	  } & (SimpleActionMessageServer | GameActionMessageServer)
	: ConfigActionMessageServer)

export type UseCardObject<T extends GameUseCard = GameUseCard> =
	T extends "use_card_peak"
		? { action: "use_card_peak"; card: PeakCard }
		: T extends "use_card_spy"
		? { action: "use_card_spy"; card: SpyCard }
		: T extends "use_card_swap"
		? { action: "use_card_swap"; card: SwapCard }
		: never

export type SimpleActionMessageClient<
	Action extends SimpleActionClient = SimpleActionClient
> = Action extends "rename_user"
	? { action: "rename_user"; newName: string }
	: Action extends "add_user_to_room"
	? { action: "add_user_to_room" }
	: Action extends "remove_user_from_room"
	? { action: "remove_user_from_room" }
	: never

export type GameActionMessageClient<
	Action extends GameActionClient = GameActionClient
> = Action extends "use_card"
	? UseCardObject
	: Action extends "take_card"
	? { action: "take_card"; card: Card }
	: Action extends "change_cards"
	? { action: "change_cards"; cards: Card[] }
	: Action extends "pass"
	? { action: "pass" }
	: Action extends "cabo"
	? { action: "cabo" }
	: never

export type ConfigActionMessageClient<
	Action extends ConfigAction = ConfigAction
> = Action extends "generate_key"
	? { action: "generate_key"; key: string }
	: Action extends "confirm"
	? { action: "confirm" }
	: Action extends "reject"
	? { action: "reject" }
	: never

export type ErrorMessage = {
	type: "error"
	message: string
	code: ErrorMessageCode
}

export type WebSocketMessageClient<Config extends boolean = false> =
	| ({
			type: Config extends true ? "config" : "to_client"
			debug?: boolean
	  } & (Config extends false
			? {
					user: GameUser
					room: Room
			  } & (SimpleActionMessageClient | GameActionMessageClient)
			: ConfigActionMessageClient))
	| ErrorMessage
