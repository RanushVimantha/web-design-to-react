-- Drop all the policies I just created
DROP POLICY IF EXISTS "Authenticated users can view basic profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own complete profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create proper restrictive policies
-- Only authenticated users can view profiles (no more public access)
CREATE POLICY "Authenticated users can view profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: RLS works at row-level, not column-level
-- The application layer must not request email fields when viewing other users' profiles
-- Only request email when: auth.uid() = profile.user_id OR user is admin