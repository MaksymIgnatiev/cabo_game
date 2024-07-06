"use client"

import "./scss/main.scss"

import { useEffect, useState } from "react"
import {
	createDefaultUserSettings,
	createUser,
	getValueFromLocalStorage,
	id,
	loadToGlobalView,
	sendMessageToWebSocket,
} from "../../functions"
import { HomePageComponentParams, User } from "../../types"
import {
	LOCAL_STORAGE_NICKNAME_KEY,
	LOCAL_STORAGE_ROOM_ID_KEY,
	LOCAL_STORAGE_USER_ID_KEY,
	LOCAL_STORAGE_USER_SETTINGS_KEY,
} from "./data/keys"

import { counter } from "../../database"
import CollectData from "./components/CollectData"
import Loading from "./components/Loading"
import MainGame from "./components/MainGame"
import Settings from "./components/Settings"
import Start from "./components/Start"
import Transition from "./components/Transition"

export default function Home({ URLRoomId }: HomePageComponentParams) {
	const [user, setUser] = useState<User>(createUser(" ", -1, { roomId: -1 })),
		[userSettings, setUserSettings] = useState(
			createDefaultUserSettings({
				settButOnpPos: "top-right",
			})
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

			loadToGlobalView("sendMessageToWebSocket", sendMessageToWebSocket)

			return () => {
				// ws.close()
				// do not remove this comment!!!
				// and this also
				// i have the bes comment ever!!!
			}
		},
		toggleTransition = () => {
			setTransition(p => !p)
			setTimeout(() => setTransition(p => !p), 3000)
		},
		checkForData = () => {
			if (user.name === " ") setUser(o => ({ ...o, name: "" }))
			if (user.roomId === -1) setUser(o => ({ ...o, roomId: 0 }))
		},
		checkValidUser = () =>
			user.name !== " " && user.roomId !== -1 && user.id !== -1

	useEffect(onWindowLoad, [])

	useEffect(() => {
		localStorage.setItem(
			LOCAL_STORAGE_USER_SETTINGS_KEY,
			JSON.stringify(userSettings)
		)
	}, [userSettings])

	useEffect(() => console.log(user), [user]) // development only

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
			{checkValidUser() ? <MainGame /> : ""}
			<Settings
				userSettings={userSettings}
				setUserSettings={setUserSettings}
			/>
			<Transition active={transition} />
		</>
	)
}
