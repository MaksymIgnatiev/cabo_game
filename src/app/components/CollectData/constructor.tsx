import "../../scss/collectDataConstructor.scss"

import { useEffect, useRef } from "react"

import { CollectDataCostructorParams } from "@/../types"

export default function Constructor({
	ariaLabel,
	title,
	inputPlaseholder,
	buttonText,
	errorText,
	onSubmit,
}: CollectDataCostructorParams) {
	const inputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		if (inputRef.current) onSubmit(inputRef.current.value)
	}
	useEffect(() => {
		if (inputRef.current) inputRef.current.focus()
	}, [])

	return (
		<div className="layer" aria-label={ariaLabel}>
			<div className="layer-data-wrapper">
				<h2>{title}</h2>
				<form onSubmit={handleSubmit}>
					<div className="input-container">
						<input
							ref={inputRef}
							className="ui-input default-green"
							type="text"
							placeholder={inputPlaseholder}
							spellCheck={false}
							autoCorrect="off"
						/>
						<p
							className={`collect-data-input-error-text ${
								errorText
									? "collect-data-input-error-active"
									: ""
							}`}
						>
							{errorText}
						</p>
					</div>
					<button type="submit" className="ui-button default-green">
						{buttonText}
					</button>
				</form>
			</div>
		</div>
	)
}
