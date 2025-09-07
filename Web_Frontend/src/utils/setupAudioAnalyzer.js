export default function setupAudioAnalyser(socketId, stream, setParticipants, threshold = 40, delay = 200) {
  if (!stream) return;

  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  source.connect(analyser);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  let lastUpdate = 0;
  let rafId = null; // initialize safely

  const checkVolume = () => {
    analyser.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    const now = Date.now();
    if (now - lastUpdate > delay) {
      setParticipants((prev) =>
        prev.map((p) =>
          p._id === socketId ? { ...p, isSpeaking: volume > threshold } : p
        )
      );
      lastUpdate = now;
    }

    rafId = requestAnimationFrame(checkVolume);
  };

  checkVolume();

  return () => {
    if (rafId) cancelAnimationFrame(rafId); // safe cancel
    audioCtx.close();
  };
}
