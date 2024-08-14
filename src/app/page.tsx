"use client"

import "./scss/main.scss"

import { useEffect, useState } from "react"
import { port, userID } from "../../database"
import {
	colorText,
	createDefaultUserSettings,
	createGameUser,
	createUser,
	getValueFromLocalStorage,
	id,
	loadToGlobalView,
	sendMessageToClient,
} from "../../functions"
import { HomePageComponentParams, UserObject } from "../../types"
import {
	LOCAL_STORAGE_NICKNAME_KEY,
	LOCAL_STORAGE_ROOM_ID_KEY,
	LOCAL_STORAGE_USER_ID_KEY,
	LOCAL_STORAGE_USER_SETTINGS_KEY,
} from "./data/keys"

import GameWebSocket from "./classes/GameWebSocket"
import CollectData from "./components/CollectData"
import Loading from "./components/Loading"
import MainGame from "./components/MainGame"
import Settings from "./components/Settings"
import Start from "./components/Start"
import Transition from "./components/Transition"

export default function Home({ URLRoomId }: HomePageComponentParams) {
	var [user, setUser] = useState(createUser("", -1, { roomId: -1 })),
		[gameUser, setGameUser] = useState(createGameUser(user)),
		[userSettings, setUserSettings] = useState(createDefaultUserSettings()),
		[transition, setTransition] = useState(false),
		userObject: UserObject = {
			user,
			gameUser,
			userSettings,
			setUser,
			setUserSettings,
			setGameUser,
			ws: new GameWebSocket(""),
		},
		onWindowLoad = () => {
			var userNameLocalStorage = getValueFromLocalStorage(
					LOCAL_STORAGE_NICKNAME_KEY
				),
				userIDLocalStorage = getValueFromLocalStorage(
					LOCAL_STORAGE_USER_ID_KEY
				),
				roomIDLocalStorage = getValueFromLocalStorage(
					LOCAL_STORAGE_ROOM_ID_KEY
				),
				ws = new GameWebSocket(`ws://localhost:${port}`)
			ws.on("message", () => {})
			userObject.ws = ws

			setUser(o =>
				Object.assign(o, {
					name: userNameLocalStorage ?? o.name,
					id: +(userIDLocalStorage ?? 0) || id(userID),
					roomId: +(roomIDLocalStorage ?? 0) || o.roomId,
				})
			)

			loadToGlobalView("sendMessageToClient", sendMessageToClient)

			return () => {
				ws.close()
			}
		},
		toggleTransition = () => {
			setTransition(p => !p)
			setTimeout(() => setTransition(p => !p), 3000)
		},
		checkForData = () => {
			if (user.name === "") setUser(o => Object.assign(o, { name: "" }))
			if (user.roomId === -1)
				setUser(o => Object.assign(o, { roomId: 0 }))
		},
		checkValidUser = () =>
			user.name !== "" && user.roomId !== -1 && user.id !== -1

	useEffect(onWindowLoad, [])

	useEffect(() => {
		localStorage.setItem(
			LOCAL_STORAGE_USER_SETTINGS_KEY,
			JSON.stringify(userSettings)
		)
	}, [userSettings])

	useEffect(() => console.log(colorText("User: ", "#050"), user), [user]) // development only
	useEffect(
		() => console.log(colorText("User: ", "#0c0"), gameUser),
		[gameUser]
	) // development only

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
