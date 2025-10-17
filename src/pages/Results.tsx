import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FloatingParticles from "@/components/FloatingParticles";

interface TeamScore {
  team_id: string;
  team_name: string;
  total_points: number;
}

const Results = () => {
  const navigate = useNavigate();
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);

  const { data: results } = useQuery({
    queryKey: ["results"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("results")
        .select("*, teams(name)");
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!results) return;

    const scores: Record<string, TeamScore> = {};
    results.forEach((result) => {
      const teamId = result.team_id;
      const teamName = result.teams?.name || "Unknown";
      
      if (!scores[teamId]) {
        scores[teamId] = {
          team_id: teamId,
          team_name: teamName,
          total_points: 0,
        };
      }
      scores[teamId].total_points += result.points;
    });

    const sorted = Object.values(scores).sort(
      (a, b) => b.total_points - a.total_points
    );
    setTeamScores(sorted);

    // Set up realtime subscription
    const channel = supabase
      .channel("results-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "results",
        },
        () => {
          // Refetch on any change
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [results]);

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 1:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 2:
        return <Award className="w-8 h-8 text-amber-700" />;
      default:
        return <span className="text-2xl font-bold text-muted-foreground">{index + 1}</span>;
    }
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
            Live Results
          </h1>
          <p className="text-xl text-muted-foreground">Real-time team standings</p>
        </motion.div>

        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-8"
        >
          ← Back to Home
        </Button>

        <div className="max-w-4xl mx-auto space-y-4">
          {teamScores.map((team, index) => (
            <motion.div
              key={team.team_id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-elegant hover:shadow-glow transition-all duration-300 ${
                index === 0 ? "ring-2 ring-primary animate-glow-pulse" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center justify-center w-16 h-16">
                    {getPositionIcon(index)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {team.team_name}
                    </h3>
                    <p className="text-muted-foreground">
                      Position: {index + 1}
                    </p>
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  className="text-right"
                >
                  <div className="text-4xl font-bold text-primary">
                    {team.total_points}
                  </div>
                  <div className="text-sm text-muted-foreground">points</div>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {teamScores.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-xl text-muted-foreground">
                No results available yet. Check back soon!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
