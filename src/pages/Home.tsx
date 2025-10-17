import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trophy, Users, Calendar, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/AnimatedCounter";
import FloatingParticles from "@/components/FloatingParticles";

const Home = () => {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const [teams, candidates, events] = await Promise.all([
        supabase.from("teams").select("*", { count: "exact" }),
        supabase.from("candidates").select("*", { count: "exact" }),
        supabase.from("events").select("*", { count: "exact" }),
      ]);

      const categories = events.data
        ? [...new Set(events.data.map(e => e.category))].length
        : 0;

      return {
        teams: teams.count || 0,
        candidates: candidates.count || 0,
        events: events.count || 0,
        categories,
      };
    },
  });

  const navItems = [
    { title: "Results", icon: Trophy, path: "/results", color: "from-primary to-primary-glow" },
    { title: "Teams", icon: Users, path: "/teams", color: "from-accent to-secondary" },
    { title: "Admin", icon: Tag, path: "/admin/login", color: "from-secondary to-accent" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-watercolor-green via-watercolor-gold to-watercolor-white relative overflow-hidden">
      <FloatingParticles />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 pt-20 pb-12 text-center"
      >
        <motion.h1
          className="text-7xl md:text-9xl font-bold bg-gradient-elegant bg-clip-text text-transparent mb-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          കലാവീര്യം
        </motion.h1>
        <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-2">
          Kalaveeryam
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground">
          MIAC Arts Fest 2025
        </p>
      </motion.div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Events", value: stats?.events || 0, icon: Calendar },
            { label: "Candidates", value: stats?.candidates || 0, icon: Users },
            { label: "Teams", value: stats?.teams || 0, icon: Trophy },
            { label: "Categories", value: stats?.categories || 0, icon: Tag },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card/80 backdrop-blur-sm rounded-lg p-6 text-center shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              <stat.icon className="w-10 h-10 mx-auto mb-3 text-primary" />
              <AnimatedCounter value={stat.value} />
              <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {navItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              <div className={`bg-gradient-to-br ${item.color} p-8 rounded-2xl shadow-elegant hover:shadow-glow transition-all duration-300`}>
                <item.icon className="w-16 h-16 text-white mb-4 group-hover:animate-bounce" />
                <h3 className="text-2xl font-bold text-white">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
