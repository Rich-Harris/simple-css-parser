export const whitespace = /\s/;
export const element = /^(?:\*|[a-z_][a-z0-9\-_]*)/i;
export const universalKeywords = /(?:auto|inherit|initial|unset)/i;
export const percentage = /[\-\+]?(?:\d?\.\d+|\d+)%/i;
export const length = /[\-\+]?(?:\d?\.\d+|\d+)(?:em|ex|px|cm|mm|in|pt|pc|rem|vh|vw|vmin|vmax|q)/i;
export const number = /[\-\+]?(?:\d?\.\d+|\d+)/;
export const angle = /[\-\+]?(?:\d?\.\d+|\d+)(?:deg|rad|grad)/;
export const time = /[\-\+]?(?:\d?\.\d+|\d+)m?s/;
export const frequency = /[\-\+]?(?:\d?\.\d+|\d+)k?hz/;