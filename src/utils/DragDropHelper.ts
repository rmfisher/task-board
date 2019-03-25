interface Box {
  x: number
  y: number
  width: number
  height: number
}

class DragDropHelper {
  private tasks?: Box[][]
  private draggedTask?: Box

  public storeTaskLayout(taskBoardElement: HTMLDivElement, draggedTaskElement: HTMLDivElement) {
    this.draggedTask = {
      x: draggedTaskElement.offsetLeft,
      y: draggedTaskElement.offsetTop,
      width: draggedTaskElement.clientWidth,
      height: draggedTaskElement.clientHeight,
    }

    let tasks: Box[][] = []
    taskBoardElement.childNodes.forEach((categoryElement, i) => {
      tasks[i] = []
      let yOffset = 0
      if (categoryElement instanceof HTMLDivElement) {
        categoryElement.querySelectorAll('.task').forEach((taskElement, j) => {
          if (taskElement instanceof HTMLDivElement) {
            const x = taskElement.offsetLeft
            const y = taskElement.offsetTop - yOffset
            const width = taskElement.clientWidth
            const height = taskElement.clientHeight
            const box = { x, y, width, height }

            if (taskElement !== draggedTaskElement) {
              tasks[i].push(box)
            } else {
              yOffset += this.draggedTask!.height + 15
            }
          }
        })
      }
    })
    this.tasks = tasks
  }
}

export default DragDropHelper
