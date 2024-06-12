import "../scss/settings.scss"

import { SettingsParams, Side } from "../../../types"
import { useEffect, useState } from "react"

import SetOpenButtonPosition from "./Settings/setOpenButtonPosition"

export default function Settings({
	userSettings,
	setUserSettings,
}: SettingsParams) {
	const [active, setActive] = useState(false),
		[side, setSide] = useState<Side>(
			userSettings.settButOnpPos.split("-")[1] as Side
		),
		toggleActive = () => setActive(!active),
		getSide = () => userSettings.settButOnpPos.split("-")[1] as Side

	useEffect(() => {
		setSide(getSide())
	}, [userSettings.settButOnpPos])

	return (
		<>
			<button
				className={`settings-open-button-${
					userSettings.settButOnpPos
				} settings-button ${active ? "active" : ""}`}
				onClick={toggleActive}
			></button>

			<div
				className={`side-layer settings-wrapper settings-wrapper-${side} ${
					active ? "active" : ""
				}`}
			>
				<div className="settings-layer">
					<div className="setSettingsOpenButton">
						<span>Setting button position</span>
						<SetOpenButtonPosition
							userSettings={userSettings}
							setUserSettings={setUserSettings}
						/>
					</div>
				</div>
				<button
					className={`settings-close-button-${userSettings.settButClsPos} settings-button`}
					onClick={toggleActive}
				></button>
			</div>
		</>
	)
}
