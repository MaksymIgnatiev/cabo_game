"use client"

import React from "react"
import { useParams } from "next/navigation"

export default function Home() {
	const router = useParams(),
		{ id } = router
	return (
		<div>
			<h1>ID page: {id}</h1>
		</div>
	)
}
