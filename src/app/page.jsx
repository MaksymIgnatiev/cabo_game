import styles from "./page.module.css"
import MainGame from "@/components/MainGame"
import BlocksParent from "@/components/BlocksParent"
export default function Home() {
	return (
		<>
			<h1>hello world</h1>
			<MainGame></MainGame>
			<BlocksParent></BlocksParent>
		</>
	)
}
