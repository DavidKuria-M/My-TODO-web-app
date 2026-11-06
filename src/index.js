import './style.css';
import { Todo } from './todo.js';
import { getStoredTodos, saveTodos} from './storage.js';
import { renderEmptyState  } from './emptystate.js';
import { DetailPanel } from './detailsPanel.js';
import { renderTasks } from './uiRender.js';
import { updateSidebarCount, updateHeaderSummary} from './tasksCount.js';
import { getStoredTrash, saveTrash } from './trashTodos.js';


document.addEventListener('DOMContentLoaded', () =>{
    let todos = getStoredTodos();
    let trashTodos = getStoredTrash();
    let currentView = 'projects';
    
 
    let currentActiveProject = 'All';
    const todosContainer = document.getElementById('todos-container'); 
    const detailsPanel = document.getElementById('details-panel');
    const saveBtn = document.getElementById('save-task-btn');
    const addTodoBtn = document.getElementById('open-new-todo-modal'); 

    const panelController = new DetailPanel(detailsPanel);
    panelController.close();

    panelController.onDelete((taskId) => {
        
        const taskToDelete = todos.find(task => task.id === taskId);

        if(taskToDelete){
            trashTodos.push(taskToDelete);
            if(typeof saveTrash === 'function'){
                saveTrash(trashTodos);
            }

            todos = todos.filter(task => task.id !== taskId);
            if(typeof saveTodos === 'function'){
                saveTodos(todos);
            }
        }

        if(typeof refreshUI === 'function'){
            refreshUI();

        }else{
            window.location.reload();
        }

    });
    
    //dropdown menu

    const titleEL = document.getElementById('header-project-title');
    const dropdownMenu = document.getElementById('project-dropdown-menu');
    

    if(titleEL && dropdownMenu){
        titleEL.addEventListener('click',(e) =>{
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        dropdownMenu.querySelectorAll('li').forEach(item =>{
            item.addEventListener('click', () => {
                const selectedValue = item.dataset.value;
                if(selectedValue){
                    currentActiveProject = selectedValue;
                    dropdownMenu.classList.remove('show');
                    refreshUI();
                }
            });
        });

        document.addEventListener('click',() => {
            dropdownMenu.classList.remove('show');
        });
    }
   
    function refreshUI(){       
        let tasksToDisplay = [];
        
        const activeProj = (currentActiveProject || 'All').toLowerCase();
        const headerTitle = document.getElementById('header-project-title');
        const headerSummary = document.getElementById('header-summary');
    

        if(currentView === 'trash'){
            tasksToDisplay = trashTodos;

            if(headerTitle === 'trash'){
                headerTitle.textContent = 'Trash';
            }

            if(headerSummary){
                const count = trashTodos.length;
                headerSummary.textContent = `${count} deleted`;
            }
        }else if(currentView === 'completed'){
            if(activeProj === 'completed'){
                tasksToDisplay = todos.filter(t => t.completed);

                if(headerTitle){
                    headerTitle.textContent = 'Completed';
                }
                if(headerSummary){
                    const count= tasksToDisplay.length;
                    headerSummary.textContent = `${count} completed`;
                }
            }
        
        }else if(currentView === 'upcoming'){
           tasksToDisplay = todos.filter(t => !t.completed);
           if(headerTitle){
                headerTitle.textContent = 'Upcoming';
           }
           if(headerSummary){
                const count = tasksToDisplay.length;
                headerSummary.textContent = `${count} Upcoming`;
           }
        
        }else if(currentView === 'today'){
            const todayStr = new Date().toISOString().split('T')[0];

            tasksToDisplay = todos.filter(t => {
                return t.dueDate === todayStr && !t.completed;
            });
            if(headerTitle){
                headerTitle.textContent = 'Today';
            }
            if(headerSummary){
                const count = tasksToDisplay.length;
                headerSummary.textContent = `${count} Todo Today`;
            }
        
        }else{
            tasksToDisplay = todos.filter(t => {
                if(activeProj.toLowerCase() === 'all') return true;
                return(t.project || 'All').toLowerCase() === currentActiveProject.toLowerCase();
            });

            if(headerTitle){
                headerTitle.textContent = currentActiveProject;
            }

            if(headerSummary){
                const totalCount = tasksToDisplay.length;
                const activeCount = tasksToDisplay.filter(t => !t.completed).length;
                const completedcount = tasksToDisplay.filter(t => t.completed).length;

                headerSummary.innerHTML =`${totalCount} Todos &bull; ${activeCount} Active &bull; ${completedcount} Completed`;
            }
        
        }

       

        const filterTodos = todos.filter(t =>{
            if(activeProj.toLowerCase() === 'all') return true;
            return(t.project || 'All').toLowerCase() === currentActiveProject.toLowerCase();
        });

        renderTasks(filterTodos);

       
        updateSidebarCount(todos,trashTodos);

        if(currentView === 'projects'){
            updateHeaderSummary(todos,currentActiveProject);
        }

        const sortValue  = document.getElementById('sort-select')?.value || 'dueDate';

        if(sortValue === 'dueDate'){
            tasksToDisplay.sort((a,b) => {
                if(a.completed && !b.completed) return 1;
                if(!a.completed && b.completed) return -1;
                
                if(!a.dueDate) return 1;
                if(!b.dueDate) return -1;

                return new Date(a.dueDate) - new Date(b.dueDate);
            });
        }else if(sortValue === 'priority'){
            const priorityWeight = {high: 3, medium: 2, low:1};

            tasksToDisplay.sort((a,b) => {

                const pA = priorityWeight[(a.priority || 'low').toLowerCase()] || 1;
                const pB = priorityWeight[(b.priority || 'low').toLowerCase()] || 1;
                return pB - pA;
            });

        }else if(sortValue === 'title'){
            tasksToDisplay.sort((a,b) => {
                const titleA = (a.title || '').toLowerCase();
                const titleB = (b.title || '').toLowerCase();

                return titleA.localeCompare(titleB);
            });
        }

         if(tasksToDisplay.length === 0){
           let emptyText = 'No tasks found';
           if(currentView === 'trash'){
                emptyText =  'Your trash is empty';
           }else if(currentView === 'completed'){
                emptyText = 'No completed Tasks yet';
           }else if(currentView === 'upcoming'){
                emptyText = 'No upcoming tasks';
           }else if(currentView === 'today'){
                emptyText = 'No tasks to do Today';
           }

            todosContainer.innerHTML = `
                <div class="empty-state-message" style="text-align:center; padding:40px; color:#b7280;font-size:15px">
                    ${emptyText}
                </div>
            `;
        }else{
            renderTasks(
                tasksToDisplay,
                todosContainer,
                (todo) =>{
                    if(panelController){
                        panelController.openForExistingTask(todo);
                    }
                },
                () =>{          
                    saveTodos(todos);
                    refreshUI();
                },
                (taskId) =>{
                    const taskIndex = todos.findIndex(t => t.id === taskId);
                    if(taskIndex !== -1){
                        const [deletedTask] = todos.splice(taskIndex,1);
                        trashTodos.push(deletedTask);
                        saveTodos(todos);
                        saveTrash(trashTodos);
                        refreshUI();
                    }       
                }
            );    

        }
       
    }

    refreshUI();

    document.querySelectorAll('.sidebar-projects li').forEach(item =>{
        item.addEventListener('click',() => {
            const selectedProject = item.dataset.project;
            if(selectedProject){
                currentActiveProject = selectedProject;
                refreshUI();
            }
        });
    });

    if(todosContainer){
        renderEmptyState(todosContainer,'General');
    }   
    renderTasks(
        todos,
        todosContainer,
        (todo) =>{
            if(panelController){
                panelController.openForExistingTask(todo);
            }
        },
        () => {
            saveTodos(todos);
            refreshUI();
        },

        (taskId) => {
            const taskIndex = todos.findIndex(t => t.id === taskId);
            if(taskIndex !== -1){
                const [deletedTask] = todos.splice(taskIndex,1);
                trashTodos.push(deletedTask);
                saveTodos(todos);
                saveTrash(trashTodos);
                refreshUI();
            }
        }
        
    );


    if(addTodoBtn){
        addTodoBtn.addEventListener('click', () =>{
            panelController.currentEditingid = null;
            panelController.openForNewTask('General');
        });
    }
    if(saveBtn){
        saveBtn.addEventListener('click',() => {
            const taskData = panelController.getTaskInputData();

            if(panelController.currentEditingid){
                const existingTask = todos.find(t => t.id === panelController.currentEditingid);
                if(existingTask){

                    existingTask.title = taskData.title;
                    existingTask.description = taskData.description;
                    existingTask.notes = taskData.notes;
                    existingTask.dueDate = taskData.dueDate;
                    existingTask.priority = taskData.priority;
                    existingTask.project = taskData.project;
                    existingTask.checklist =[...panelController.currentCheckList];
                }
            }else{
                const newTodo = new Todo(
                    taskData.title,
                    taskData.description,
                    taskData.notes,
                    taskData.dueDate,
                    taskData.priority,
                    taskData.project,
                    [...panelController.currentCheckList]    
                );
                todos.push(newTodo);
            }
            saveTodos(todos);
            refreshUI();
            panelController.close();
            panelController.currentEditingid = null;
        });

    }

    document.querySelectorAll('.nav-item').forEach(item =>{

        item.addEventListener('click',(e) => {
            e.preventDefault();

            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });

            item.classList.add('active');

            const filter = item.dataset.filter;
            const headerTitle = document.getElementById('header-project-title');

            if(filter === 'trash'){
                currentView ='trash';
                currentActiveProject = 'All';

                if(headerTitle){
                    headerTitle.textContent = 'Trash';
                }
            }else if(filter === 'completed'){
                currentView = 'completed';
                currentActiveProject = 'Completed';

                if(headerTitle){
                    headerTitle.textContent ='Completed'; 
                }
                
            }else if(filter === 'upcoming'){
                currentView = 'upcoming';
                currentActiveProject = 'Upcoming';

                if(headerTitle){
                    headerTitle.textContent ='Upcoming'; 
                }
                
            }else if(filter === 'today'){
                currentView = 'today';
                currentActiveProject = 'Today';

                if(headerTitle){
                    headerTitle.textContent ='Today'; 
                }
                
            }else{
                currentView = 'projects';
                currentActiveProject = filter === 'all' ? 'All' : filter;

                if(headerTitle){
                    headerTitle.textContent = currentActiveProject;
                }
            }
            refreshUI();
        });
    });

    const sortSelect = document.getElementById('sort-select');
    if(sortSelect){
        sortSelect.addEventListener('change', () =>{
            refreshUI();
        });
    }
    
    
});