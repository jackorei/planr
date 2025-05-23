import { newProject } from "./project"
import { newTask } from "./todo"

export let alltasks = JSON.parse(localStorage.getItem('alltasks')) || []
export let allprojects = (JSON.parse(localStorage.getItem('allprojects')) || []).map(project => {
    const proj = newProject(project.name)
    proj.tasks.push(...project.tasks)
    return proj
})

export function updateAlltasksStorage() {
    localStorage.setItem('alltasks', JSON.stringify(alltasks))
}
export function updateAllprojectsStorage() {
    localStorage.setItem('allprojects', JSON.stringify(allprojects))
}

