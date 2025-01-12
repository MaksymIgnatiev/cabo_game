import { colorText } from "../../../functions";

export var HEX_CHARS = "０１２３４５６７８９ａｂｃｄｅｆＡＢＣＤＥＦ" as const,
  INFO_SECTION = colorText("[INFO]", "#09c"),
  WARN_SECTION = colorText("[WARN]", "#cc0"),
  ERROR_SECTION = colorText("[ERROR]", "#c00"),
  LOG_SECTION = colorText("[LOG]", "#ccc");
