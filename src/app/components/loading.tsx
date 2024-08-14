"use client"

import "../scss/loading.scss"

import { useEffect, useState } from "react"

export default function Loading() {
	var [delayFade, setDelayFade] = useState(true),
		[delayDelete, setDelayDelete] = useState(true),
		delay = 3_600

	useEffect(() => {
		var timer1 = setTimeout(() => setDelayFade(false), delay),
			timer2 = setTimeout(() => setDelayDelete(false), delay + 500)

		return () => {
			clearTimeout(timer1)
			clearTimeout(timer2)
		}
	}, [])

	return delayDelete ? (
		<div
			className={`layer loading-screen big-cabo-letters${
				delayFade ? " fade-in-300ms" : ""
			}`}
		>
			<span id="C">C</span>
			<span id="A">A</span>
			<span id="B">B</span>
			<span id="O">O</span>
		</div>
	) : (
		<></>
	)
}
