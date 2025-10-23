import axios from "axios";
import type { Task } from "@/types/task";

export async function addTask(task:Task) {
  try{
    const response = await axios.post('/task/add', task);
  }
}