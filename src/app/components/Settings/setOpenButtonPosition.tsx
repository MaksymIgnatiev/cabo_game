import "../../scss/Settings/setOpenButtonPosition.scss"

import { SettingsParams } from "@/../types"

export default function setOpenButtonPosition({
	userSettings,
	setUserSettings,
}: SettingsParams) {
	return (
		<div className="open-button-position-container">
			<button
				onClick={() =>
					setUserSettings({
						...userSettings,
						settButOnpPos: "top-left",
					})
				}
				className={`top left ${
					userSettings.settButOnpPos == "top-left" ? "active" : ""
				}`}
			></button>
			<button
				onClick={() =>
					setUserSettings({
						...userSettings,
						settButOnpPos: "top-right",
					})
				}
				className={`top right ${
					userSettings.settButOnpPos == "top-right" ? "active" : ""
				}`}
			></button>
			<button
				onClick={() =>
					setUserSettings({
						...userSettings,
						settButOnpPos: "bottom-right",
					})
				}
				className={`bottom right ${
					userSettings.settButOnpPos == "bottom-right" ? "active" : ""
				}`}
			></button>
			<button
				onClick={() =>
					setUserSettings({
						...userSettings,
						settButOnpPos: "bottom-left",
					})
				}
				className={`bottom left ${
					userSettings.settButOnpPos == "bottom-left" ? "active" : ""
				}`}
			></button>
		</div>
	)
}
