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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";

const ResultsManager = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    event_id: "",
    candidate_id: "",
    team_id: "",
    position: "",
    points: "",
  });

  const { data: events } = useQuery({
    queryKey: ["admin-events-select"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: candidates } = useQuery({
    queryKey: ["admin-candidates-select"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*, teams(name)");
      if (error) throw error;
      return data;
    },
  });

  const { data: teams } = useQuery({
    queryKey: ["admin-teams-select"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teams").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: results } = useQuery({
    queryKey: ["admin-results"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("results")
        .select("*, events(name), candidates(name), teams(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (result: any) => {
      const { error } = await supabase.from("results").insert([result]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-results"] });
      toast({ title: "Result created successfully" });
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
    mutationFn: async ({ id, ...result }: any) => {
      const { error } = await supabase
        .from("results")
        .update(result)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-results"] });
      toast({ title: "Result updated successfully" });
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
      const { error } = await supabase.from("results").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-results"] });
      toast({ title: "Result deleted successfully" });
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
    setFormData({
      event_id: "",
      candidate_id: "",
      team_id: "",
      position: "",
      points: "",
    });
    setEditingResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resultData = {
      ...formData,
      position: parseInt(formData.position),
      points: parseInt(formData.points),
    };

    if (editingResult) {
      updateMutation.mutate({ id: editingResult.id, ...resultData });
    } else {
      createMutation.mutate(resultData);
    }
  };

  const handleEdit = (result: any) => {
    setEditingResult(result);
    setFormData({
      event_id: result.event_id,
      candidate_id: result.candidate_id || "",
      team_id: result.team_id,
      position: result.position.toString(),
      points: result.points.toString(),
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Results Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Result
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingResult ? "Edit Result" : "Add New Result"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="event">Event *</Label>
                <Select
                  value={formData.event_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, event_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events?.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="team">Team *</Label>
                <Select
                  value={formData.team_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, team_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams?.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="candidate">Candidate (optional)</Label>
                <Select
                  value={formData.candidate_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, candidate_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates?.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.name} ({candidate.teams?.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  type="number"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  required
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="points">Points *</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({ ...formData, points: e.target.value })
                  }
                  required
                  min="0"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingResult ? "Update" : "Create"} Result
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {results?.map((result) => (
          <div
            key={result.id}
            className="bg-background p-4 rounded-lg border flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-lg">
                {result.events?.name} - Position {result.position}
              </h3>
              <p className="text-sm text-muted-foreground">
                Team: {result.teams?.name}
                {result.candidates && ` • Candidate: ${result.candidates.name}`}
              </p>
              <p className="text-sm font-semibold text-primary">
                Points: {result.points}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(result)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteMutation.mutate(result.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsManager;
