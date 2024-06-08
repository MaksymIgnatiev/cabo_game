import "../scss/settings.scss"

export default function Settings({ active }: { active: boolean }) {
	return (
		<div
			className={`side-layer settings-wrapper ${
				active ? "settings-wrapper-active" : ""
			}`}
		>
			<div className="settings-layer"></div>
		</div>
	)
}
