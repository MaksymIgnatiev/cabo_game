import React, { useState } from "react"

export default function MainGame() {
	const [as, setAs] = useState(Array.from({ length: 10 }, (_, i) => i + 1))
	return (
		<div class="wrapper">
			<div class="top">
				<div class="turn">
					<button value="8" class="test"></button>
				</div>
			</div>

			<div class="game">
				<div>
					{as.map((e) => (
						<span key={e}>{"JSX is cool ".repeat(e)}</span>
					))}
				</div>
				<h1>денег нету, сайт будет доступен после финансирования</h1>
			</div>
		</div>
	)
}
