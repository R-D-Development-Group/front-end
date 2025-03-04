import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Pencil, List, ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";

interface TaskList {
  id: number;
  name: string;
  tasks: { title: string; description: string }[];
}

const CACHE_KEY = "taskListsCache";
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const { token } = useAuth();
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchTaskLists = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
          setTaskLists(data);
          return;
        }
      }

      let i = 1;
      let fetchedLists: TaskList[] = [];

      while (true) {
        try {
          const response = await fetch(`/api/task-list/${i}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) break;

          const data: TaskList = await response.json();
          fetchedLists.unshift(data); // Store in reverse order
        } catch {
          break;
        }
        i++;
      }

      if (fetchedLists.length > 0) {
        setTaskLists(fetchedLists);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: fetchedLists, timestamp: Date.now() })
        );
      }
    };

    fetchTaskLists();
  }, [token]);

  return (
    <div className="relative flex flex-row items-start justify-center min-h-screen p-8 space-x-8">
      {/* Left Section */}
      <div className="w-1/3 flex flex-col items-center space-y-6">
        <h1 className="text-xl font-bold">Welcome to the Dashboard</h1>
        <Button onClick={() => navigate("/form/create")}>
          <Pencil className="mr-2" /> Create Form
        </Button>
        <Button variant="destructive" onClick={logout}>
          <LogOut className="mr-2" /> Logout
        </Button>
      </div>

      {/* Right Section - Scrollable */}
      <div className="w-2/3 space-y-4 min-h-[200px] max-h-[80vh] overflow-y-auto">
        {taskLists.map((list, index) => (
          <BlurFade key={list.id} delay={0.2 + index * 0.05} inView>
            <div
              className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition"
              onClick={() => navigate(`/form/${list.id}`)}
            >
              <h2 className="text-lg font-semibold flex items-center justify-between">
                <span className="flex items-center">
                  <List className="mr-2" /> {list.name}
                </span>
                <ArrowRight className="text-gray-400" />
              </h2>
              <ul className="mt-2">
                {list.tasks.map((task, i) => (
                  <li key={i} className="text-sm text-gray-300">
                    - {task.title}: {task.description}
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
