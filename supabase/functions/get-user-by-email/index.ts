import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Auth: verify caller identity ──────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return jsonResponse({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Resolve caller from JWT
    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller }, error: authError } = await anonClient.auth.getUser();
    if (authError || !caller) return jsonResponse({ error: "Unauthorized" }, 401);

    // ── RBAC: caller must be admin ────────────────────────────
    // Use service-role client to bypass RLS safely (no recursion)
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: roleRow } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) return jsonResponse({ error: "Forbidden: admin role required" }, 403);

    // ── Parse & validate body ─────────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    // ── Mode 1: { email } → { user_id, email } ───────────────
    if (typeof body.email === "string") {
      const email = body.email.trim().toLowerCase();
      if (!email) return jsonResponse({ error: "email must not be empty" }, 400);

      const { data: { users }, error } = await adminClient.auth.admin.listUsers();
      if (error) throw error;

      const found = users.find((u) => u.email?.toLowerCase() === email);
      if (!found) return jsonResponse({ error: "User not found" }, 404);

      return jsonResponse({ user_id: found.id, email: found.email });
    }

    // ── Mode 2: { user_ids: uuid[] } → [{ user_id, email }] ──
    if (Array.isArray(body.user_ids)) {
      const ids = body.user_ids as unknown[];

      // Validate each entry is a non-empty string (UUID format)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const invalid = ids.find((id) => typeof id !== "string" || !uuidRegex.test(id));
      if (invalid !== undefined) {
        return jsonResponse({ error: "user_ids must be an array of valid UUIDs" }, 400);
      }

      const { data: { users }, error } = await adminClient.auth.admin.listUsers();
      if (error) throw error;

      const userMap = new Map(users.map((u) => [u.id, u.email ?? null]));

      const result = (ids as string[]).map((uid) => ({
        user_id: uid,
        email: userMap.get(uid) ?? null,
      }));

      return jsonResponse(result);
    }

    return jsonResponse({ error: "Provide 'email' (string) or 'user_ids' (uuid[])" }, 400);

  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return jsonResponse({ error: message }, 500);
  }
});
