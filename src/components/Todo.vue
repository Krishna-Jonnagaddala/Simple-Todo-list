<template>
    <div
        class="flex flex-col gap-3 p-3 border-2 border-blue-500 my-5 max-w-[720px] m-auto rounded-lg items-center bg-gray-200">
        <h2 class="w-full text-lg text-sky-700 font-semibold text-center bg-gray-300 rounded">Create a To-Do Task</h2>
        <form @submit.prevent="addTask" class="flex gap-4 w-full">
            <input v-model="newDate" type="date"
                class="min-w-[150px] outline-none border-2 border-gray-400 rounded px-2 flex-1" required />
            <input v-model="newTask" type="text" placeholder="Enter task description" required
                class="shadow appearance-none border rounded w-full max-w-[480px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <button type="submit"
                class="bg-white hover:bg-gray-100 text-gray-800 text-sm font-semibold py-2 px-2 border border-gray-400 rounded shadow min-w-[80px]">Add
                Task</button>
        </form>

        <button @click="() => { viewPending = !viewPending }"
            class="w-full text-lg text-sky-700 font-semibold text-center mt-4 border border-gray-400 rounded bg-gray-300">Pending
            Tasks</button>
        <ul v-if="viewPending" class="w-full flex flex-col gap-1">
            <li class="flex w-full gap-1 justify-between py-1 items-center border-2 border-gray-300 px-2 rounded"
                v-for="task in pendingTasks" :style="taskStyle(task)" :key="task.id">

                <input id="disabled-checked-checkbox" type="checkbox" @change="readTask(task)"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600">

                <span v-if="!task.edit" class="text-base text-red-700">{{ task.description }}</span>
                <span v-if="!task.edit" class="text-base">{{ task.workDate }}</span>

                <input v-if="task.edit" type="text" v-model="task.description" :ref="'task'"
                    class="shadow appearance-none border rounded w-full max-w-[480px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">

                <input v-if="task.edit" v-model="task.workDate" type="date" :ref="'date'"
                    class="min-w-[150px] outline-none border-2 border-gray-400 rounded px-2 flex-1" required />

                <div class="flex justify-center gap-1">
                    <button v-if="!task.edit" class="text-sm text-gray-700 border-2 border-gray-500 rounded p-1"
                        @click="edit(task)">
                        <component class="text-green-600" :is="icons[3]"></component>
                    </button>
                    <button v-else class="text-sm text-gray-700 border-2 border-gray-500 rounded p-1"
                        @click="() => task.edit = false">
                        <component class="text-green-600" :is="icons[4]"></component>
                    </button>
                    <button class="text-sm text-gray-700 border-2 border-gray-500 rounded p-1" @click="completeTask(task)">
                        <component class="text-green-600" :is="icons[0]"></component>
                    </button>
                    <button class="text-sm text-gray-700 border-2 border-gray-500 rounded p-1" @click="duplicateTask(task)">
                        <component class="text-yellow-600" :is="icons[1]"></component>
                    </button>
                    <button class="text-sm text-gray-700 border-2 border-gray-500 rounded p-1" @click="showModal(task)">
                        <component class="text-red-600" :is="icons[2]"></component>
                    </button>

                </div>
            </li>
        </ul>

        <delete-modal v-if="showDeleteModal" :deleteMessage=this.$store.state.deleteMessage
            :modalHeadline=this.$store.state.modalHeadline @delete=" deleteTodo()" @cancel="cancelDelete"></delete-modal>

        <h2 class="w-full text-lg text-sky-700 font-semibold text-center mt-4 bg-gray-300 rounded">Completed Tasks</h2>
        <ul v-if="completedTasks.length < 4" class="w-full flex flex-col gap-1">
            <li class="w-full border-2 border-gray-300 px-2 py-2 rounded" v-for="task in completedTasks" :key="task.id">
                {{ task.description }}
            </li>
        </ul>
        <button v-if="completedTasks.length > 3" @click="() => { viewAll = !viewAll }"
            class="w-full text-lg text-sky-700 font-semibold text-center mt-4 border border-gray-400 bg-gray-300 rounded ">View
            All</button>
        <ul v-if="viewAll" class="w-full flex flex-col gap-1">
            <li class="w-full border-2 border-gray-300 px-2 py-2 rounded" v-for="task in completedTasks" :key="task.id">
                {{ task.description }}
            </li>
        </ul>
    </div>
</template>
  
<script>
import { BadgeCheckIcon, TrashIcon, FolderAddIcon, PencilAltIcon, SaveIcon } from "@vue-hero-icons/outline";
import deleteModal from './Modal.vue';
export default {
    name: "todo-item",
    components: {
        deleteModal
    },
    data() {
        return {
            icons: [BadgeCheckIcon, FolderAddIcon, TrashIcon, PencilAltIcon, SaveIcon],
            viewPending: false,
            viewAll: false,
            showDeleteModal: false,
            selectedTodo: null,
            newTask: '',
            newDate: '',
            today: {},
            tasks: []
        };
    },

    computed: {
        pendingTasks() {
            return this.tasks.filter(task => !task.completed);
        },
        completedTasks() {
            return this.tasks.filter(task => task.completed);
        },
    },
    methods: {

        addTask() {
            if (this.newTask.trim() !== '' && this.newDate.trim() !== '') {
                this.tasks.push({
                    id: Date.now(),
                    description: this.newTask,
                    completed: false,
                    edit: false,
                    read: false,
                    workDate: this.newDate
                });
                this.newTask = '';
                this.newDate = '';
            }
        },

        readTask(task) { task.read = true; },

        completeTask(task) { task.completed = true; },

        duplicateTask(task) {
            this.tasks.push({
                id: Date.now(),
                description: task.description,
                completed: false,
                edit: false,
                read: false,
                workDate: task.workDate
            });
        },

        deleteTask(task) {
            this.showDeleteModal != this.showDeleteModal;
            const index = this.tasks.indexOf(task);
            if (index > -1) this.tasks.splice(index, 1);
        },

        taskStyle(task) {
            const today = new Date();
            const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const workDate = new Date(task.workDate);
            if (workDate < currentDate) { return { color: 'red' }; }
            return { color: 'green' };
        },

        edit(task) {
            this.tasks = this.tasks.map(val => {
                if (val.id === task.id) {
                    val.edit = true
                }
                return val
            })
        },

        showModal(task) {
            this.selectedTodo = task;
            this.showDeleteModal = true;
        },

        deleteTodo() {
            this.tasks = this.tasks.filter(val => val.id !== this.selectedTodo.id);
            this.showDeleteModal = false;
        },

        cancelDelete() {
            this.showDeleteModal = false;
        }
    }
};
</script>
  
