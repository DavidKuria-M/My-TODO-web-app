const STORAGE_KEY = 'todoflow_tasks';

export function getStoredTodos(){
    
    const data = localStorage.getItem(STORAGE_KEY);
    if(!data) return[];
    const parsed = JSON.parse(data);

    if(Array.isArray(parsed)){
        return parsed;
    }
    if(parsed && typeof parsed === 'object'){
        return [parsed];
    }


       

    
}

export function saveTodos(todos){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(todos));
}