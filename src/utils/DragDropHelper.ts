const TASK_MARGIN = 15
const BOARD_BOUNDS_PADDING = 10

interface Box {
  x: number
  y: number
  width: number
  height: number
}

class DragDropHelper {
  private taskBoardBounds!: Box
  private draggedTask!: Box
  private tasks!: Box[][]

  public storeTaskLayout(taskBoardElement: HTMLDivElement, draggedTaskElement: HTMLDivElement) {
    this.taskBoardBounds = { x: 0, y: 0, width: taskBoardElement.clientWidth, height: taskBoardElement.clientHeight }

    this.draggedTask = {
      x: draggedTaskElement.offsetLeft,
      y: draggedTaskElement.offsetTop,
      width: draggedTaskElement.clientWidth,
      height: draggedTaskElement.clientHeight,
    }

    this.tasks = []
    taskBoardElement.childNodes.forEach((categoryElement, i) => {
      this.tasks[i] = []
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
              this.tasks[i].push(box)
            } else {
              yOffset += this.draggedTask.height + TASK_MARGIN
            }
          }
        })
      }
    })
  }

  public clampTaskPosition(x: number, y: number) {
    const minX = BOARD_BOUNDS_PADDING
    const minY = BOARD_BOUNDS_PADDING
    const maxX = this.taskBoardBounds.width - this.draggedTask.width - BOARD_BOUNDS_PADDING
    const maxY = this.taskBoardBounds.height - this.draggedTask.height - BOARD_BOUNDS_PADDING
    const clampedX = Math.max(minX, Math.min(maxX, x))
    const clampedY = Math.max(minY, Math.min(maxY, y))
    return { clampedX, clampedY }
  }
}

export default DragDropHelper
