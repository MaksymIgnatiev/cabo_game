import "../scss/settings.scss"

import { useState } from "react"

export default function Settings() {
	const [active, setActive] = useState(false)

	return (
		<div
			className={`side-layer settings-wrapper ${
				active ? "settings-wrapper-active" : ""
			}`}
		>
			<div className="settings-layer">
				<button
					className="settings-open-button settings-button"
					onClick={() => setActive(!active)}
				></button>
				Settings here
				<button
					className="settings-close-button settings-button"
					onClick={() => setActive(!active)}
				></button>
			</div>
		</div>
	)
}
