import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AddResourceProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const AddResource = ({ isOpen, onClose, onSubmit }: AddResourceProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("open");
  const [description, setDescription] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resourceData = {
      name,
      type,
      status,
      location_name: address,
      description,
      contact_number
    };

    onSubmit(resourceData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <Card className="relative z-10 w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Report Resource</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Resource Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />

          <input
            type="text"
            placeholder="Type (hospital, shelter...)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded text-black"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="limited">Limited</option>
          </select>

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />

          <input
            type="text"
            placeholder="Contact Number"
            value={contact_number}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w-full p-2 border rounded text-black"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded text-black"
          />

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddResource;
