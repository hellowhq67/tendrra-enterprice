// components/account/team-management.tsx
"use client";

import { useState } from "react";
import { UserPlus, User, Trash2, Edit } from "lucide-react"; // Lucide icons
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"


interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

const initialTeamMembers: TeamMember[] = [
  { id: "1", name: "John Doe", email: "john.doe@example.com", role: "Admin" },
  { id: "2", name: "Jane Smith", email: "jane.smith@example.com", role: "Member" },
];

export function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [open, setOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null); // State for tracking editing member

  const handleAddMember = () => {
    if (!newMemberName || !newMemberEmail || !newMemberRole) {
      toast.error("All fields are required to add a new member.");
      return;
    }
    const newMember: TeamMember = {
      id: String(Date.now()), // Generate a unique ID
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
    };
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberRole("");
    setOpen(false);
    toast.success("Member added successfully!");
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
    toast.success("Member removed successfully!");
  };

  const handleEditMember = (id: string) => {
    setEditingMemberId(id);
    // Find the member being edited and pre-fill the form.
    const memberToEdit = teamMembers.find((member) => member.id === id);
    if (memberToEdit) {
      setNewMemberName(memberToEdit.name);
      setNewMemberEmail(memberToEdit.email);
      setNewMemberRole(memberToEdit.role);
      setOpen(true); // Open the dialog
    }
  };

  const handleUpdateMember = () => {
    if (!editingMemberId) return;

    const updatedMembers = teamMembers.map((member) =>
      member.id === editingMemberId
        ? {
            ...member,
            name: newMemberName,
            email: newMemberEmail,
            role: newMemberRole,
          }
        : member
    );

    setTeamMembers(updatedMembers);
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberRole("");
    setEditingMemberId(null);
    setOpen(false);
    toast.success("Member updated successfully!");
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingMemberId ? "Edit Member" : "Add Member"}</DialogTitle>
              <DialogDescription>
                {editingMemberId
                  ? "Update the member's information."
                  : "Add a new member to your team."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input
                  type="text"
                  id="role"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={editingMemberId ? handleUpdateMember : handleAddMember}>
                  {editingMemberId ? "Update Member" : "Add Member"}
                </Button>
              </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of your team members.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditMember(member.id)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
