import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {

    const decodedToken = await adminAuth.verifyIdToken(token);
    const { uid, role } = decodedToken;

    const userDoc = await adminDB.collection("users").doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const userData = userDoc.data();

    return res.status(200).json({
      uid,
      name: userData?.name ?? null,
      email: userData?.email ?? null,
      role: role ?? userData?.role ?? "user", 
    });
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}


