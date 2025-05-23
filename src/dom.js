import { newProject } from "./project";
import { newTask } from "./todo";
import { allprojects } from "./state";
import { alltasks } from "./state";
import { updateAlltasksStorage, updateAllprojectsStorage } from "./state"


const additem = document.querySelector(".additem")
const userprojects = document.querySelector(".userprojects")

const allbutton = document.querySelector("#allbutton")

const closeform2 = document.querySelector('#closeform2')
const detailsmodal = document.querySelector('#detailsmodal')
const detailtitle1 = document.querySelector('#detailtitlest')
const detailtitle2 = document.querySelector('#detailtitlestd')
const detailtitle3 = document.querySelector('#detailtitlesda')

const closeform3 = document.querySelector('#closeform3')
const editmodal = document.querySelector('#editmodal')
const edittitle = document.querySelector('#edittitle')
const editdesc = document.querySelector('#editdesc')
const editdate = document.querySelector('#editdate')
const edittask = document.querySelector('#edittask')

const newtaskform = document.querySelector("#newtaskform")
const entertask = document.querySelector("#entertask")
const closeform1 = document.querySelector("#closeform1")
const tasktitle = document.querySelector("#tasktitle")
const taskdesc = document.querySelector("#taskdesc")
const taskdate = document.querySelector("#taskdate")
const addingproject = document.querySelector('#addproject')

const hamburger = document.querySelector("#hamburger")
const sidebar = document.querySelector(".sidebar")

const sidebarWasOpen = localStorage.getItem('sidebarOpen') === 'true';
if (sidebarWasOpen) {
    sidebar.classList.add('open');
}

let currentTaskArray = alltasks
let editingTask = null

displayProject(allprojects)

const lastView = localStorage.getItem('lastView')

if (lastView === 'Inbox' || !lastView) {
    loadDisplay('Inbox', alltasks, allbutton)
} else {
    const matchingProject = allprojects.find(p => p.name === lastView)
    if (matchingProject) {
        const btn = displayProject(allprojects, matchingProject.name)
        loadDisplay(matchingProject.name, matchingProject.tasks, btn)
    } else {
        loadDisplay('Inbox', alltasks, allbutton)
    }
}

function clickEffect(clickedBtn) {
    const allSidebarButtons = document.querySelectorAll('.navitem, .userproject')
    allSidebarButtons.forEach(btn => btn.classList.remove('active-sidebar'))

    clickedBtn.classList.add('active-sidebar')
}

function loadDisplay(title, taskArray, button = null) {
    currentTaskArray = taskArray
    localStorage.setItem('lastView', title)

    if (!button) {
        const allSidebarButtons = document.querySelectorAll('.navitem, .userproject')
        button = Array.from(allSidebarButtons).find(btn => btn.textContent.trim() === title)
    }

    if (button) clickEffect(button)

    const taskdisplay = document.querySelector('.taskdisplay')
    taskdisplay.textContent = ''
    const displaytitle = document.querySelector('.displaytitle')
    displaytitle.textContent = title

    const displayableTasks = taskArray
    displayableTasks.forEach(task => displayTask(task))
}


hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open')
    const isOpen = sidebar.classList.contains('open')
    localStorage.setItem('sidebarOpen', isOpen)
})


allbutton.addEventListener('click', () => {
    loadDisplay('Inbox', alltasks, allbutton)
})


additem.addEventListener('click', () => {
    newtaskform.showModal()
})

closeform1.addEventListener('click', () => {
    const inputs = [tasktitle, taskdesc, taskdate]
    inputs.forEach(input => {
        input.style.border = ''
    })
    newtaskform.close()
    tasktitle.value = ''
    taskdesc.value = ''
    taskdate.value = ''
})

function makeTask(array) {
    const inputs = [tasktitle, taskdesc, taskdate]
    let allFilled = true

    inputs.forEach(input => {
        if (input.value === '') {
            input.style.border = '1px solid rgb(214, 70, 70)'
            allFilled = false
        }
        else {
            input.style.border = ''
        }  
    });

    if (!allFilled) return

    const newtasktitle = tasktitle.value
    const newtaskdesc = taskdesc.value
    const newtaskdate = taskdate.value

    const task = newTask(newtasktitle, newtaskdesc, newtaskdate)
    array.push(task)
    displayTask(task)

    if (array === alltasks) {
        updateAlltasksStorage()
    }
    else {
        updateAllprojectsStorage()
    }

    tasktitle.value = ''
    taskdesc.value = ''
    taskdate.value = ''
    newtaskform.close()
}

