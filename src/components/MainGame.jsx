export default function MainGame() {
	return (
		<div className="wrapper">
			<div className="top">
				<div className="turn">
					<button value="8" className="test"></button>
				</div>
			</div>
			<div className="game">
				^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$
			</div>
		</div>
	)
}
