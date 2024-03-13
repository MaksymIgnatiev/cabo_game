export default function create_new_name() {
	return (
		<div className="create-name b-g">
			<div className="create-name-wrapper">
				<h1>Create your nickname for the game:</h1>
				<input
					className="create-name-inp"
					type="text"
					name="nickname"
					placeholder="Nickname"
				/>
				<button type="button">Confirm</button>
			</div>
		</div>
	)
}
