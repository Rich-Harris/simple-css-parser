export const whitespace = /\s/;
export const element = /^(?:\*|[a-z][a-z0-9\-]*)/i;
export const universalKeywords = /(?:auto|inherit|initial|unset)/i;
export const percentage = /[\-\+]?(?:\d?\.\d+|\d+)%/i;
export const length = /[\-\+]?(?:\d?\.\d+|\d+)(?:em|ex|px|cm|mm|in|pt|pc|rem|vh|vw|vmin|vmax|q)/i;
export const number = /[\-\+]?(?:\d?\.\d+|\d+)/;