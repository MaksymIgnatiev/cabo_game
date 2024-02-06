import styles from "./page.module.css"
import { MainGame as MainGameComponent } from "@/components/MainGame"
import BlocksParent from "@/components/BlocksParent"
export default function Home() {
	return (
		<>
			<MainGameComponent />
			<BlocksParent />
		</>
	)
}
