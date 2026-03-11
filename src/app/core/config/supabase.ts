import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class Supabase {
  readonly client: SupabaseClient = createClient(
    environment.supabase.api_url,
    environment.supabase.api_key
  )
}