entertask.addEventListener('click', () => {
    makeTask(currentTaskArray)
})


function displayTask(task) {
    const {title, desc, date, done} = task
    const checkbox = document.createElement('input')
    checkbox.checked = done
    checkbox.type = 'checkbox'
    checkbox.id = 'checkbox'
    const checkboxwrapper = document.createElement('div')
    checkboxwrapper.classList.add('checkboxwrapper')
    const round = document.createElement('div')
    round.classList.add('round')
    const checkboxlabel = document.createElement('label')
    checkboxlabel.setAttribute('for', 'checkbox')
    checkboxwrapper.appendChild(round)
    round.appendChild(checkbox)
    round.appendChild(checkboxlabel)


    const displaycontain = document.querySelector('.displaycontain')
    const taskdisplay = document.querySelector('.taskdisplay')
    const taskbox = document.createElement('div')
    taskbox.id = 'task'
    const splitup1 = document.createElement('div')
    splitup1.classList.add('splitup')
    const splitup2 = document.createElement('div')
    splitup2.classList.add('splitup')
    displaycontain.appendChild(taskdisplay)
    taskdisplay.appendChild(taskbox)

    taskbox.style.opacity = 0;
    taskbox.style.transition = 'opacity 0.3s ease';
    setTimeout(() => taskbox.style.opacity = 1, 10);
    
    taskbox.appendChild(splitup1)
    taskbox.appendChild(splitup2)

    const displaytitle = document.createElement('div')
    displaytitle.id = 'displaytitle'
    displaytitle.textContent = title
    splitup1.appendChild(checkboxwrapper)
    splitup1.appendChild(displaytitle)

    const displaydate = document.createElement('div')
    displaydate.id = 'displaydate'
    displaydate.textContent = date
    const taskdetails = document.createElement('button')
    taskdetails.id = 'taskdetails'
    taskdetails.textContent = 'Details'
    taskdetails.addEventListener('click', () => {
        detailsmodal.showModal()
        detailtitle1.textContent = title
        detailtitle2.textContent = `Description: ${desc}`
        detailtitle3.textContent = `Date: ${date}`
    })
    closeform2.addEventListener('click', () => {
        detailsmodal.close()
        detailtitle1.textContent = ''
        detailtitle2.textContent = ''
        detailtitle3.textContent = ''
    })

    const taskedit = document.createElement('button')
    taskedit.id = 'taskedit'
    taskedit.textContent = 'Edit'

    taskedit.addEventListener('click', () => {
        editmodal.showModal()
        edittitle.value = task.title
        editdesc.value = task.desc
        editdate.value = task.date
        editingTask = task
    })

    const taskremove = document.createElement('button')
    taskremove.id = 'taskremove'
    taskremove.textContent = '×'

    taskremove.addEventListener('click', () => {
        taskbox.remove()
    
        const fromInbox = alltasks.findIndex(t => t.title === title && t.date === date)
        if (fromInbox > -1) {
            alltasks.splice(fromInbox, 1)
            updateAlltasksStorage()
            return
        }
    
        for (const project of allprojects) {
            const idx = project.tasks.findIndex(t => t.title === title && t.date === date)
            if (idx > -1) {
                project.tasks.splice(idx, 1)
                updateAllprojectsStorage()
                break
            }
        }
    })

    splitup2.appendChild(displaydate)
    splitup2.appendChild(taskdetails)
    splitup2.appendChild(taskedit)
    splitup2.appendChild(taskremove)


    function updateTaskVisualState() {
        if (task.done) {
            displaytitle.style.textDecoration = 'line-through'
            displaydate.style.opacity = '0.5'
            taskdetails.style.opacity = '0.5'
            taskedit.style.opacity = '0.5'
            displaytitle.style.opacity = '0.5'

            taskdetails.disabled = true
            taskedit.disabled = true
            taskdetails.style.cursor = 'not-allowed'
            taskedit.style.cursor = 'not-allowed'
        } else {
            displaytitle.style.textDecoration = 'none'
            
            displaydate.style.opacity = '1'
            taskdetails.style.opacity = '1'
            taskedit.style.opacity = '1'
            displaytitle.style.opacity = '1'
            taskdetails.disabled = false
            taskedit.disabled = false
            taskdetails.style.cursor = 'pointer'
            taskedit.style.cursor = 'pointer'
        }
    }

    checkbox.addEventListener('change', () => {
        task.done = checkbox.checked
        updateAllprojectsStorage()
        updateAlltasksStorage()
        updateTaskVisualState()
    })

    updateTaskVisualState()
}

