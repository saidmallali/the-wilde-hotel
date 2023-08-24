import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fhhzruhbfwnmuepyuqyr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaHpydWhiZndubXVlcHl1cXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI4MDUyODEsImV4cCI6MjAwODM4MTI4MX0.fZba-t39JD4dvVq4Lv8NZZ6qWA8pGoJaLPN5s-98Yns";
const supabase = createClient(supabaseUrl, supabaseKey!);

export default supabase;
