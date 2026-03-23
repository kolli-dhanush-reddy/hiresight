import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "No Authorization header" }, 401);

    // Use service role client to verify the caller's JWT
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Get user from the JWT token passed in Authorization header
    const jwt = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authError } = await admin.auth.getUser(jwt);
    if (authError || !caller) return json({ error: `Unauthorized: ${authError?.message}` }, 401);

    // Check caller is admin
    const { data: roleRow, error: roleError } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) return json({ error: `Role check failed: ${roleError.message}` }, 500);
    if (!roleRow) return json({ error: "Forbidden: admin only" }, 403);

    const body = await req.json();

    // Mode 1: lookup by email
    if (typeof body.email === "string") {
      const email = body.email.trim().toLowerCase();
      const { data: { users }, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
      if (error) return json({ error: error.message }, 500);
      const found = users.find((u) => u.email?.toLowerCase() === email);
      if (!found) return json({ error: "User not found" }, 404);
      return json({ user_id: found.id, email: found.email });
    }

    // Mode 2: lookup by user_ids
    if (Array.isArray(body.user_ids)) {
      const { data: { users }, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
      if (error) return json({ error: error.message }, 500);
      const userMap = new Map(users.map((u) => [u.id, u.email ?? null]));
      return json((body.user_ids as string[]).map((uid) => ({
        user_id: uid,
        email: userMap.get(uid) ?? null,
      })));
    }

    return json({ error: "Provide 'email' or 'user_ids'" }, 400);

  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
});
