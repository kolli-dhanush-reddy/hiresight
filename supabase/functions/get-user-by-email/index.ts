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

    // Verify caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await userClient.auth.getUser();
    if (!caller) return json({ error: "Unauthorized" }, 401);

    // Use service role for all admin operations
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify caller is admin
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) return json({ error: "Forbidden" }, 403);

    const body = await req.json();

    // Mode 1: lookup by email
    if (typeof body.email === "string") {
      const email = body.email.trim().toLowerCase();
      
      // Fetch all users (paginated)
      let allUsers: { id: string; email?: string }[] = [];
      let page = 1;
      while (true) {
        const { data: { users }, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) throw error;
        allUsers = allUsers.concat(users);
        if (users.length < 1000) break;
        page++;
      }

      const found = allUsers.find((u) => u.email?.toLowerCase() === email);
      if (!found) return json({ error: "User not found" }, 404);
      return json({ user_id: found.id, email: found.email });
    }

    // Mode 2: lookup by user_ids array
    if (Array.isArray(body.user_ids)) {
      let allUsers: { id: string; email?: string }[] = [];
      let page = 1;
      while (true) {
        const { data: { users }, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) throw error;
        allUsers = allUsers.concat(users);
        if (users.length < 1000) break;
        page++;
      }

      const userMap = new Map(allUsers.map((u) => [u.id, u.email ?? null]));
      const result = (body.user_ids as string[]).map((uid) => ({
        user_id: uid,
        email: userMap.get(uid) ?? null,
      }));
      return json(result);
    }

    return json({ error: "Provide 'email' or 'user_ids'" }, 400);

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Edge function error:", message);
    return json({ error: message }, 500);
  }
});
