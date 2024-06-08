"use client"

import "../scss/loading.scss"

import { useEffect } from "react"

export default function Loading() {
	useEffect(() => {
		setTimeout(() => {
			const el = document.querySelector(".loading-screen")
			el?.classList.add("fade-out-300ms")
			setTimeout(() => el?.remove(), 500)
		}, 3_600)
	}, [])

	return (
		<div className="layer loading-screen big-cabo-letters">
			<span id="C">C</span>
			<span id="A">A</span>
			<span id="B">B</span>
			<span id="O">O</span>
		</div>
	)
}
