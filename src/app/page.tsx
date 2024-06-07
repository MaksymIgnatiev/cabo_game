import "./scss/main.scss"

import Loading from "./components/Loading"
import Start from "./components/Start"
import Transition from "./components/Transition"
import { HomePageComponentParams } from "./types"

export default function Home({ id }: HomePageComponentParams) {
	const userName = localStorage.getItem("userName"),
		userID = localStorage.getItem("userID"),
		roomID = localStorage.getItem("roomID")

	return (
		<>
			<Start />
			<Loading />
			<Transition />
		</>
	)
}
