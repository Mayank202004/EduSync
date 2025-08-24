//taken from: https://dev.to/marcoslooten/creating-avatars-with-colors-using-the-modulus-41g7

const colors: string[] = [
  "#00AA55", "#009FD4", "#B381B3",
  "#939393", "#E3BC00", "#D47500", "#DC2A2A"
];

function numberFromText(text: string): number {
  const charCodes = Array.from(text)
    .map(char => char.charCodeAt(0))
    .join('');
  return parseInt(charCodes.slice(0, 15), 10); // limit to avoid overflow
}

export default function colorFromName(fullName: string): string {
  const index = numberFromText(fullName) % colors.length;
  return colors[index];
}