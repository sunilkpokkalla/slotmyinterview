"use client";

import { useEffect, useRef, useState } from "react";
import { Circle, Square, Trash2, Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { publicEnv } from "@/lib/env";
import { createVideoUploadUrl, deleteVideoPitch, saveVideoPitch } from "@/app/actions/video";
import { VIDEO_MAX_BYTES, VIDEO_MAX_SECONDS, VIDEO_MIME_TYPES } from "@/lib/video";
import { useAction } from "./shell";

/** Reads a video's duration in the browser. MediaRecorder WebM files report Infinity until seeked, so we nudge them. */
function readDuration(file: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      if (Number.isFinite(v.duration)) {
        URL.revokeObjectURL(url);
        resolve(v.duration);
      } else {
        v.currentTime = 1e7;
        v.ontimeupdate = () => {
          v.ontimeupdate = null;
          URL.revokeObjectURL(url);
          resolve(v.duration);
        };
      }
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this video file."));
    };
    v.src = url;
  });
}

export function VideoPitchUploader({ currentUrl, currentDuration }: { currentUrl: string | null; currentDuration: number | null }) {
  const { run, pending } = useAction();
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(VIDEO_MAX_SECONDS);
  const previewRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => stopStream(), []);

  function stopStream() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function upload(file: Blob, contentType: string) {
    setError("");
    setBusy(true);
    try {
      if (!(VIDEO_MIME_TYPES as readonly string[]).includes(contentType)) throw new Error("Upload an MP4, WebM or MOV video.");
      if (file.size > VIDEO_MAX_BYTES) throw new Error("Video must be 100 MB or smaller.");
      const duration = await readDuration(file);
      if (duration > VIDEO_MAX_SECONDS + 0.5) throw new Error(`Your video is ${Math.round(duration)} seconds. Keep it to ${VIDEO_MAX_SECONDS} seconds or less.`);

      setStatus("Preparing upload…");
      const signed = await createVideoUploadUrl({ contentType, size: file.size });
      if (!signed.ok) throw new Error(signed.error);

      setStatus("Uploading…");
      const { error: upErr } = await createSupabaseBrowserClient()
        .storage.from(publicEnv.videoBucket)
        .uploadToSignedUrl(signed.data.path, signed.data.token, file, { contentType });
      if (upErr) throw new Error("Upload failed. Please try again.");

      setStatus("");
      run(() => saveVideoPitch({ path: signed.data.path, durationSec: Math.max(1, Math.round(duration)) }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setStatus("");
    } finally {
      setBusy(false);
    }
  }

  async function startRecording() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
      streamRef.current = stream;
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
        previewRef.current.muted = true;
        await previewRef.current.play();
      }
      const mime = ["video/webm;codecs=vp9,opus", "video/webm", "video/mp4"].find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      recorder.onstop = () => {
        stopStream();
        setRecording(false);
        if (previewRef.current) previewRef.current.srcObject = null;
        const type = (recorder.mimeType || "video/webm").split(";")[0];
        void upload(new Blob(chunks, { type }), type);
      };
      recorderRef.current = recorder;
      recorder.start(1000);
      setRecording(true);
      setSecondsLeft(VIDEO_MAX_SECONDS);
      const startedAt = Date.now();
      timerRef.current = window.setInterval(() => {
        const left = VIDEO_MAX_SECONDS - Math.floor((Date.now() - startedAt) / 1000);
        setSecondsLeft(left);
        if (left <= 0) recorder.state === "recording" && recorder.stop();
      }, 250);
    } catch {
      setError("Camera or microphone access was blocked. Allow access in your browser, or upload a file instead.");
      stopStream();
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
        {recording ? (
          <video ref={previewRef} playsInline className="w-full h-full object-cover" />
        ) : currentUrl ? (
          <video key={currentUrl} src={currentUrl} controls playsInline preload="metadata" className="w-full h-full" />
        ) : (
          <>
            <video ref={previewRef} playsInline className="hidden" />
            <div className="text-center text-slate-400 text-sm p-6">
              <Video className="w-10 h-10 mx-auto mb-2 text-slate-500" />
              No video pitch yet. Record one here or upload a file (60 seconds max).
            </div>
          </>
        )}
      </div>

      {recording && (
        <div className="flex items-center justify-between rounded-xl bg-rose-50 border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700">
          <span className="flex items-center gap-2"><Circle className="w-3 h-3 fill-rose-600 animate-pulse" /> Recording</span>
          <span className="font-mono">{secondsLeft}s left</span>
        </div>
      )}

      {(status || error) && (
        <p role={error ? "alert" : "status"} className={`text-xs font-semibold ${error ? "text-rose-600" : "text-slate-600"}`}>
          {error || status}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {recording ? (
          <Button onClick={() => recorderRef.current?.stop()} className="bg-rose-600 hover:bg-rose-700 text-white text-xs">
            <Square className="w-3.5 h-3.5 mr-1.5" /> Stop and save
          </Button>
        ) : (
          <>
            <Button onClick={startRecording} disabled={busy || pending} className="bg-[#6B47ED] text-white text-xs">
              <Circle className="w-3.5 h-3.5 mr-1.5" /> {currentUrl ? "Re-record" : "Record pitch"}
            </Button>
            <label className={`inline-flex items-center h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-50 ${busy || pending ? "pointer-events-none opacity-50" : ""}`}>
              <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload file
              <input
                type="file"
                accept={VIDEO_MIME_TYPES.join(",")}
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (f) void upload(f, f.type);
                }}
              />
            </label>
            {currentUrl && (
              <Button variant="outline" disabled={busy || pending} onClick={() => run(() => deleteVideoPitch())} className="text-xs text-rose-600">
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove
              </Button>
            )}
          </>
        )}
      </div>
      {currentDuration ? <p className="text-[11px] text-slate-400">Current pitch: {currentDuration} seconds.</p> : null}
    </div>
  );
}
