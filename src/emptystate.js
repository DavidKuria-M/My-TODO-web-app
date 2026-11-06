export function renderEmptyState(container, projectName){
    container.innerHTML = `
        <div class="empty-state">
            <span class="material-symbols-outlined empty-icon">assignment_turned_in</span>
            <h3>No task in ${projectName}</h3>
            <p>Click "+ Add Todo" to create your first task.</p>
        </div>
    `;
}