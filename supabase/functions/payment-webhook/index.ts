import { createClient } from 'npm:@supabase/supabase-js@2.52.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface WebhookPayload {
  order_id?: string;
  order_number?: string;
  status?: string;
  payment_status?: string;
  transaction_id?: string;
  amount?: number;
  customer_email?: string;
  webhook_id?: string;
}

Deno.serve(async (req: Request) => {
  try {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse webhook payload
    const payload: WebhookPayload = await req.json();
    console.log("Webhook payload received:", payload);

    // Validate required fields
    const orderNumber = payload.order_number || payload.order_id;
    if (!orderNumber) {
      console.error("Missing order_number in webhook payload");
      return new Response(
        JSON.stringify({ error: "Missing order_number" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Determine payment status from webhook
    let paymentStatus = 'pending';
    if (payload.status === 'paid' || payload.payment_status === 'confirmed' || payload.status === 'approved') {
      paymentStatus = 'confirmed';
    } else if (payload.status === 'failed' || payload.payment_status === 'failed' || payload.status === 'cancelled') {
      paymentStatus = 'failed';
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update payment status in database
    const { data, error } = await supabase
      .from('customers')
      .update({ payment_status: paymentStatus })
      .eq('order_number', orderNumber)
      .select();

    if (error) {
      console.error("Database update error:", error);
      return new Response(
        JSON.stringify({ error: "Database update failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!data || data.length === 0) {
      console.error("Order not found:", orderNumber);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Payment status updated for order ${orderNumber}: ${paymentStatus}`);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        order_number: orderNumber,
        payment_status: paymentStatus,
        updated_records: data.length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});