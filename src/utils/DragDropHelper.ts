interface Box {
  x: number
  y: number
  width: number
  height: number
}

class DragDropHelper {
  private tasks?: Box[][]
  private draggedTask?: Box

  public storeTaskLayout(taskBoardElement: HTMLDivElement, draggedCategoryIndex: number, draggedTaskIndex: number) {
    let tasks: Box[][] = []
    taskBoardElement.childNodes.forEach((categoryElement, i) => {
      tasks[i] = []
      if (categoryElement instanceof HTMLDivElement) {
        categoryElement.querySelectorAll('.task').forEach((taskElement, j) => {
          if (taskElement instanceof HTMLDivElement) {
            const x = taskElement.offsetLeft
            const y = taskElement.offsetTop
            const width = taskElement.clientWidth
            const height = taskElement.clientHeight
            const box = { x, y, width, height }

            if (draggedCategoryIndex !== i || draggedTaskIndex !== j) {
              tasks[i].push(box)
            }
          }
        })
      }
    })
    this.tasks = tasks
    console.log(JSON.stringify(tasks))
  }
}

export default DragDropHelper
