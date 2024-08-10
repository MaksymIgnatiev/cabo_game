import { colorText } from "../../../functions"

export const HEX_CHARS = "０１２３４５６７８９ａｂｃｄｅｆＡＢＣＤＥＦ",
	INFO_SECTION = colorText("[INFO]", "#ac0"),
	WARN_SECTION = colorText("[WARN]", "#cc0"),
	ERROR_SECTION = colorText("[ERROR]", "#c00"),
	LOG_SECTION = colorText("[LOG]", "#0cc")

console.log(INFO_SECTION)
console.log(WARN_SECTION)
console.log(ERROR_SECTION)
console.log(LOG_SECTION)
