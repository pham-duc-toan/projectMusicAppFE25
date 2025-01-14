interface Lyric {
  time: number;
  text: string;
}

const parseLrc = (lrcText: string): Lyric[] => {
  const lines = lrcText.split("\n");
  return lines
    .map((line) => {
      const timeMatch = line.match(/\[(\d+):(\d+\.\d+)]/);
      if (timeMatch) {
        const minutes = parseInt(timeMatch[1], 10);
        const seconds = parseFloat(timeMatch[2]);
        const timeInSeconds = minutes * 60 + seconds;
        const text = line.replace(/\[\d+:\d+\.\d+]/, "").trim();
        return { time: timeInSeconds, text };
      }
      return null;
    })
    .filter((line): line is Lyric => line !== null); // Từ chối giá trị null và đảm bảo rằng kết quả là mảng Lyric
};

export default parseLrc;
