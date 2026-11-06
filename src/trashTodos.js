const TRASH_STORAGE_KEY = 'todoflow_trash_todos';

export function getStoredTrash(){
    const data = localStorage.getItem(TRASH_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveTrash(trashArray){
    localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(trashArray));
}
