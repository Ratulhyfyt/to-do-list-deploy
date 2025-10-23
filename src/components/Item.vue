<script setup lang="ts">
import type { Task } from '@/types/task';
const props = defineProps<{
   task:Task}>
   ();
</script>
<template>
    <div>
        <p>
            This is {{ task.title }} task added on {{ task.dateAdded.toDateString() }}. Completed: {{ task.completed? 'Yes' : 'No' }}.
        </p>
    </div>
</template>