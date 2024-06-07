export type HomePageComponentParams = {
	id?: string
}

export type User = {
	name: string
	id: number
	room: number
	is_admin: boolean
	lang: "en" | "ru"
	last_seen: number
}

export type GameUser = User & {
	cards: Card<CardPoints>[]
	points: number
	turn: boolean
}

export type Room = {
	id: number
	users: User[]
	turn: number
}

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

type AnyCard = Card<CardPoints>

/*
	Card
-----------------------------------------------------------
	Game
*/

type GameUseCard = `use_card_${CardWords}`

type GameAction = "use_card" | "pass" | "take_card" | "cabo" | "change_cards"

export type GameActionMessage<A extends GameAction> = {
	user: GameUser
	room: Room
} & (A extends "use_card"
	? {
			action: GameUseCard
			card: AnyCard
	  }
	: A extends "pass"
	? {
			action: "pass"
	  }
	: A extends "take_card"
	? {
			action: "take_card"
			card: AnyCard
	  }
	: A extends "cabo"
	? {
			action: "cabo"
	  }
	: {})

let message: GameActionMessage<"use_card"> = {
	user: {
		name: "test",
		id: 1,
		room: 1,
		is_admin: true,
		lang: "en",
		last_seen: 1,
		cards: [],
		points: 0,
		turn: true,
	},
	room: {
		id: 1,
		users: [],
		turn: 1,
	},
	action: "use_card_peak",
	card: {
		points: 9,
		role: "peak",
		new: true,
	},
}
