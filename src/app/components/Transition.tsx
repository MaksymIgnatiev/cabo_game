import "../scss/transition.scss"

export default function Transition({ active }: { active: boolean }) {
	return (
		<div
			className={`layer cabo-transition big-cabo-letters ${
				active ? "cabo-transition-active" : ""
			}`}
		>
			<span>C</span>
			<span>A</span>
			<span>B</span>
			<span>O</span>
		</div>
	)
}
