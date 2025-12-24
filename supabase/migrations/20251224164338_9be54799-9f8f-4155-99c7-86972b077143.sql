-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create measurements table
CREATE TABLE public.measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_name TEXT NOT NULL DEFAULT 'Default',
  measurement_type TEXT NOT NULL DEFAULT 'general',
  
  -- Upper body measurements (in inches)
  neck DECIMAL(5, 2),
  shoulder_width DECIMAL(5, 2),
  chest DECIMAL(5, 2),
  waist DECIMAL(5, 2),
  sleeve_length DECIMAL(5, 2),
  arm_hole DECIMAL(5, 2),
  wrist DECIMAL(5, 2),
  shirt_length DECIMAL(5, 2),
  back_width DECIMAL(5, 2),
  
  -- Lower body measurements
  hips DECIMAL(5, 2),
  thigh DECIMAL(5, 2),
  inseam DECIMAL(5, 2),
  outseam DECIMAL(5, 2),
  trouser_length DECIMAL(5, 2),
  knee DECIMAL(5, 2),
  calf DECIMAL(5, 2),
  ankle DECIMAL(5, 2),
  
  -- Additional measurements
  height DECIMAL(5, 2),
  weight DECIMAL(5, 2),
  
  -- Metadata
  measurement_unit TEXT NOT NULL DEFAULT 'inches',
  notes TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on measurements
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

-- RLS policies for measurements
CREATE POLICY "Users can view their own measurements" 
ON public.measurements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own measurements" 
ON public.measurements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own measurements" 
ON public.measurements 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own measurements" 
ON public.measurements 
FOR DELETE 
USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_measurements_updated_at
  BEFORE UPDATE ON public.measurements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();