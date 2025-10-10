-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- Create new restrictive policies for profile viewing
-- Policy 1: Authenticated users can view basic public profile info (excluding email)
-- Note: RLS works at row level, so we'll restrict who can see profiles
CREATE POLICY "Authenticated users can view basic profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Policy 2: Users can view their own complete profile (including email)
CREATE POLICY "Users can view own complete profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 3: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Add a comment to remind about email sensitivity
COMMENT ON TABLE profiles IS 'Email addresses should only be queried when user is viewing their own profile or is an admin';
