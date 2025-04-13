"use server";

import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/shared/utils/encryption";
import { getCurrentUser } from "@/entities/user/hooks/current-user";

// Store the API key in an encrypted cookie
export async function storeApiKey(apiKey: string) {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return { error: "Debe de iniciar session" };
    }

    // Encrypt the API key before storing
    const encryptedKey = encrypt(apiKey);

    // Store in a cookie with user-specific name
    (
      await // Store in a cookie with user-specific name
      cookies()
    ).set(`google_ai_key_${currentUser.id}`, encryptedKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Error storing API key:", error);
    return { error: "Failed to store API key" };
  }
}

// Retrieve the API key from the cookie
export async function getApiKey() {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return { apiKey: null };
    }

    const encryptedKey = (await cookies()).get(
      `google_ai_key_${currentUser.id}`
    )?.value;

    if (!encryptedKey) {
      return { apiKey: null };
    }

    // Decrypt the API key
    const apiKey = decrypt(encryptedKey);

    return { apiKey };
  } catch (error) {
    console.error("Error retrieving API key:", error);
    return { apiKey: null };
  }
}

// Delete the API key
export async function deleteApiKey() {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return { error: "User not authenticated" };
    }

    (await cookies()).delete(`google_ai_key_${currentUser.id}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting API key:", error);
    return { error: "Failed to delete API key" };
  }
}
