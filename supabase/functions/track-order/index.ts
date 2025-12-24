import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderNumber } = await req.json();

    // Validate input
    if (!orderNumber || typeof orderNumber !== "string") {
      return new Response(
        JSON.stringify({ error: "Order number is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize and validate order number format
    const sanitizedOrderNumber = orderNumber.trim().toUpperCase();
    if (sanitizedOrderNumber.length < 3 || sanitizedOrderNumber.length > 50) {
      return new Response(
        JSON.stringify({ error: "Invalid order number format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Query order - only return non-sensitive fields
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        order_number,
        garment_type,
        garment_description,
        status,
        created_at,
        due_date
      `)
      .eq("order_number", sanitizedOrderNumber)
      .maybeSingle();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to lookup order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!order) {
      return new Response(
        JSON.stringify({ error: "Order not found", found: false }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return limited order info (no PII)
    return new Response(
      JSON.stringify({
        found: true,
        order: {
          orderNumber: order.order_number,
          garmentType: order.garment_type,
          garmentDescription: order.garment_description,
          status: order.status,
          createdAt: order.created_at,
          dueDate: order.due_date,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});