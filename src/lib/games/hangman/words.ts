export const categories = {
    Teknologi: ["SVELTE", "JAVASCRIPT", "TYPESCRIPT", "GITHUB", "HTML", "CSS", "MONGODB", "REACT", "NODEJS", "EXPRESS"],
    Makanan: ["NASI", "SATE", "SOP", "KENTANG", "AYAM", "IKAN", "DAGING", "TELUR"],
    Olahraga: ["SEPAKBOLA", "BASKET", "BADMINTON", "TENIS", "VOLI", "ATLETIK", "RENANG"],
    Hewan: ["KUCING", "ANJING", "BURUNG", "KELINCI", "SINGA", "HARIMAU", "Gajah"],
    Buah: ["APEL", "MANGGA", "ANGGUR", "DURIAN"],
    Negara: ["INDONESIA", "JEPANG", "KANADA", "BRASIL"]
};

export function getRandomWord(category: keyof typeof categories): string {
    const words = categories[category];
    return words[Math.floor(Math.random() * words.length)];
}