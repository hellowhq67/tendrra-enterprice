"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type ProjectInputFormProps = {
  onSubmit: (projectData: any) => void;
  loading?: boolean;
};

const ProjectInputForm: React.FC<ProjectInputFormProps> = ({onSubmit, loading}) => {
    const [projectName, setProjectName] = useState("");
    const [projectGoal, setProjectGoal] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [budget, setBudget] = useState("");
    const [timeline, setTimeline] = useState("");
    const [outputFormat, setOutputFormat] = useState("report");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      onSubmit({
        projectName,
        projectGoal,
        targetAudience,
        budget,
        timeline,
        outputFormat
      })

    }


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-4">
      <div>
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          type="text"
          id="projectName"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="projectGoal">Project Goal</Label>
        <Textarea
          id="projectGoal"
          placeholder="Describe your project goal"
          value={projectGoal}
          onChange={(e) => setProjectGoal(e.target.value)}
          rows={4}
          required
        />
      </div>
      <div>
        <Label htmlFor="targetAudience">Target Audience</Label>
        <Input
          type="text"
          id="targetAudience"
          placeholder="Describe your target audience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          required
        />
      </div>
        <div>
            <Label htmlFor="budget">Budget</Label>
            <Input
            type="number"
            id="budget"
            placeholder="Enter budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            />
        </div>
        <div>
        <Label htmlFor="timeline">Timeline</Label>
        <Input
          type="text"
          id="timeline"
          placeholder="Enter timeline"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
        />
      </div>

      <div>
          <Label htmlFor="outputFormat">Output Format</Label>
            <Select onValueChange={(e) => setOutputFormat(e)}>
                <SelectTrigger>
                <SelectValue placeholder="Select output format" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
                <SelectItem value="data">Data</SelectItem>
            </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading} >{loading ? 'Loading...' : 'Start Research'}</Button>
    </form>
  );
};

export default ProjectInputForm;