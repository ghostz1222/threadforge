import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

export async function saveDesign({ prompt, style, imageUrls, selectedImageUrl, tier }) {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("designs")
    .insert({
      user_id: user?.id || null,
      prompt,
      style,
      image_urls: imageUrls,
      selected_image_url: selectedImageUrl,
      tier,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to save design:", error.message);
    return null;
  }
  return data;
}

export async function getOrderByStripeSession(stripeSessionId) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", stripeSessionId)
    .single();

  if (error) return null;
  return data;
}

export async function getOrderById(orderId) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) return null;
  return data;
}

export async function signInWithEmail(email) {
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) return { error: error.message };
  return { success: true };
}

export async function getCurrentUser() {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
