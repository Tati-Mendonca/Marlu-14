import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const requester = await adminAuth.verifyIdToken(token);
    const requesterUID = requester.uid;

    // 🔥 BUSCAR A ROLE DO FIRESTORE (e não só da custom claim)
    const requesterDoc = await adminDB.collection("users").doc(requesterUID).get();
    const requesterData = requesterDoc.data();

    if (requesterData?.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { uid, newRole } = req.body;
    if (!uid || !newRole) {
      return res.status(400).json({ error: "Missing uid or newRole" });
    }

    // Atualiza custom claim do Firebase
    await adminAuth.setCustomUserClaims(uid, { role: newRole });

    // Atualiza no Firestore
    await adminDB.collection("users").doc(uid).update({ role: newRole });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao definir role:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

