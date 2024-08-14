import "./globals.scss"

import { Inter } from "next/font/google"
import type { Metadata } from "next"

var inter = Inter({ subsets: ["latin"] })

export var metadata: Metadata = {
	title: "The CABO game",
	description: "CABO game for 2-8 people",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={inter.className} suppressHydrationWarning={true}>
				{children}
			</body>
		</html>
	)
}
