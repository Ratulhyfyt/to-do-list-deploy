<script setup lang="ts">
import { Button } from "@/components/ui/button"
import type { Task } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { addTask } from "@/actions/task.actions";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ref } from "vue"
const title = ref<string>('')
const emit = defineEmits<{
  (e: 'added'): void
}>()
const addTasktoDB = async () => {
  let result = false;
  const newTask: Task = {
    title: title.value,
    dateAdded: new Date(),
    completed: false,
  };
  if(!title) {
    return;
  }
    try {
    const ok: boolean = await addTask(newTask) // <-- await the Promise
    if (ok) {
        emit('added')
      console.log('Task added:', newTask)
      title.value= ''
    } 
  } catch (err) {
    console.error(err)
};
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline" class="btn">
        Add Task
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add Task</DialogTitle>
        <DialogDescription>
            Adding a new task to your to-do list.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">
            Task Description
          </Label>
          <Input id="name" default-value="Pedro Duarte" class="col-span-3" v-model="title" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" class="btn" @click="addTasktoDB">
          Add
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template> 