"use client"

import "../scss/_loading.scss"

export default function Loading() {
	setTimeout(() => {
		const el = document.querySelector(".loading-screen")
		el?.classList.add("fade-out-300ms")
		setTimeout(() => el?.remove(), 500)
	}, 3_600)

	return (
		<div className="loading-screen">
			<span id="C">C</span>
			<span id="A">A</span>
			<span id="B">B</span>
			<span id="O">O</span>
		</div>
	)
}
