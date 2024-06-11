"use client"

import "./scss/main.scss"

import { useEffect, useState } from "react"
import {
	createUser,
	getValueFromLocalStorage,
	id,
	loadToGlobalView,
	sendMessageToWebSocket,
} from "../../functions"
import { GameUser, HomePageComponentParams, User } from "../../types"
import {
	LOCAL_STORAGE_NICKNAME_KEY,
	LOCAL_STORAGE_ROOM_ID_KEY,
	LOCAL_STORAGE_USER_ID_KEY,
} from "./data/keys"

import { counter } from "../../database"
import CollectData from "./components/CollectData"
import Loading from "./components/Loading"
import MainGame from "./components/MainGame"
import Settings from "./components/Settings"
import Start from "./components/Start"
import Transition from "./components/Transition"

export default function Home({ URLRoomId }: HomePageComponentParams) {
	const [user, setUser] = useState<User | GameUser>(
			createUser(" ", -1, { roomId: -1 })
		),
		[transition, setTransition] = useState(false),
		onWindowLoad = () => {
			const userNameLocalStorage = getValueFromLocalStorage(
					LOCAL_STORAGE_NICKNAME_KEY
				),
				userIDLocalStorage = getValueFromLocalStorage(
					LOCAL_STORAGE_USER_ID_KEY
				),
				roomIDLocalStorage = getValueFromLocalStorage(
					LOCAL_STORAGE_ROOM_ID_KEY
				)
			// ws = new WebSocket(`ws://localhost:${port}`)

			setUser(o => ({
				...o,
				name: userNameLocalStorage ?? o.name,
				id: +(userIDLocalStorage ?? 0) || id(counter),
				roomId: +(roomIDLocalStorage ?? 0) || o.roomId,
			}))
			if (!userIDLocalStorage)
				localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, user.id + "")

			loadToGlobalView("sendMessageToWebSocket", sendMessageToWebSocket)

			return () => {
				// ws.close()
			}
		},
		toggleTransition = () => {
			setTransition(p => !p)
			setTimeout(() => setTransition(p => !p), 3000)
		},
		checkForData = () => {
			if (user.name === " ") setUser(o => ({ ...o, name: "" }))
			if (user.roomId === -1) setUser(o => ({ ...o, roomId: 0 }))
		}

	useEffect(onWindowLoad, [])
	useEffect(() => console.log(user), [user])
	return (
		<>
			<Loading />
			<Start />
			<CollectData
				hasNickname={!!user?.name}
				hasRoomId={!!user?.roomId}
				toggleTransition={toggleTransition}
				setUser={setUser}
			/>
			{user.name && user.roomId && user.id ? <MainGame /> : ""}
			<Settings />
			<Transition active={transition} />
		</>
	)
}
