export default function create_new_name() {
	return (
		<div class="create-name">
			<div class="create-name-wrapper">
				<h1>Create your nickname for the game:</h1>
				<input
					class="create-name-inp"
					type="text"
					name="nickname"
					placeholder="Nickname"
				/>
				<button type="button">Confirm</button>
			</div>
		</div>
	)
}
