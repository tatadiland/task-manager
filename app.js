/* =========================================================
   TASK MANAGER APPLICATION
   Vanilla JavaScript
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const taskList = document.getElementById("taskList");

const totalTasksElement =
    document.getElementById("totalTasks");

const completedTasksElement =
    document.getElementById("completedTasks");

const remainingTasksElement =
    document.getElementById("remainingTasks");

const emptyMessage =
    document.getElementById("emptyMessage");

const errorMessage =
    document.getElementById("errorMessage");

const clearCompletedBtn =
    document.getElementById("clearCompletedBtn");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");


/* =========================================================
   LOCAL STORAGE
========================================================= */

const STORAGE_KEY = "taskManagerTasks";


/* =========================================================
   LOAD TASKS
========================================================= */

let tasks =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];


/* =========================================================
   CURRENT FILTER
========================================================= */

let currentFilter = "all";


/* =========================================================
   SAVE TASKS
========================================================= */

const saveTasks = () => {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
};


/* =========================================================
   UPDATE COUNTERS
========================================================= */

const updateCounter = () => {

    const total = tasks.length;

    const completed =
        tasks.filter(
            ({ completed }) => completed
        ).length;

    const remaining =
        total - completed;


    totalTasksElement.textContent =
        total;

    completedTasksElement.textContent =
        completed;

    remainingTasksElement.textContent =
        remaining;
};


/* =========================================================
   GET FILTERED TASKS
========================================================= */

const getFilteredTasks = () => {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    let filteredTasks =
        tasks.filter(
            ({ title }) =>
                title
                    .toLowerCase()
                    .includes(searchTerm)
        );


    if (currentFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(
                ({ completed }) => completed
            );
    }


    if (currentFilter === "pending") {

        filteredTasks =
            filteredTasks.filter(
                ({ completed }) => !completed
            );
    }


    return filteredTasks;
};


/* =========================================================
   RENDER TASKS
========================================================= */

const renderTasks = () => {

    taskList.innerHTML = "";


    const filteredTasks =
        getFilteredTasks();


    if (
        tasks.length === 0
    ) {

        emptyMessage.style.display =
            "block";

        emptyMessage.querySelector("h3")
            .textContent =
            "No tasks yet";

        emptyMessage.querySelector("p")
            .textContent =
            "Add a task above to get started.";

    } else if (
        filteredTasks.length === 0
    ) {

        emptyMessage.style.display =
            "block";

        emptyMessage.querySelector("h3")
            .textContent =
            "No matching tasks";

        emptyMessage.querySelector("p")
            .textContent =
            "Try another search or filter.";

    } else {

        emptyMessage.style.display =
            "none";
    }


    filteredTasks.forEach(
        ({ id, title, completed }) => {

            const taskItem =
                document.createElement("li");


            taskItem.classList.add(
                "task-item"
            );


            if (completed) {

                taskItem.classList.add(
                    "completed"
                );
            }


            taskItem.innerHTML = `

                <input
                    type="checkbox"
                    class="task-checkbox"
                    data-id="${id}"
                    ${completed ? "checked" : ""}
                    aria-label="Mark task as completed"
                >

                <span class="task-title">
                    ${title}
                </span>

                <button
                    class="edit-btn"
                    data-id="${id}"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${id}"
                >
                    Delete
                </button>

            `;


            taskList.appendChild(
                taskItem
            );
        }
    );


    updateCounter();
};


/* =========================================================
   ADD TASK
========================================================= */

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


/* =========================================================
   ADD TASK FORM
========================================================= */

taskForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const title =
            taskInput.value.trim();


        if (title === "") {

            errorMessage.textContent =
                "Please enter a task.";

            taskInput.focus();

            return;
        }


        errorMessage.textContent =
            "";


        addTask(title);


        taskInput.value =
            "";


        taskInput.focus();
    }
);


/* =========================================================
   TASK LIST CLICK EVENTS
========================================================= */

taskList.addEventListener(
    "click",
    (event) => {

        const target =
            event.target;


        /* =================================================
           DELETE TASK
        ================================================= */

        if (
            target.classList.contains(
                "delete-btn"
            )
        ) {

            const taskId =
                Number(
                    target.dataset.id
                );


            tasks =
                tasks.filter(
                    ({ id }) =>
                        id !== taskId
                );


            saveTasks();


            renderTasks();
        }


        /* =================================================
           EDIT TASK
        ================================================= */

        if (
            target.classList.contains(
                "edit-btn"
            )
        ) {

            const taskId =
                Number(
                    target.dataset.id
                );


            const taskItem =
                target.closest(
                    ".task-item"
                );


            const task =
                tasks.find(
                    ({ id }) =>
                        id === taskId
                );


            if (!task) {
                return;
            }


            taskItem.innerHTML = `

                <input
                    type="checkbox"
                    class="task-checkbox"
                    data-id="${task.id}"
                    ${task.completed ? "checked" : ""}
                >

                <input
                    type="text"
                    class="edit-input"
                    value="${task.title}"
                >

                <button
                    class="save-edit-btn"
                    data-id="${task.id}"
                >
                    Save
                </button>

                <button
                    class="delete-btn"
                    data-id="${task.id}"
                >
                    Delete
                </button>

            `;


            const editInput =
                taskItem.querySelector(
                    ".edit-input"
                );


            editInput.focus();


            editInput.select();
        }


        /* =================================================
           SAVE EDIT
        ================================================= */

        if (
            target.classList.contains(
                "save-edit-btn"
            )
        ) {

            const taskId =
                Number(
                    target.dataset.id
                );


            const taskItem =
                target.closest(
                    ".task-item"
                );


            const editInput =
                taskItem.querySelector(
                    ".edit-input"
                );


            const newTitle =
                editInput.value.trim();


            if (newTitle === "") {

                alert(
                    "Task title cannot be empty."
                );

                editInput.focus();

                return;
            }


            tasks =
                tasks.map(
                    (task) => {

                        if (
                            task.id === taskId
                        ) {

                            return {
                                ...task,
                                title: newTitle
                            };
                        }


                        return task;
                    }
                );


            saveTasks();


            renderTasks();
        }
    }
);


/* =========================================================
   MARK TASK COMPLETED
========================================================= */

taskList.addEventListener(
    "change",
    (event) => {

        const target =
            event.target;


        if (
            target.classList.contains(
                "task-checkbox"
            )
        ) {

            const taskId =
                Number(
                    target.dataset.id
                );


            tasks =
                tasks.map(
                    (task) => {

                        if (
                            task.id === taskId
                        ) {

                            return {

                                ...task,

                                completed:
                                    target.checked
                            };
                        }


                        return task;
                    }
                );


            saveTasks();


            renderTasks();
        }
    }
);


/* =========================================================
   CLEAR COMPLETED
========================================================= */

clearCompletedBtn.addEventListener(
    "click",
    () => {

        tasks =
            tasks.filter(
                ({ completed }) =>
                    !completed
            );


        saveTasks();


        renderTasks();
    }
);


/* =========================================================
   SEARCH TASKS
========================================================= */

searchInput.addEventListener(
    "input",
    () => {

        renderTasks();
    }
);


/* =========================================================
   FILTER TASKS
========================================================= */

filterButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    (btn) => {

                        btn.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                renderTasks();
            }
        );
    }
);


/* =========================================================
   INITIAL DISPLAY
========================================================= */

renderTasks();