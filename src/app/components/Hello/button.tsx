type Props = {
	text: string
	className: string
}

export default function button({ text, className }: Props) {
	const selector = `${className}-start-page-button`
	return (
		<>
			<style>{`
			#${selector} {
				--content: '${text}';
			}
			#${selector}::after {
				content: var(--content);
			}
			`}</style>
			<button
				id={selector}
				className={`start-page-button ui-button ${className}`}
			>
				{text}
			</button>
		</>
	)
}
