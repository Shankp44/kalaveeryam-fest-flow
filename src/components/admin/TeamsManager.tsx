import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";

const TeamsManager = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    leader1: "",
    leader2: "",
  });

  const { data: teams } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (team: any) => {
      const { error } = await supabase.from("teams").insert([team]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      toast({ title: "Team created successfully" });
      setIsOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...team }: any) => {
      const { error } = await supabase
        .from("teams")
        .update(team)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      toast({ title: "Team updated successfully" });
      setIsOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("teams").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      toast({ title: "Team deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", leader1: "", leader2: "" });
    setEditingTeam(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeam) {
      updateMutation.mutate({ id: editingTeam.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (team: any) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      leader1: team.leader1,
      leader2: team.leader2 || "",
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teams Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTeam ? "Edit Team" : "Add New Team"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Team Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="leader1">Leader 1 *</Label>
                <Input
                  id="leader1"
                  value={formData.leader1}
                  onChange={(e) =>
                    setFormData({ ...formData, leader1: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="leader2">Leader 2</Label>
                <Input
                  id="leader2"
                  value={formData.leader2}
                  onChange={(e) =>
                    setFormData({ ...formData, leader2: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                {editingTeam ? "Update" : "Create"} Team
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {teams?.map((team) => (
          <div
            key={team.id}
            className="bg-background p-4 rounded-lg border flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-lg">{team.name}</h3>
              <p className="text-sm text-muted-foreground">
                Leaders: {team.leader1}
                {team.leader2 && `, ${team.leader2}`}
              </p>
              {team.is_default && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded mt-1 inline-block">
                  Default Team
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(team)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              {!team.is_default && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteMutation.mutate(team.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsManager;
