import React from "react"

type Props = {
	text: string
	className: string
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function Button({ text, className, onClick }: Props) {
	return (
		<button
			className={`start-page-button ui-button ${className}`}
			style={{ "--content": `'${text}'` } as React.CSSProperties}
			onClick={onClick}
		>
			{text}
		</button>
	)
}
