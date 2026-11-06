export class Todo{
    constructor(title,description,notes,dueDate, priority,project, checklist = []){
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.completed = false;
        this.checklist = checklist;

    }
}