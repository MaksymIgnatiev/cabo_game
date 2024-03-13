export default function waiting_hall() {
	return (
		<div className="waiting b-g">
			<div className="waiting-wrapper">
				<div className="top-info">
					<h2>Waiting hall</h2>
					<h3>
						<span className="room-id"></span>
						<span className="user-id"></span>
					</h3>
				</div>
				<div className="mid-info">
					<div className="members"></div>
					<div className="aside">
						{/* <div className="aside-wrapper">
							<span className="coppied">Coppied!</span>
							<div className="invite">
								<div>
									<span>Invite link:</span>
									<svg
										data-name="Layer 7"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 60 80"
									>
										<style>
											.svg-cls-1 {{
												fill: "#ffffff00",
												stroke: "#dff6d3",
												strokeMmiterlimit: "10",
												strokeWidth: "3px"
											}}
										</style>
										<rect
											className="svg-cls-1"
											x="1.5"
											y="21.14"
											width="35.08"
											height="45.86"
											rx="8.03"
											ry="8.03"
										/>
										<rect
											className="svg-cls-1"
											x="11.44"
											y="11.44"
											width="35.08"
											height="45.86"
											rx="8.03"
											ry="8.03"
										/>
									</svg>
								</div>
								<span className="invite-link"></span>
							</div>
							<button className="btn-ready"></button>
							<button className="btn-leave">Leave the game</button>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	)
}
