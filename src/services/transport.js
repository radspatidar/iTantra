/**
 * TransportService - Offline Peer-to-Peer Mesh Transport Abstraction
 * Supports BroadcastChannel for real-time multi-window / multi-tab / local P2P device messaging,
 * with fallback device discovery for single-instance simulation.
 */

class TransportService {
  constructor() {
    this.deviceId = "Field Unit 1"
    this.connectedDevice = null
    this.connectionStatus = "disconnected" // 'disconnected' | 'connecting' | 'connected'
    this.transportType = "BLE" // 'BLE' | 'WiFi Direct'
    this.listeners = {
      packet: [],
      ack: [],
      status: [],
      devices: [],
    }
    this.channel = null
    this.heartbeatTimer = null
    this.discoveredDevicesMap = new Map()
    this.isInitialized = false
  }

  init(deviceId = "Field Unit 1") {
    this.deviceId = deviceId
    if (this.isInitialized) return
    this.isInitialized = true

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel("itantra_mesh_p2p_channel")
      this.channel.onmessage = (e) => this._handleIncomingBusEvent(e.data)
    }

    // Announce online presence
    this.announcePresence()
    this.startHeartbeat()
  }

  setDeviceId(id) {
    this.deviceId = id
    this.announcePresence()
  }

  setTransportType(t) {
    this.transportType = t
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback)
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback,
      )
    }
  }

  _notify(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(data))
    }
  }

  announcePresence() {
    this._broadcastBusEvent({
      type: "ANNOUNCE_PRESENCE",
      sender_id: this.deviceId,
      transport: this.transportType,
      timestamp: Date.now(),
    })
  }

  startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer)
    this.heartbeatTimer = setInterval(() => {
      this.announcePresence()
    }, 5000)
  }

  discoverDevices() {
    this.announcePresence()
    // Return list of discovered active devices + standard fallback units
    const baseUnits = ["Field Unit 1", "Field Unit 2", "Field Unit 3"]
    const activeDiscovered = Array.from(this.discoveredDevicesMap.keys())
    const combined = Array.from(
      new Set([...activeDiscovered, ...baseUnits]),
    ).filter((id) => id !== this.deviceId)
    return combined
  }

  connect(targetDeviceId) {
    this.connectionStatus = "connecting"
    this._notify("status", { status: "connecting", device: targetDeviceId })

    // Send connection request
    this._broadcastBusEvent({
      type: "CONNECT_REQUEST",
      sender_id: this.deviceId,
      target_id: targetDeviceId,
      transport: this.transportType,
    })

    // Simulate successful handshake (immediate or fallback timeout)
    setTimeout(() => {
      this.connectionStatus = "connected"
      this.connectedDevice = targetDeviceId
      this._notify("status", { status: "connected", device: targetDeviceId })
    }, 1200)
  }

  disconnect() {
    if (this.connectedDevice) {
      this._broadcastBusEvent({
        type: "DISCONNECT_NOTICE",
        sender_id: this.deviceId,
        target_id: this.connectedDevice,
      })
    }
    this.connectionStatus = "disconnected"
    this.connectedDevice = null
    this._notify("status", { status: "disconnected", device: null })
  }

  sendPacket(packet) {
    if (this.connectionStatus !== "connected") {
      console.warn("TransportService: Cannot send packet, device disconnected")
    }
    // Broadcast over channel
    this._broadcastBusEvent({
      type: "DATA_PACKET",
      sender_id: this.deviceId,
      target_id: this.connectedDevice,
      packet,
    })
  }

  sendAck(ackPacket) {
    this._broadcastBusEvent({
      type: "ACK_PACKET",
      sender_id: this.deviceId,
      target_id: this.connectedDevice,
      ackPacket,
    })
  }

  _broadcastBusEvent(payload) {
    if (this.channel) {
      try {
        this.channel.postMessage(payload)
      } catch (err) {
        console.error("BroadcastChannel error:", err)
      }
    }
  }

  _handleIncomingBusEvent(data) {
    if (!data || data.sender_id === this.deviceId) return // Ignore own messages

    switch (data.type) {
      case "ANNOUNCE_PRESENCE": {
        this.discoveredDevicesMap.set(data.sender_id, Date.now())
        this._notify("devices", this.discoverDevices())
        break
      }
      case "CONNECT_REQUEST": {
        if (data.target_id === this.deviceId) {
          // Accept connection request from remote phone
          this.connectionStatus = "connected"
          this.connectedDevice = data.sender_id
          this._notify("status", {
            status: "connected",
            device: data.sender_id,
          })

          // Send confirmation back
          this._broadcastBusEvent({
            type: "CONNECT_ACCEPT",
            sender_id: this.deviceId,
            target_id: data.sender_id,
          })
        }
        break
      }
      case "CONNECT_ACCEPT": {
        if (data.target_id === this.deviceId) {
          this.connectionStatus = "connected"
          this.connectedDevice = data.sender_id
          this._notify("status", {
            status: "connected",
            device: data.sender_id,
          })
        }
        break
      }
      case "DISCONNECT_NOTICE": {
        if (
          data.target_id === this.deviceId ||
          this.connectedDevice === data.sender_id
        ) {
          this.connectionStatus = "disconnected"
          this.connectedDevice = null
          this._notify("status", { status: "disconnected", device: null })
        }
        break
      }
      case "DATA_PACKET": {
        if (!data.target_id || data.target_id === this.deviceId) {
          this._notify("packet", data.packet)
        }
        break
      }
      case "ACK_PACKET": {
        if (!data.target_id || data.target_id === this.deviceId) {
          this._notify("ack", data.ackPacket)
        }
        break
      }
      default:
        break
    }
  }
}

export const transportService = new TransportService()
