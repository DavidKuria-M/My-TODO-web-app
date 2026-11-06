const PROJECT_COLORS = {
    General: '#3b82f6',
    Work:'#a855f7',
    Personal:'#22c55e',
    Learning:'#3b82f6',
    Fitness:'#ef4444'
}

const PRIORITY_COLORS ={
    High:'#f87171',
    Medium:'#fbbf24',
    Low:'#3b82f6'
}

export class DetailPanel{
   constructor(panelElement){
        this.panel = panelElement;

        if(this.panel){
            this.panel.classList.remove('open');
        }

        this.currentEditingid = null;
        this.closeBtn = this.panel.querySelector('#close-details');
        this.titleInput = this.panel.querySelector('#detail-task-title');
        this.projectSelect = this.panel.querySelector('#detail-project-select');
        this.projectDot = this.panel.querySelector('#projects-dot');
        this.prioritySelect = this.panel.querySelector('#detail-priority-select');
        this.dateInput = this.panel.querySelector('#detail-date-input');
        this.descInput = this.panel.querySelector('#detail-task-desc');
        this.notesInput = this.panel.querySelector('#detail-task-notes');
        this.deleteBtn = this.panel.querySelector('#delete-task-btn');
        this.currentCheckList =[];

        this.initEvents();
   }

   updateProjectDotColor(projectName){
        if(!this.projectDot)return;
        const color = PROJECT_COLORS[projectName];
        this.projectDot.style.backgroundColor = color;
   }

   updatePriorityColors(priorityValue){
        const color = PRIORITY_COLORS[priorityValue];
        
        if(this.prioritySelect){
            this.prioritySelect.style.color = color;
            this.prioritySelect.style.borderColor = color;
        }
   }

   openForNewTask(defaultProject = 'General',defaultSelect = 'Medium'){
        
        if(this.titleInput) this.titleInput.textContent  = '';
        if(this.descInput)  this.descInput.value = '';
        if(this.notesInput) this.notesInput.value ='';

        if(this.projectSelect){
            this.projectSelect.value = defaultProject;
            this.updateProjectDotColor(defaultProject);
        }

        if(this.dateInput){
            const today = new Date().toISOString().split('T')[0];
            this.dateInput.value = today;

        }

        if(this.prioritySelect){
            this.prioritySelect.value = defaultSelect;
            this.updatePriorityColors(defaultSelect);
        }

        this.currentCheckList = [];
        this.renderChecklistUI();

        this.panel.classList.add('open');
   }

   getTaskInputData(){
        return{
            title:this.titleInput ? this.titleInput.textContent.trim(): 'Untitled Task',
            project:this.projectSelect ? this.projectSelect.value: 'General',
            priority:this.prioritySelect ? this.prioritySelect.value: 'medium',
            dueDate: this.dateInput ? this.dateInput.value : '',
            description:this.descInput ? this.descInput.value.trim(): '',
            notes:this.notesInput ? this.notesInput.value.trim() : ''

        }
   }

   openForExistingTask(todo){


        this.currentEditingid = todo.id;

        const titleElement = this.panel.querySelector('#panel-title') || this.panel.querySelector('.panel-title') || this.panel.querySelector('h2');
        if(titleElement){
            titleElement.textContent = todo.title || '';
        }

        if(this.titleInput)this.titleInput.value = todo.title || '';
        if(this.descInput) this.descInput.value = todo.description || '';
        if(this.notesInput) this.notesInput.value = todo.notes || '';
        if(this.dateInput) this.dateInput.value = todo.dueDate || '';

        if(this.projectSelect){
           
            this.projectSelect.value = todo.project || 'General';
            this.updateProjectDotColor(todo.project || 'General');
        }

        if(this.prioritySelect){
            this.prioritySelect.value = todo.priority || 'Low';
            this.updatePriorityColors(todo.priority || 'Low');
        }

        this.currentCheckList = todo.checklist ? [...todo.checklist] : [];
        this.renderChecklistUI();

        this.panel.classList.add('open');

   }

   close(){
        this.panel.classList.remove('open');
   }

   initEvents(){
        const closeBtn = this.panel.querySelector('#close-details');
        if(closeBtn){
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if(this.projectSelect){
            this.projectSelect.addEventListener('change',(e) => {
                this.updateProjectDotColor(e.target.value);
            });
        }
        if(this.prioritySelect){
            this.prioritySelect.addEventListener('change', (e) => {
                this.updatePriorityColors(e.target.value);
            });
        }

        const checklistInput = document.getElementById('checklist-input');

        if(checklistInput){
            checklistInput.addEventListener('keydown', (e) => {
                if(e.key === "Enter"){
                    e.preventDefault();
                    const text = checklistInput.value.trim();

                    if(text !== ''){
                        this.currentCheckList.push({text: text,completed:false});
                        checklistInput.value = '';
                        this.renderChecklistUI();
                    }
                }
            });
        }
   }
    onDelete(callback){
        this.deleteCallback = callback;
    }

   renderChecklistUI(){
        const container = document.getElementById('checklist-container');

        if(!container) return;

        container.innerHTML = '';

        this.currentCheckList.forEach((item) => {

            const itemEl = document.createElement('div');
            itemEl.classList.add('checklist-item');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.completed;

            checkbox.addEventListener('change',() =>{
                item.completed = checkbox.checked;
            });

            const span = document.createElement('span');
            span.textContent = item.text;

            itemEl.appendChild(checkbox);
            itemEl.append(span);
            container.appendChild(itemEl);
        });

        if(this.deleteBtn){
            this.deleteBtn.addEventListener('click',() =>{
                if(this.currentEditingid){
                    
                    if(this.deleteCallback){
                        this.deleteCallback(this.currentEditingid);
                    }
                    this.close();
                }
            })
        }
   }

  

   clearPanel(){
        this.currentCheckList = [];
        this.renderChecklistUI();
   }
}