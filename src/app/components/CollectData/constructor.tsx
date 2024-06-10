import "../../scss/collectDataConstructor.scss"

import { CollectDataCostructorParams } from "@/types"
import { useRef } from "react"

export default function Constructor({
	ariaData,
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

	return (
		<div className="layer" aria-data={ariaData}>
			<div className="layer-data-wrapper">
				<h2>{title}</h2>
				<form onSubmit={handleSubmit}>
					<div className="input-container">
						<input
							ref={inputRef}
							className="ui-input"
							type="text"
							placeholder={inputPlaseholder}
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
					<button type="submit" className="ui-button">
						{buttonText}
					</button>
				</form>
			</div>
		</div>
	)
}
