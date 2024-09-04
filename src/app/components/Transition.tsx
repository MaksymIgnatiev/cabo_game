import "../scss/transition.scss"

export default function Transition({ active }: { active: boolean }) {
	return (
		<div
			className={`layer cabo-transition  ${
				active ? "cabo-transition-active" : ""
			}`}
		>
			<div className="big-cabo-letters cabo-letters-wrapper"></div>
			<span>C</span>
			<span>A</span>
			<span>B</span>
			<span>O</span>
		</div>
	)
}
