//Thanks to sandeep on udemy for this little function
function flagemojiToPNG(flag) {
  if (!flag) {
    console.log('flagemojiToPNG has been called with an undefined value');
    return '';
  }
  const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join('');
  return `https://flagcdn.com/24x18/${countryCode}.png`;
}

//poped this in here as it's so closely related
function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export { flagemojiToPNG, convertToEmoji };
