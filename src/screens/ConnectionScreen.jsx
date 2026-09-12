import { useState, useEffect } from "react"
import { transportService } from "../services/transport"

function SignalBars({ strength }) {
  const active = strength === "strong" ? 3 : strength === "medium" ? 2 : 1
  return (
    <div className="flex items-end gap-0.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-1 rounded-sm ${
            i <= active ? "bg-teal-500" : "bg-slate-600"
          }`}
          style={{ height: `${i * 4 + 4}px` }}
        />
      ))}
    </div>
  )
}

export default function ConnectionScreen({
  transport,
  setTransport,
  connectedDevice,
  connectionStatus,
  onConnect,
  onDisconnect,
  dark,
  deviceId,
  setDeviceId,
}) {
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [nearbyDevices, setNearbyDevices] = useState(() =>
    transportService.discoverDevices(),
  )

  useEffect(() => {
    const handleDevicesUpdate = (devs) => {
      setNearbyDevices(devs)
    }
    transportService.on("devices", handleDevicesUpdate)
    const interval = setInterval(() => {
      setNearbyDevices(transportService.discoverDevices())
    }, 3000)
    return () => {
      transportService.off("devices", handleDevicesUpdate)
      clearInterval(interval)
    }
  }, [])

  const card = dark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200"
  const text = dark ? "text-slate-100" : "text-slate-900"
  const muted = dark ? "text-slate-400" : "text-slate-500"
  const divider = dark ? "border-slate-700" : "border-slate-200"

  return (
    <div
      className={`flex flex-col h-full ${
        dark ? "bg-[#0F172A]" : "bg-[#F0F4F8]"
      }`}
    >
      <div
        className={`flex-shrink-0 px-5 pt-5 pb-4 border-b ${divider} ${
          dark ? "bg-slate-900" : "bg-white"
        }`}
      >
        <h1 className={`text-xl font-bold ${text}`}>Connection</h1>
        <p className={`text-xs mt-0.5 ${muted}`}>
          Offline peer-to-peer · No internet required
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 flex flex-col gap-3 scroll-smooth">
        {/* Device Identity Selector */}
        <div className={`rounded-2xl border ${card} p-4`}>
          <p
            className={`text-[11px] font-bold tracking-widest uppercase mb-2 ${muted}`}
          >
            This Phone's Identity
          </p>
          <div className="flex gap-2">
            {["Field Unit 1", "Field Unit 2", "Field Unit 3"].map((id) => (
              <button
                key={id}
                onClick={() => {
                  setDeviceId(id)
                  transportService.setDeviceId(id)
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  deviceId === id
                    ? "bg-teal-600 text-white shadow"
                    : dark
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Transport selector */}
        <div className={`rounded-2xl border ${card} p-4`}>
          <p
            className={`text-[11px] font-bold tracking-widest uppercase mb-3 ${muted}`}
          >
            Transport Protocol
          </p>
          <div className="flex gap-2">
            {["BLE", "WiFi Direct"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTransport(t)
                  transportService.setTransportType(t)
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  transport === t
                    ? "bg-teal-600 text-white shadow"
                    : dark
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {t === "BLE" ? "🔵 Bluetooth" : "📶 Wi-Fi Direct"}
              </button>
            ))}
          </div>
          <p className={`text-[11px] mt-2 ${muted}`}>
            {transport === "BLE"
              ? "Bluetooth Low Energy — short range, low power"
              : "Wi-Fi Direct — medium range, higher throughput"}
          </p>
        </div>

        {/* Current connection */}
        <div className={`rounded-2xl border ${card} p-4`}>
          <p
            className={`text-[11px] font-bold tracking-widest uppercase mb-3 ${muted}`}
          >
            Connected Device
          </p>
          {connectionStatus === "connected" && connectedDevice ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className={`text-base font-bold ${text}`}>
                    {connectedDevice}
                  </p>
                  <p className={`text-xs ${muted}`}>
                    {transport} · Strong Signal
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <SignalBars strength="strong" />
                  <span className="text-xs font-semibold text-green-500">
                    Connected
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-green-500 text-sm font-semibold">
                  Active Mesh Connection
                </span>
              </div>
              <button
                onClick={onDisconnect}
                className={`w-full py-3 rounded-xl text-sm font-semibold border-2 border-red-500 text-red-500 transition-all active:scale-95 ${
                  dark ? "bg-red-950/20" : "bg-red-50"
                }`}
              >
                Disconnect
              </button>
            </div>
          ) : connectionStatus === "connecting" ? (
            <div className="flex items-center gap-3 py-2">
              <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <span className={`text-sm ${muted}`}>
                Connecting to {selectedDevice || "device"}...
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 py-2">
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <span className={`text-sm ${muted}`}>No device connected</span>
            </div>
          )}
        </div>

        {/* Nearby devices */}
        <div className={`rounded-2xl border ${card} p-4`}>
          <p
            className={`text-[11px] font-bold tracking-widest uppercase mb-3 ${muted}`}
          >
            Nearby Devices · {transport}
          </p>
          <div className="flex flex-col gap-2">
            {nearbyDevices.map((device, i) => {
              const strengths = ["strong", "medium", "weak"]
              const isConnected =
                connectedDevice === device && connectionStatus === "connected"
              return (
                <div
                  key={device}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    isConnected
                      ? "border-teal-500 " +
                        (dark ? "bg-teal-950/30" : "bg-teal-50")
                      : dark
                        ? "border-slate-700 bg-slate-700/50"
                        : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-slate-400"
                      }`}
                    />
                    <div>
                      <p className={`text-sm font-semibold ${text}`}>
                        {device}
                      </p>
                      <p className={`text-[11px] ${muted}`}>
                        {transport} · Available
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <SignalBars strength={strengths[i % 3]} />
                    {!isConnected && connectionStatus !== "connecting" && (
                      <button
                        onClick={() => {
                          setSelectedDevice(device)
                          onConnect(device)
                        }}
                        className="ml-2 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold active:scale-95 transition-all"
                      >
                        Connect
                      </button>
                    )}
                    {isConnected && (
                      <span className="text-xs font-semibold text-teal-600 ml-2">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Info note */}
        <div
          className={`rounded-xl p-3 ${
            dark ? "bg-slate-800/50" : "bg-blue-50"
          } border ${dark ? "border-slate-700" : "border-blue-200"}`}
        >
          <p
            className={`text-[11px] leading-relaxed ${
              dark ? "text-slate-400" : "text-blue-700"
            }`}
          >
            <span className="font-bold">Offline P2P Mesh:</span> Communication
            operates over local Bluetooth Low Energy / Wi-Fi Direct transport.
            No internet connection or cloud servers are required.
          </p>
        </div>
      </div>
    </div>
  )
}
