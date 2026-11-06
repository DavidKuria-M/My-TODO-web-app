export function updateSidebarCount(todos,trashTodos = []){
    const tasklist = Array.isArray(todos) ? todos :[];
    const trashlist = Array.isArray(trashTodos) ? trashTodos : [];

    const totalCount = tasklist.length;
    const completedCount = tasklist.filter(t => t.completed).length;
    const trashCount = trashlist.length;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2,'0');
    const day = String(now.getDate()).padStart(2,'0');
    const todayStr = `${year}-${month}-${day}`;

    const todayCount = tasklist.filter(t => t.dueDate === todayStr).length;
    const upcomingCount = tasklist.filter(t => !t.completed).length
    
    const todaylist = new Date().toISOString().split('T')[0];

    const todoToday = todos.filter(t => {
        return t.dueDate === todaylist && !t.completed;
    });

    updateBadge('all', totalCount);
    updateBadge('today',todayCount);
    updateBadge('completed',completedCount);
    updateBadge('trash',trashCount);
    updateBadge('upcoming',upcomingCount);
    updateBadge('today',todoToday.length);

    const projects = ['General','Work','Personal','Learning','Fitness'];

    projects.forEach(projectName => {
        const count = tasklist.filter(t => (t.project || 'General').toLowerCase() === projectName.toLowerCase()).length;

        const badgeEl = document.querySelector(`[data-project="${projectName}"] .badge`);
        if(badgeEl){
            badgeEl.textContent = count;
        }
    });
    

}

function updateBadge(filterName,count){
    const badgeEl = document.querySelector(`[data-filter="${filterName}"] .badge`);
    if(badgeEl){
        badgeEl.textContent = count;
    }
}

export function updateHeaderSummary(todos,currentProject = 'General'){
    const taskList = Array.isArray(todos) ? todos : [];

    const projectTasks = taskList.filter(t =>{
        if(currentProject.toLowerCase() === 'all') return true;
        return(t.project || 'General').toLowerCase() === currentProject.toLowerCase();
    });

    const total = projectTasks.length;
    const completed = projectTasks.filter(t => t.completed).length;
    const active = total- completed;

    const totalEl = document.getElementById('count-total');
    const activeEl = document.getElementById('count-active');
    const completedEL = document.getElementById('count-completed');
    const titleEL = document.getElementById('header-project-title');

    if(totalEl) totalEl.textContent = total;
    if(activeEl) activeEl.textContent = active;
    if(completedEL) completedEL.textContent = completed;

    if(titleEL){
        const displayName = currentProject.toLowerCase() === 'all' ? 'All Projects' : currentProject;
        titleEL.innerHTML = `${displayName} <span>&#9660;</span>`;
    }
    
    
}
