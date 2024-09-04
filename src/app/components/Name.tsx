export default function Name() {
	return (
		<div className="layer">
			<div className="layer-data-wrapper">
				<h2>Enter your nickname for the game</h2>
				<form id="name-form">
					<input
						className="ui-input"
						type="text"
						placeholder="Nickname"
					/>
					<button type="submit" className="ui-button">
						Play
					</button>
				</form>
			</div>
		</div>
	)
}
