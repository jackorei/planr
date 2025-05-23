export function newTask(title, desc, date, done = false ) {
    return { title, desc, date, done }
}