edittask.addEventListener('click', () => {
    if (!editingTask) return
    if (task.done) return

    editingTask.title = edittitle.value
    editingTask.desc = editdesc.value
    editingTask.date = editdate.value

    updateAlltasksStorage()
    updateAllprojectsStorage()

    editmodal.close()
    editingTask = null

    edittitle.value = ''
    editdesc.value = ''
    editdate.value = ''

    loadDisplay(localStorage.getItem('lastView'), currentTaskArray)
})

closeform3.addEventListener('click', () => {
    editmodal.close()
    edittitle.value = ''
    editdesc.value = ''
    editdate.value = ''
})

addingproject.addEventListener('click', () => {
    addingproject.style.display = 'none'
    userprojects.querySelector('.userprojects')
    const projectinput = document.createElement('input')
    projectinput.type = 'text'
    projectinput.placeholder = 'Enter name'
    projectinput.id = 'projectinput'
    const projectinpcontainer = document.createElement('div')
    projectinpcontainer.id = 'projectinpcontainer'
    const projectenter = document.createElement('button')
    projectenter.id = 'projectenter'
    projectenter.textContent = 'Add'
    const projectcancel = document.createElement('button')
    projectcancel.id = 'projectcancel'
    projectcancel.textContent = 'Cancel'
    userprojects.appendChild(projectinput)
    userprojects.appendChild(projectinpcontainer)
    projectinpcontainer.appendChild(projectenter)
    projectinpcontainer.appendChild(projectcancel)
    projectinput.focus();
    projectenter.addEventListener('click', () => {
        const projectnameinput = projectinput.value.trim();

        if (projectnameinput === '') {
            projectinput.style.border = '1px solid rgb(214, 70, 70)'
        }
        const isDuplicate = allprojects.some(p => p.name.toLowerCase() === projectnameinput.toLowerCase());
        if (isDuplicate) {
            projectinput.style.border = '1px solid rgb(214, 70, 70)';
            return;
        }

        const proj = newProject(projectnameinput)
        allprojects.push(proj)
        updateAllprojectsStorage()
        displayProject(allprojects)
        projectinput.remove()
        projectenter.remove()
        addingproject.style.display = '' 

    })
    projectinput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (projectinput.value === '') {
                projectinput.style.border = '1px solid rgb(214, 70, 70)'
            }
            else {
                const projectnameinput = projectinput.value
                const proj = newProject(projectnameinput)
                allprojects.push(proj)
                updateAllprojectsStorage()
                displayProject(allprojects)
                projectinput.remove()
                projectenter.remove()
                addingproject.style.display = '' 
            }
        }
    })
    projectinput.addEventListener('keydown', () => {
        projectinput.style.border = ''
    })
    projectcancel.addEventListener('click', () => {
        projectinput.remove()
        projectenter.remove()
        projectcancel.remove()
        projectinpcontainer.remove()
        addingproject.style.display = 'block' 

    })
})

function displayProject(projects, activeName = null) {
    const userprojects = document.querySelector('.userprojects')
    userprojects.innerHTML = ''

    let activeBtn = null

    projects.forEach(project => {
        const userproject = document.createElement('button')
        userproject.classList.add('userproject')
        userprojects.appendChild(userproject)
        userproject.textContent = project.name

        if (project.name === activeName) {
            activeBtn = userproject
        }

        const removeproject = document.createElement('button')
        removeproject.id = 'removeproject'
        removeproject.textContent = '×'
        userproject.addEventListener('click', () => {
            loadDisplay(project.name, project.tasks, userproject)
        })
        removeproject.addEventListener('click', (e) => {
            e.stopPropagation()

            userproject.remove()
            const index = allprojects.findIndex(p => p.name === project.name)
            if (index > -1) {
                allprojects.splice(project, 1)
            }
            updateAllprojectsStorage()
            loadDisplay('Inbox', alltasks, allbutton)
        })

        userproject.appendChild(removeproject)

    });
    return activeBtn
}

