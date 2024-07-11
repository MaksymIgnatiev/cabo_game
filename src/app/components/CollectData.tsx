import {
	LOCAL_STORAGE_NICKNAME_KEY,
	LOCAL_STORAGE_ROOM_ID_KEY,
	LOCAL_STORAGE_USER_ID_KEY,
} from "../data/keys"

import { useState } from "react"
import { userID } from "../../../database"
import { id } from "../../../functions"
import { CollectDataParams } from "../../../types"
import { invisibleCarsRegex } from "../data/regexes"
import Constructor from "./CollectData/constructor"

export default function CollectData({
	hasNickname,
	hasRoomId,
	toggleTransition,
	setUser,
}: CollectDataParams) {
	const [errorNickname, setErrorNickname] = useState(""),
		[errorGameId, setErrorGameId] = useState(""),
		validNickname = (nick: string) => {
			console.log({ nick })
			const notValid = invisibleCarsRegex.test(nick)
			if (notValid) {
				setErrorNickname("Nickname cannot contain invisible cars")
				return false
			} else if (nick.length === 0) {
				setErrorNickname("Field cannot be empty")
				return false
			} else if (errorNickname) setErrorNickname("")
			return true
		},
		validGameId = (gameId: string) => {
			const valid = /^([\d]+)$/.test(gameId)
			if (!valid) {
				setErrorGameId(
					"Game ID contains invalid characters. Allowed characters: 0-9 (numbers only)"
				)
				return false
			} else if (errorGameId) setErrorGameId("")
			return true
		},
		checkNickname = (nick: string) => {
			if (validNickname(nick)) {
				toggleTransition()
				const userId = id(userID)
				localStorage.setItem(LOCAL_STORAGE_NICKNAME_KEY, nick)
				localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, userId + "")
				setUser(o => ({
					...o,
					name: nick,
					id: userId,
				}))
			}
		},
		checkGameId = (gameId: string) => {
			if (validGameId(gameId)) {
				toggleTransition()
				localStorage.setItem(LOCAL_STORAGE_ROOM_ID_KEY, gameId)
				setUser(o => ({
					...o,
					roomId: +gameId,
				}))
			}
		}

	return (
		<>
			{!hasRoomId ? (
				<Constructor
					ariaLabel="Get Room ID"
					title="Enter the room ID"
					inputPlaseholder="Room ID"
					buttonText="Continue"
					errorText={errorGameId || ""}
					onSubmit={checkGameId}
				/>
			) : (
				""
			)}
			{!hasNickname ? (
				<Constructor
					ariaLabel="Get Nickname"
					title="Enter your nickname for the game"
					inputPlaseholder="Nickname"
					buttonText="Continue"
					errorText={errorNickname || ""}
					onSubmit={checkNickname}
				/>
			) : (
				""
			)}
		</>
	)
}
