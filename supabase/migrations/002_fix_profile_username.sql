-- Fix: Create profiles with empty username for new users
-- This ensures the setup wizard triggers properly

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, username, display_name)
  VALUES (gen_random_uuid(), new.id, '', COALESCE(new.raw_user_meta_data->>'email', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;