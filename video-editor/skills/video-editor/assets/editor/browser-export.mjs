// Record the current decoded mix, never the pre-rendered sample movie.
export async function exportBrowserMP4({
  video,
  buffer,
  context,
  onProgress,
  signal,
}) {
  const mimeType = [
    "video/mp4;codecs=avc1.42001E,mp4a.40.2",
    "video/mp4;codecs=avc1.424028,mp4a.40.2",
    "video/mp4",
  ].find((type) => globalThis.MediaRecorder?.isTypeSupported(type));
  if (!mimeType)
    throw Error(
      "This browser cannot encode MP4. Open the local studio for MP4 export.",
    );
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const paint = canvas.getContext("2d");
  const destination = context.createMediaStreamDestination();
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(destination);
  const stream = canvas.captureStream(30);
  destination.stream
    .getAudioTracks()
    .forEach((track) => stream.addTrack(track));
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 12000000,
    audioBitsPerSecond: 192000,
  });
  const chunks = [];
  const loop = video.loop,
    at = video.currentTime;
  let frame,
    timer,
    started = false,
    timedOut = false;
  const draw = () => {
    paint.drawImage(video, 0, 0, canvas.width, canvas.height);
    onProgress(video.currentTime / video.duration);
    frame = requestAnimationFrame(draw);
  };
  try {
    await context.resume();
    // Audio devices may need several hundred milliseconds to start their clock.
    // Warm it before the recorder/video start so AAC does not lose that interval.
    const clockStart = context.currentTime;
    const warmDeadline = performance.now() + 5000;
    while (context.currentTime - clockStart < 0.08) {
      if (signal.aborted)
        throw new DOMException("Export canceled", "AbortError");
      if (performance.now() > warmDeadline)
        throw Error("Audio device did not start. Try export again.");
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    video.pause();
    video.loop = false;
    if (video.currentTime !== 0)
      await new Promise((resolve, reject) => {
        const done = () => {
          clearTimeout(timeout);
          video.removeEventListener("seeked", done);
          resolve();
        };
        const timeout = setTimeout(() => {
          video.removeEventListener("seeked", done);
          reject(Error("Could not rewind video for export."));
        }, 10000);
        video.addEventListener("seeked", done);
        video.currentTime = 0;
      });
    if (signal.aborted) throw new DOMException("Export canceled", "AbortError");
    const result = new Promise((resolve, reject) => {
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      recorder.onstop = () => {
        if (timedOut)
          reject(
            Error("Export timed out. Keep this tab visible and try again."),
          );
        else if (signal.aborted)
          reject(new DOMException("Export canceled", "AbortError"));
        else resolve(new Blob(chunks, { type: "video/mp4" }));
      };
      recorder.onerror = () => reject(Error("MP4 encoding failed."));
    });
    // Install failure handling before asynchronous playback can reject.
    result.catch(() => {});
    const finish = () => {
      if (recorder.state !== "inactive") recorder.stop();
    };
    video.addEventListener("ended", finish, { once: true });
    signal.addEventListener("abort", finish, { once: true });
    try {
      paint.drawImage(video, 0, 0, canvas.width, canvas.height);
      recorder.start(500);
      // Start both clocks together; awaiting play first can trim the audio tail.
      const playing = video.play();
      source.start();
      started = true;
      await playing;
      draw();
      timer = setTimeout(
        () => {
          timedOut = true;
          finish();
        },
        (video.duration + 30) * 1000,
      );
      return await result;
    } finally {
      video.removeEventListener("ended", finish);
      signal.removeEventListener("abort", finish);
    }
  } finally {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    if (recorder.state !== "inactive") recorder.stop();
    if (started) source.stop();
    source.disconnect();
    destination.disconnect();
    stream.getTracks().forEach((track) => track.stop());
    video.pause();
    video.loop = loop;
    video.currentTime = at;
  }
}
