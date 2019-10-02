export function shortenText(text) {
  if (text.length < 4) {
    return text;
  }

  return `${text.substr(0, 4)}...`;
}
