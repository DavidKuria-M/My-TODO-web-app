function formatDate(dateString){
    if(!dateString) return '';

    const [year,month,day] = dateString.split('-');
    const date = new Date(year,month - 1,day);

    return date.toLocaleDateString('en-US',{month: 'short',day:'numeric',year:'numeric'});
}

function capitalize(str){

    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function renderTasks(todos,containerElement, onEditCallback,onStatusChange){
    if(!containerElement) return;

    const tasklist = Array.isArray(todos) ? todos : [];

    containerElement.innerHTML = '';

    if(todos.length === 0){
        containerElement.innerHTML = `<p style="color: var(--text-muted); text-align:center; padding:20px;">No todos found.Click "+ Add Todo" to create one!</p>`;
        return;
    }

    tasklist.forEach(todo => {
        const card = document.createElement('div');
        card.className = 'todo-card';
        card.dataset.id = todo.id;

        card.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <div class="todo-content">
               <div class="todo-title ${todo.completed ? 'completed' : ''}">${todo.title}</div>
               ${todo.description ? `<div class="todo-desc">${todo.description}</div>` : ''}
                <div class="todo-meta">
                    <span class="todo-date">
                        <span class="material-symbols-outlined" style="font-size: 1rem">calendar_today</span>
                        ${formatDate(todo.dueDate)}
                    </span>
                    <span class="priority-tag ${todo.priority}">${capitalize(todo.priority)}</span>
                </div>
            </div>
            <div class="todo-arrow">
                <span class="material-symbols-outlined">chevron_right</span>
            </div>
        `;

        const checkbox = card.querySelector('.todo-checkbox');
        const titleElement = card.querySelector('.todo-title');

        card.addEventListener('click', (e) => {      
            if(e.target.closest('.todo-checkbox')) {
                return;
            }
            if(onEditCallback){
                onEditCallback(todo);
            }
        });
        checkbox.addEventListener('change',(e) =>{            
            todo.completed = e.target.checked;
            if(todo.completed){
                titleElement.classList.add('completed');
            }else{
                titleElement.classList.remove('completed');
            }

            if(onStatusChange){
                onStatusChange(todo);
            }

        });

        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        

        containerElement.appendChild(card);
    });
}