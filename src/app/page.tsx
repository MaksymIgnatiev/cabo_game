"use client"

import "./scss/main.scss"

import { useEffect, useState } from "react"
import {
	LOCAL_STORAGE_NICKNAME_KEY,
	LOCAL_STORAGE_ROOM_ID_KEY,
	LOCAL_STORAGE_USER_ID_KEY,
} from "./data/keys"

import { HomePageComponentParams } from "../../types"
import CollectData from "./components/CollectData"
import Loading from "./components/Loading"
import Start from "./components/Start"
import Transition from "./components/Transition"

export default function Home({ id }: HomePageComponentParams) {
	const [userName, setUserName] = useState(""),
		[userID, setUserID] = useState(""),
		[roomID, setRoomID] = useState(""),
		[transition, setTransition] = useState(false),
		onWindowLoad = () => {
			const userNameLocalStorage = localStorage.getItem(
					LOCAL_STORAGE_NICKNAME_KEY
				),
				userIDLocalStorage = localStorage.getItem(
					LOCAL_STORAGE_USER_ID_KEY
				),
				roomIDLocalStorage = localStorage.getItem(
					LOCAL_STORAGE_ROOM_ID_KEY
				)
			// ws = new WebSocket(`ws://localhost:3030`)

			if (userNameLocalStorage) setUserName(() => userName)
			if (userIDLocalStorage) setUserID(() => userID)
			if (roomIDLocalStorage) setRoomID(() => roomID)

			return () => {
				// ws.close()
			}
		},
		toggleTransition = () => {
			setTransition(() => !transition)
			setTimeout(() => {
				setTransition(() => !transition)
			}, 3000)
		}
	useEffect(onWindowLoad, [])
	return (
		<>
			<Loading />
			<Start />
			<CollectData
				hasNickname={!!userName}
				hasRoomId={!!roomID}
				toggleTransition={toggleTransition}
			/>
			<Transition active={transition} />
		</>
	)
}
