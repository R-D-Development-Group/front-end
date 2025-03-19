import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Send, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

interface FormField {
  title: string;
  description: string;
}

interface FormCreationProps {
  mode: "create" | "view"; // Mode determines behavior
}

let API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082"

const FormCreation: React.FC<FormCreationProps> = ({ mode }) => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [formName, setFormName] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();

  // Fetch form details in "view" mode
  useEffect(() => {
    if (mode === "view" && id) {
      (async () => {
        try {
          const response = await fetch(`${API_URL}/api/task-list/${id}`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          });

          if (!response.ok) throw new Error("Failed to fetch form details.");

          const data = await response.json();
          setFormName(data.name);
          setFields(data.tasks);
        } catch (error) {
          setMessage({ text: (error as Error).message, type: "error" });
        }
      })();
    }
  }, [mode, id, token]);

  const addField = () => setFields([...fields, { title: "", description: "" }]);

  const updateField = (index: number, key: keyof FormField, value: string) => {
    setFields(fields.map((field, i) => (i === index ? { ...field, [key]: value } : field)));
  };

  const removeField = (index: number) => setFields(fields.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setMessage({ text: "Authentication failed. Please log in again.", type: "error" });

    try {
      const response = await fetch(`${API_URL}/api/task-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: formName, tasks: fields }),
      });

      if (!response.ok) throw new Error("Failed to submit form. Please try again.");

      navigate("/dashboard");
    } catch (error) {
      setMessage({ text: (error as Error).message, type: "error" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.8, opacity: 0 }} 
        className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate("/dashboard")} 
          className="mb-4 border-gray-700 hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> {mode === "view" ? "Back" : "Return to Dashboard"}
        </Button>

        <h2 className="text-2xl font-bold mb-4">{mode === "view" ? "Form Details" : "Create a Form"}</h2>

        {message && <p className={`mb-4 ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>{message.text}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Name Input */}
          <Input
            type="text"
            placeholder="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
            disabled={mode === "view"}
            className={`bg-gray-800 text-white border-gray-700 focus:ring-0 focus:border-gray-500 ${
              mode === "view" ? "cursor-not-allowed opacity-70" : ""
            }`}
          />

          {/* Dynamic Fields */}
          {fields.map((field, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="Task Title"
                value={field.title}
                onChange={(e) => updateField(index, "title", e.target.value)}
                required
                disabled={mode === "view"}
                className={`bg-gray-800 text-white border-gray-700 focus:ring-0 focus:border-gray-500 ${
                  mode === "view" ? "cursor-not-allowed opacity-70" : ""
                }`}
              />
              <Input
                type="text"
                placeholder="Task Description"
                value={field.description}
                onChange={(e) => updateField(index, "description", e.target.value)}
                required
                disabled={mode === "view"}
                className={`bg-gray-800 text-white border-gray-700 focus:ring-0 focus:border-gray-500 ${
                  mode === "view" ? "cursor-not-allowed opacity-70" : ""
                }`}
              />
              {mode !== "view" && (
                <Button variant="destructive" onClick={() => removeField(index)} className="bg-red-600 hover:bg-red-700">
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {/* Controls */}
          {mode !== "view" && (
            <div className="flex justify-between">
              <Button variant="outline" onClick={addField} className="border-gray-700 hover:bg-gray-700">
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-1" /> Submit Form
              </Button>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default FormCreation;
