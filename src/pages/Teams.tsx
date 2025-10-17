import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";
import confetti from "canvas-confetti";

const Teams = () => {
  const navigate = useNavigate();

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const celebrate = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#10b981", "#f59e0b", "#ffffff"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#10b981", "#f59e0b", "#ffffff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-watercolor-green via-watercolor-gold to-watercolor-white relative">
      <FloatingParticles />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold bg-gradient-elegant bg-clip-text text-transparent mb-4">
            Our Teams
          </h1>
          <p className="text-xl text-muted-foreground">Meet the competing houses</p>
        </motion.div>

        <div className="flex gap-4 mb-8">
          <Button onClick={() => navigate("/")} variant="outline">
            ← Back to Home
          </Button>
          <Button onClick={celebrate} className="animate-glow-pulse">
            🎉 Celebrate
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {teams?.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-elegant hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-primary p-4 rounded-full">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-primary">{team.name}</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-background/50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Team Leaders
                  </h3>
                  <div className="space-y-2">
                    {team.leader1_photo_url && (
                      <img
                        src={team.leader1_photo_url}
                        alt={team.leader1}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                      />
                    )}
                    <p className="text-lg font-medium">{team.leader1}</p>
                    
                    {team.leader2 && (
                      <>
                        {team.leader2_photo_url && (
                          <img
                            src={team.leader2_photo_url}
                            alt={team.leader2}
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary mt-2"
                          />
                        )}
                        <p className="text-lg font-medium">{team.leader2}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {teams?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-muted-foreground">
              No teams available yet.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Teams;
