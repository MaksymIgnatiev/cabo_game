import("dotenv").then(dotenv => dotenv.config())

import fs from "fs"
import { Room } from "./types"

const roomsJsonPath = process.env.ROOMS_JSON_PATH!

export function addRoom(room: Room) {
	const rooms = getRooms()
	rooms.push(room)
	fs.writeFileSync(roomsJsonPath, JSON.stringify(rooms), "utf-8")
	return room
}

export function checkRoom(id: number) {
	return getRooms().some(room => room.id === id)
}

export function getRoom(id: number) {
	return getRooms().find(room => room.id === id)!
}

export function getRooms() {
	return JSON.parse(fs.readFileSync(roomsJsonPath, "utf-8")) as Room[]
}
