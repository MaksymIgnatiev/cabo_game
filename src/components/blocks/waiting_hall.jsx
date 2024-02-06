import React from "react"

export default function waiting_hall() {
	return (
		<div class="waiting">
			<div class="waiting-wrapper">
				<div class="top-info">
					<h2>Waiting hall</h2>
					<h3>
						<span class="room-id"></span>
						<span class="user-id"></span>
					</h3>
				</div>
				<div class="mid-info">
					<div class="members"></div>
					<div class="aside">
						{/* <div class="aside-wrapper">
							<span class="coppied">Coppied!</span>
							<div class="invite">
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
											class="svg-cls-1"
											x="1.5"
											y="21.14"
											width="35.08"
											height="45.86"
											rx="8.03"
											ry="8.03"
										/>
										<rect
											class="svg-cls-1"
											x="11.44"
											y="11.44"
											width="35.08"
											height="45.86"
											rx="8.03"
											ry="8.03"
										/>
									</svg>
								</div>
								<span class="invite-link"></span>
							</div>
							<button class="btn-ready"></button>
							<button class="btn-leave">Leave the game</button>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	)
}
