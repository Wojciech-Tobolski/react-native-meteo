export function nowToHHMM() {
  const d = new Date();
  return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`; //padStart dodaje 0 na początku gdy jest get minutes zwraca od 0 do 9
}
