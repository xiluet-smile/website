// Transcodes a video for the site with macOS AVFoundation (no ffmpeg needed):
//   swift scripts/transcode-video.swift "input.mov" public/videos/name.mp4 960 540 1400000 [maxSeconds]
// H.264 MP4, no audio, fitted inside width x height, orientation preserved. ~1.4 Mbps keeps a 30 s clip near 5 MB.
import AVFoundation
import Foundation

// Usage: swift transcode.swift <in> <out.mp4> <width> <height> <bitrate> [maxSeconds]
let args = CommandLine.arguments
let inURL = URL(fileURLWithPath: args[1]), outURL = URL(fileURLWithPath: args[2])
let width = Int(args[3])!, height = Int(args[4])!, bitrate = Int(args[5])!
let maxSeconds = args.count > 6 ? Double(args[6])! : 0
try? FileManager.default.removeItem(at: outURL)

let asset = AVURLAsset(url: inURL)
let sem = DispatchSemaphore(value: 0)
Task {
  let tracks = try await asset.loadTracks(withMediaType: .video)
  let track = tracks[0]
  let (natural, transform, nominalFPS, duration) = try await (track.load(.naturalSize), track.load(.preferredTransform), track.load(.nominalFrameRate), asset.load(.duration))
  // Oriented size after the track transform (phone videos are often rotated).
  let oriented = natural.applying(transform)
  let srcW = abs(oriented.width), srcH = abs(oriented.height)
  print("source \(Int(srcW))x\(Int(srcH)) @ \(nominalFPS) fps, \(CMTimeGetSeconds(duration))s")

  let reader = try AVAssetReader(asset: asset)
  let readerOut = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange])
  readerOut.alwaysCopiesSampleData = false
  reader.add(readerOut)
  if maxSeconds > 0 { reader.timeRange = CMTimeRange(start: .zero, duration: CMTime(seconds: maxSeconds, preferredTimescale: 600)) }

  let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
  // Target size keeps the source aspect, fitted inside width x height, even dimensions.
  let scale = min(Double(width) / srcW, Double(height) / srcH)
  let outW = Int((srcW * scale) / 2) * 2, outH = Int((srcH * scale) / 2) * 2
  let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: outW, AVVideoHeightKey: outH,
    AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
    AVVideoCompressionPropertiesKey: [
      AVVideoAverageBitRateKey: bitrate,
      AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
      AVVideoMaxKeyFrameIntervalKey: 60,
      AVVideoAllowFrameReorderingKey: true,
      AVVideoExpectedSourceFrameRateKey: Int(nominalFPS.rounded()),
    ],
  ]
  let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
  input.expectsMediaDataInRealTime = false
  // Bake the orientation in: writer gets upright frames when we pass the transform through.
  input.transform = transform
  writer.add(input)
  writer.shouldOptimizeForNetworkUse = true
  guard writer.startWriting(), reader.startReading() else { print("start failed", writer.error ?? "", reader.error ?? ""); exit(1) }
  writer.startSession(atSourceTime: .zero)
  let q = DispatchQueue(label: "write")
  input.requestMediaDataWhenReady(on: q) {
    while input.isReadyForMoreMediaData {
      if reader.status != .reading {
        print("reader status \(reader.status.rawValue)", reader.error ?? "")
        input.markAsFinished(); writer.finishWriting { sem.signal() }; return
      }
      if let sb = readerOut.copyNextSampleBuffer() {
        if !input.append(sb) { print("append failed", writer.error ?? ""); input.markAsFinished(); writer.finishWriting { sem.signal() }; return }
      }
      else {
        input.markAsFinished()
        writer.finishWriting { print("done \(outW)x\(outH), status \(writer.status.rawValue)", writer.error ?? ""); sem.signal() }
        return
      }
    }
  }
}
sem.wait()
