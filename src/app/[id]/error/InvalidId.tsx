export default function InvalidId({ id }: { id: string }) {
	return (
		<div>
			The id: {id} is invalid. Game id must contain only numbers (0-9)
		</div>
	)
}
