import SwitchPage from "./blocks/switch_page"
import WaitingHall from "./blocks/waiting_hall"
import Start from "./blocks/start"
import CreateNewName from "./blocks/create_new_name"
import Greeting from "./blocks/greeting"
import Settings from "./blocks/settings"

const USER_NAME_KEY = "user_name"
const USER_ROOM_KEY = "user_room"
const USER_ID_KEY = "user_ID"

export default function blocksParent() {
	return (
		<div style={{border: "10px solid red"}}>
			<Settings />
			<Greeting />
			<CreateNewName />
			<SwitchPage />
			<WaitingHall />
			<Start />
		</div>
	)
}
