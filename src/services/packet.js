export function createMessagePacket({
  senderId,
  targetId,
  text,
  language = "hi",
  priority = "normal",
}) {
  const uniqueId =
    "pkt_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7)
  return {
    packet_id: uniqueId,
    type: "MESSAGE",
    sender_id: senderId,
    target_id: targetId,
    timestamp: new Date().toISOString(),
    language,
    priority,
    text,
  }
}

export function createAckPacket({ senderId, targetId, refPacketId }) {
  const uniqueId =
    "ack_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7)
  return {
    packet_id: uniqueId,
    type: "ACK",
    ref_packet_id: refPacketId,
    sender_id: senderId,
    target_id: targetId,
    timestamp: new Date().toISOString(),
  }
}
