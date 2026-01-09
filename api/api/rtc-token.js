import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import cors from "cors";

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERT = process.env.AGORA_APP_CERTIFICATE;

export default function handler(req, res) {
  cors()(req, res, () => {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    const { channel, uid, role } = req.body;

    if (!channel) {
      return res.status(400).json({ error: "Channel required" });
    }

    const agoraRole =
      role === "publisher"
        ? RtcRole.PUBLISHER
        : RtcRole.SUBSCRIBER;

    const expiration = 3600;
    const now = Math.floor(Date.now() / 1000);

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERT,
      channel,
      uid || 0,
      agoraRole,
      now + expiration
    );

    res.status(200).json({ token });
  });
}
