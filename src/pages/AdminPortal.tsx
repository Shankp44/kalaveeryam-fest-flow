import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import TeamsManager from "@/components/admin/TeamsManager";
import CandidatesManager from "@/components/admin/CandidatesManager";
import EventsManager from "@/components/admin/EventsManager";
import ResultsManager from "@/components/admin/ResultsManager";
import FloatingParticles from "@/components/FloatingParticles";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/admin/login");
        return;
      }

      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (error || !roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-watercolor-green via-watercolor-gold to-watercolor-white">
        <div className="text-2xl text-primary">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-watercolor-green via-watercolor-gold to-watercolor-white relative">
      <FloatingParticles />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-elegant bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/")} variant="outline">
              Back to Home
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="teams" className="bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-elegant">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="mt-6">
            <TeamsManager />
          </TabsContent>

          <TabsContent value="candidates" className="mt-6">
            <CandidatesManager />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventsManager />
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <ResultsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortal;
