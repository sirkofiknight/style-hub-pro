-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to view all measurements
CREATE POLICY "Admins can view all measurements" 
ON public.measurements 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to manage all measurements
CREATE POLICY "Admins can manage all measurements" 
ON public.measurements 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to view all appointments (for dashboard stats)
CREATE POLICY "Admins can view all appointments" 
ON public.appointments 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));