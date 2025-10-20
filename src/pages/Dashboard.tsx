import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecruitmentApplications from "@/components/dashboard/RecruitmentApplications";
import TeamsManagement from "@/components/dashboard/TeamsManagement";
import PartnersManagement from "@/components/dashboard/PartnersManagement";
import TournamentsManagement from "@/components/dashboard/TournamentsManagement";
import UsersManagement from "@/components/dashboard/UsersManagement";
import PlayersManagement from "@/components/dashboard/PlayersManagement";
import UserVerifications from "@/components/dashboard/UserVerifications";
import TournamentRegistrations from "@/components/dashboard/TournamentRegistrations";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage all aspects of your esports organization</p>
        </div>

        <Tabs defaultValue="recruitment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8 bg-muted/50 p-1 animate-fade-in">
            <TabsTrigger value="recruitment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105">
              Applications
            </TabsTrigger>
            <TabsTrigger value="verifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105">
              Verifications
            </TabsTrigger>
            <TabsTrigger value="registrations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105">
              Registrations
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105">
              Teams
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105">
              Players
            </TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105">
              Partners
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105">
              Tournaments
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105">
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recruitment" className="space-y-4">
            <RecruitmentApplications />
          </TabsContent>

          <TabsContent value="verifications" className="space-y-4">
            <UserVerifications />
          </TabsContent>

          <TabsContent value="registrations" className="space-y-4">
            <TournamentRegistrations />
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <TeamsManagement />
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            <PartnersManagement />
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-4">
            <TournamentsManagement />
          </TabsContent>

          <TabsContent value="players" className="space-y-4">
            <PlayersManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UsersManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
