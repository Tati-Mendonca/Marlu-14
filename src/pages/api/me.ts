import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDB.collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ uid: decodedToken.uid, ...userDoc.data() });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

