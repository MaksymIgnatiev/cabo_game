"use client"

import "../scss/start.scss"

import { useEffect } from "react"
import Button from "./Start/button"

export default function Start() {
	useEffect(() => {
		setTimeout(() => {
			document
				.querySelector(".wrapper")
				?.classList.remove("not-available")
		}, 4000)
	}, [])

	return (
		<div className="start-page-wrapper not-available layer-data-wrapper">
			<h1 className="welcome-title">
				Welcome to the{" "}
				<span className="light-salad-green-color">CABO</span> game!
			</h1>
			<div className="buttons">
				<Button
					text="Join Game"
					className="join-game"
					onClick={() => console.log("Join Game")}
				/>
				<Button
					text="Create Game"
					className="create-game"
					onClick={e => console.log(e)}
				/>
			</div>
		</div>
	)
}
