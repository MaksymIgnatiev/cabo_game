"use client"

import { useState } from "react"

export default function MainGame() {
	const [as, setAs] = useState(Array.from({length: 10}, (_, i) => i + 1))
	return (
		<div className="wrapper">
			<div className="top">
				<div className="turn">
					<button value="8" className="test"></button>
				</div>
			</div>
			<div className="game">
				<div>
					{as.map(e => <a key={e}>{e}</a>)}
				</div>
				<h1>финансирование поступило, сайт в разработке</h1>
			</div>
		</div>
	)
}
