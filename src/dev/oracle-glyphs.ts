/**
 * Every printable glyph of ABC Oracle, as one string. Made from the cmap of
 * ABCOracleVariable.woff2 (fontTools) on 2026-11-02, without the spaces and
 * the combining marks. The gallery marks the glyphs of a face that are not
 * in this string: the browser takes them from a system font, and they look
 * different on each system.
 */
export const ORACLE_GLYPHS =
  '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĹĺĻļĽľĿŀŁłŃńŅņŇňŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžƏƒƠơƯưǍǎǏǐǑǒǓǔǢǣǦǧǴǵǺǻǼǽǾǿȘșȚțȦȧȲȳȷəʼˆˇ˘˙˚˛˜˝ΔΩμπ฿ḌḍḠḡḤḥḶḷṄṅṖṗṢṣṬṭẀẁẂẃẄẅẊẋẌẍẒẓẞẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹ‐–—―‘’‚“”„†‡•…‰′″‹›‼‽⁂⁄⁑⁰⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉₦₨₩₪₫€₮₴₸₺₽₿℅ℓ№℗™Ω⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅟ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅬⅭⅮⅯ←↑→↓↖↗↘↙∂∅∆∏∑−∕∙√∞∫≈≠≤≥〈〉①②③④⑤⑥⑦⑧⑨⓪⓿■□▲△▶▷▼▽◀◁◆◇◊○◌●♡♥❶❷❸❹❺❻❼❽❾⬛⬜《》「」『』【】〔〕ﬁﬂ';

/** True when ABC Oracle has the glyph of `ch`. A space is always fine. */
export const isOracleGlyph = (ch: string) => /\s/.test(ch) || ORACLE_GLYPHS.includes(ch);
