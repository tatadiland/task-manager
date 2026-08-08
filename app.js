const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const totalTasksElement = document.getElementById("totalTasks");
const completedTasksElement = document.getElementById("completedTasks");
const remainingTasksElement = document.getElementById("remainingTasks");

const emptyMessage = document.getElementById("emptyMessage");
const errorMessage = document.getElementById("errorMessage");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const STORAGE_KEY = "taskManagerTasks";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const saveTasks = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const updateCounter = () => {

    const total = tasks.length;

    const completed = tasks.filter(
        ({ completed }) => completed
    ).length;

    const remaining = total - completed;

    totalTasksElement.textContent = total;
    completedTasksElement.textContent = completed;
    remainingTasksElement.textContent = remaining;
};

const renderTasks = () => {

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    tasks.forEach(({ id, title, completed }) => {

        const taskItem = document.createElement("li");

        taskItem.classList.add("task-item");

        if (completed) {
            taskItem.classList.add("completed");
        }

        taskItem.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                data-id="${id}"
                ${completed ? "checked" : ""}
                aria-label="Mark task as completed"
            >

            <span class="task-title">${title}</span>

            <button
                class="delete-btn"
                data-id="${id}"
                aria-label="Delete task"
            >
                Delete
            </button>
        `;

        taskList.appendChild(taskItem);
    });

    updateCounter();
};

const addTask = (title) => {

    const newTask = {
        id: Date.now(),
        title: title,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();
};

taskForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {

        errorMessage.textContent = "Please enter a task.";

        taskInput.focus();

        return;
    }

    errorMessage.textContent = "";

    addTask(title);

    taskInput.value = "";

    taskInput.focus();
});

taskList.addEventListener("click", (event) => {

    const target = event.target;

    if (target.classList.contains("delete-btn")) {

        const taskId = Number(target.dataset.id);

        tasks = tasks.filter(
            ({ id }) => id !== taskId
        );

        saveTasks();

        renderTasks();
    }
});

taskList.addEventListener("change", (event) => {

    const target = event.target;

    if (target.classList.contains("task-checkbox")) {

        const taskId = Number(target.dataset.id);

        tasks = tasks.map((task) => {

            if (task.id === taskId) {

                return {
                    ...task,
                    completed: target.checked
                };
            }

            return task;
        });

        saveTasks();

        renderTasks();
    }
});

clearCompletedBtn.addEventListener("click", () => {

    tasks = tasks.filter(
        ({ completed }) => !completed
    );

    saveTasks();

    renderTasks();
});

renderTasks();