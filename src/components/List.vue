<script setup lang="ts">
import type { Task } from '@/types/task';
import Item from './Item.vue';
import AddTaskDialog from './AddTaskDialog.vue';
import { fetchTasks } from '@/actions/task.actions';
import { ref, onMounted } from 'vue'
import { deleteTask } from '@/actions/task.actions';
import { Button } from "@/components/ui/button"
const list = ref<Task[]>([]);
const deletingId = ref<string | null>(null);

async function refresh() {
  const data = await fetchTasks({ limit: 100 })
  list.value = Array.isArray(data) ? data : []
}

onMounted(refresh)
async function onDelete(task: Task) {
  if (!task.id) return;
  // optimistic UI
  const prev = [...list.value]
  list.value = list.value.filter(t => t.id !== task.id)
  deletingId.value = task.id

  const ok = await deleteTask(task.id)
  deletingId.value = null

  if (!ok) {
    // revert on failure
    list.value = prev
    // optionally show a toast here
    console.error('Failed to delete task:', task.id)
  }
}
</script>
<template>
  <div>
    <div class="item">
      <div class="details">
        <h3>Welcome to Your To-Do List</h3>
        <p>Get started by adding your first task!</p>
        <AddTaskDialog @added="refresh"/>
       <p v-if="!list.length">No tasks yet.</p>

       <ul v-else class="mt-4 space-y-2">
          <li
            v-for="item in list"
            :key="item.id ?? item.title"
            class="flex items-center justify-between gap-3"
          >
            <Item :task="item" />
            <Button
              variant="destructive"
              size="sm"
              :disabled="deletingId === item.id"
              @click="onDelete(item)"
            >
              {{ deletingId === item.id ? 'Deleting…' : 'Delete' }}
            </Button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
  position: relative;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;

  color: var(--color-text);
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-heading);
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }

  i {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  .item:before {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>
