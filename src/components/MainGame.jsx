import React, { useState } from "react"
import fs from "node:fs"
let file = fs.createWriteStream()
export default function MainGame() {
	const [as, setAs] = useState(Array.from({ length: 10 }, (_, i) => i + 1))

	const [count, setCount] = useState(0)

	return (
		<div class="wrapper">
			<div class="top">
				<div class="turn">
					<button value="8" class="test"></button>
				</div>
			</div>

			{/* 
			let me check one thing
			*/}
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
