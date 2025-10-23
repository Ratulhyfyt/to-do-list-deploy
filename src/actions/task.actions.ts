import axios from "axios";
import type { Task } from "@/types/task";
import  config  from "@/utils/app.config";

export async function addTask(task:Task) {
  try{
    const response = await axios.post(config.apiUrl+'/task/add', task);
    console.log("apiURL: ", config.apiUrl+'/task/add');
    return response.status === 200 ? true : false;
  }catch(error){
    console.error("Error adding task:", error);
    return false;
  }
}
export async function fetchTasks(params?: { limit?: number; offset?: number }): Promise<Task[]> {
  try {
    const { data } = await axios.get(config.apiUrl+'/task/list', { params })

    // Normalize to an array
    const raw: Task[] = Array.isArray(data) ? data : (data?.tasks ?? [])

    // Map to your Task type (Date object for dateAdded)
    return raw.map((t) => ({
      id: t.id,
      title: t.title,
      dateAdded: t.dateAdded instanceof Date ? t.dateAdded : new Date(t.dateAdded),
      completed: !!t.completed,
    }))
  } catch (err) {
    console.error('fetchTasks failed:', err)
    return [] // never let the caller crash
  }
}
export async function deleteTask(id: string): Promise<boolean> {
  try {
    // Path param version (recommended)
    const res = await axios.delete(config.apiUrl+`/task/delete/${id}`)
    // If your backend returns { success: boolean }
    if (res.data && typeof res.data.success === 'boolean') {
      return res.data.success
    }
    // or treat 2xx as success
    return res.status >= 200 && res.status < 300
  } catch (err) {
    console.error('deleteTask failed:', err)
    return false
  }
}
