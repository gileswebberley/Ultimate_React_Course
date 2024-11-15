//Thanks to sandeep on udemy for this little function
function flagemojiToPNG(flag) {
  const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join('');
  return `https://flagcdn.com/24x18/${countryCode}.png`;
}

export default flagemojiToPNG;
