-- Add verification status to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP WITH TIME ZONE;

-- Add tournament type to tournaments table
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS tournament_type TEXT DEFAULT 'solo' CHECK (tournament_type IN ('solo', 'team'));
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS team_size INTEGER DEFAULT 1;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS registration_start TIMESTAMP WITH TIME ZONE;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS registration_end TIMESTAMP WITH TIME ZONE;

-- Create teams_competitive table for user-created tournament teams
CREATE TABLE IF NOT EXISTS teams_competitive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  tag TEXT NOT NULL UNIQUE,
  captain_id UUID NOT NULL,
  game TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams_competitive(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('captain', 'member')),
  is_verified BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Create team_invitations table
CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams_competitive(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL,
  invited_user_email TEXT NOT NULL,
  invited_user_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days'),
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Create tournament_registrations table
CREATE TABLE IF NOT EXISTS tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID,
  team_id UUID REFERENCES teams_competitive(id) ON DELETE CASCADE,
  registration_type TEXT NOT NULL CHECK (registration_type IN ('solo', 'team')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CHECK (
    (registration_type = 'solo' AND user_id IS NOT NULL AND team_id IS NULL) OR
    (registration_type = 'team' AND team_id IS NOT NULL AND user_id IS NULL)
  )
);

-- Enable RLS on all new tables
ALTER TABLE teams_competitive ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams_competitive
CREATE POLICY "Anyone can view teams" ON teams_competitive
  FOR SELECT USING (true);

CREATE POLICY "Verified users can create teams" ON teams_competitive
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_verified = true
    )
  );

CREATE POLICY "Team captains can update their team" ON teams_competitive
  FOR UPDATE USING (captain_id = auth.uid());

CREATE POLICY "Team captains can delete their team" ON teams_competitive
  FOR DELETE USING (captain_id = auth.uid());

CREATE POLICY "Admins can manage all teams" ON teams_competitive
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for team_members
CREATE POLICY "Anyone can view team members" ON team_members
  FOR SELECT USING (true);

CREATE POLICY "Team captains can add members" ON team_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams_competitive 
      WHERE teams_competitive.id = team_id 
      AND teams_competitive.captain_id = auth.uid()
    )
  );

CREATE POLICY "Team captains can update members" ON team_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams_competitive 
      WHERE teams_competitive.id = team_id 
      AND teams_competitive.captain_id = auth.uid()
    )
  );

CREATE POLICY "Team captains and members can remove themselves" ON team_members
  FOR DELETE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM teams_competitive 
      WHERE teams_competitive.id = team_id 
      AND teams_competitive.captain_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all team members" ON team_members
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for team_invitations
CREATE POLICY "Team captains can view their invitations" ON team_invitations
  FOR SELECT USING (
    invited_by = auth.uid() OR
    invited_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.email = team_invitations.invited_user_email
    )
  );

CREATE POLICY "Team captains can create invitations" ON team_invitations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams_competitive 
      WHERE teams_competitive.id = team_id 
      AND teams_competitive.captain_id = auth.uid()
    )
  );

CREATE POLICY "Invited users can update invitations" ON team_invitations
  FOR UPDATE USING (
    invited_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.email = team_invitations.invited_user_email
    )
  );

CREATE POLICY "Admins can manage all invitations" ON team_invitations
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for tournament_registrations
CREATE POLICY "Anyone can view registrations" ON tournament_registrations
  FOR SELECT USING (true);

CREATE POLICY "Verified users can register for solo tournaments" ON tournament_registrations
  FOR INSERT WITH CHECK (
    registration_type = 'solo' AND
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_verified = true
    )
  );

CREATE POLICY "Team captains can register verified teams" ON tournament_registrations
  FOR INSERT WITH CHECK (
    registration_type = 'team' AND
    EXISTS (
      SELECT 1 FROM teams_competitive 
      WHERE teams_competitive.id = team_id 
      AND teams_competitive.captain_id = auth.uid()
      AND teams_competitive.is_verified = true
    )
  );

CREATE POLICY "Users can withdraw their registrations" ON tournament_registrations
  FOR UPDATE USING (
    (registration_type = 'solo' AND user_id = auth.uid()) OR
    (registration_type = 'team' AND EXISTS (
      SELECT 1 FROM teams_competitive 
      WHERE teams_competitive.id = team_id 
      AND teams_competitive.captain_id = auth.uid()
    ))
  );

CREATE POLICY "Admins can manage all registrations" ON tournament_registrations
  FOR ALL USING (is_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_teams_competitive_updated_at
  BEFORE UPDATE ON teams_competitive
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tournament_registrations_updated_at
  BEFORE UPDATE ON tournament_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to check if a team is verified (all members verified)
CREATE OR REPLACE FUNCTION check_team_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- Update team verification status based on all members being verified
  UPDATE teams_competitive
  SET is_verified = (
    SELECT COUNT(*) = COUNT(*) FILTER (WHERE tm.is_verified = true)
    FROM team_members tm
    WHERE tm.team_id = NEW.team_id
  )
  WHERE id = NEW.team_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update team verification when members change
CREATE TRIGGER check_team_verification_trigger
  AFTER INSERT OR UPDATE OR DELETE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION check_team_verification();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_competitive_captain ON teams_competitive(captain_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_team ON team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_user ON team_invitations(invited_user_id);
CREATE INDEX IF NOT EXISTS idx_tournament_registrations_tournament ON tournament_registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_registrations_user ON tournament_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_tournament_registrations_team ON tournament_registrations(team_id);