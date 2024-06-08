import {
	LOCAL_STORAGE_NICKNAME_KEY,
	LOCAL_STORAGE_ROOM_ID_KEY,
} from "../data/keys"

import { useState } from "react"
import { invisibleCarsRegex } from "../data/regexes"
import { CollectDataParams } from "../types"
import Constructor from "./CollectData/constructor"

export default function CollectData({
	hasNickname,
	hasRoomId,
	toggleTransition,
}: CollectDataParams) {
	const [errorNickname, setErrorNickname] = useState({
			error: false,
			text: "",
		}),
		[errorGameId, setErrorGameId] = useState({ error: false, text: "" }),
		validNickname = (nick: string) => {
			const valid = invisibleCarsRegex.test(nick)
			if (!valid) {
				setErrorNickname(o => ({
					...o,
					error: true,
					text: "Nickname cannot contain invisible cars",
				}))
				return false
			} else if (nick.length === 0) {
				setErrorNickname(o => ({
					...o,
					error: true,
					text: "Field cannot be empty",
				}))
				return false
			} else if (errorNickname.error)
				setErrorNickname(o => ({
					...o,
					error: false,
					text: "",
				}))
			return true
		},
		validGameId = (gameId: string) => {
			const valid = /^([\d]+)$/.test(gameId)
			if (!valid) {
				setErrorGameId(o => ({
					...o,
					error: true,
					text: "Game ID contains invalid characters. Allowed characters: 0-9 (numbers only)",
				}))
				return false
			} else if (errorGameId.error)
				setErrorGameId(o => ({
					...o,
					error: false,
					text: "",
				}))
			return true
		},
		checkNickname = (nick: string) => {
			if (validNickname(nick)) {
				toggleTransition()
				localStorage.setItem(LOCAL_STORAGE_NICKNAME_KEY, nick)
			}
		},
		checkGameId = (gameId: string) => {
			if (validGameId(gameId)) {
				toggleTransition()
				localStorage.setItem(LOCAL_STORAGE_ROOM_ID_KEY, gameId)
			}
		}

	return (
		<>
			{hasNickname ? (
				<Constructor
					ariaData="Get Nickname"
					title="Enter your nickname for the game"
					inputPlaseholder="Nickname"
					buttonText="Continue"
					errorText={errorNickname.error ? errorNickname.text : ""}
					onSubmit={checkNickname}
				/>
			) : (
				""
			)}
			{hasRoomId ? (
				<Constructor
					ariaData="Get Room ID"
					title="Enter the room ID"
					inputPlaseholder="Room ID"
					buttonText="Continue"
					errorText={errorGameId.error ? errorGameId.text : ""}
					onSubmit={checkGameId}
				/>
			) : (
				""
			)}
		</>
	)
}
