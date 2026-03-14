import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yvikidlvanjgofdkypzk.supabase.co";

const supabaseAnonKey =
  "sb_publishable_6E2IG-_ACsJ_yD2G-1sEyA_aV8p0uAn";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});