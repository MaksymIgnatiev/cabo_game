"use client"

import Index from "@/app/page"
import InvalidId from "./error/InvalidId"
import NoSuchGame from "./error/NoSuchGame"
import { checkRoom } from "../../../functions"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function ID() {
	var [invalidId, setInvalidId] = useState(false),
		[noSuchGame, setNoSuchGame] = useState(false),
		id = useParams().id as string
	// roomIdstr = Array.isArray(id) ? id[0] : id

	if (!/^\d+$/.test(id)) setInvalidId(true)

	var roomId = +id

	if (!checkRoom(+roomId)) setNoSuchGame(true)

	return invalidId ? (
		<InvalidId id={id}></InvalidId>
	) : noSuchGame ? (
		<NoSuchGame id={roomId}></NoSuchGame>
	) : (
		<Index URLRoomId={id} />
	)
}
