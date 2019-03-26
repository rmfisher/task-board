const TASK_MARGIN = 15
const BOARD_BOUNDS_PADDING = 10
const CATEGORY_X_THRESHOLD = 0.35

class DragDropHelper {
  private boardWidth!: number
  private boardHeight!: number
  private draggedTaskWidth!: number
  private draggedTaskHeight!: number
  private categories!: Array<{ x: number; width: number }>
  private tasks!: Array<Array<{ width: number; height: number }>>
  private taskLists!: number[]

  public storeTaskLayout(taskBoardElement: HTMLDivElement, draggedTaskElement: HTMLDivElement) {
    this.boardWidth = taskBoardElement.clientWidth
    this.boardHeight = taskBoardElement.clientHeight

    this.draggedTaskWidth = draggedTaskElement.clientWidth
    this.draggedTaskHeight = draggedTaskElement.clientHeight

    this.categories = []
    this.tasks = []
    this.taskLists = []
    taskBoardElement.childNodes.forEach((categoryElement, i) => {
      if (categoryElement instanceof HTMLDivElement) {
        this.categories.push({ x: categoryElement.offsetLeft, width: categoryElement.clientWidth })

        this.tasks[i] = []
        categoryElement.querySelectorAll('.task').forEach((taskElement, j) => {
          if (taskElement instanceof HTMLDivElement && taskElement !== draggedTaskElement) {
            this.tasks[i].push({ width: taskElement.clientWidth, height: taskElement.clientHeight })
          }
        })

        const taskListElement = categoryElement.querySelector('.task-list')
        if (taskListElement instanceof HTMLDivElement) {
          this.taskLists[i] = taskListElement.offsetTop
        }
      }
    })
  }

  public clampPosition(x: number, y: number) {
    const minX = BOARD_BOUNDS_PADDING
    const minY = BOARD_BOUNDS_PADDING
    const maxX = this.boardWidth - this.draggedTaskWidth - BOARD_BOUNDS_PADDING
    const maxY = this.boardHeight - this.draggedTaskHeight - BOARD_BOUNDS_PADDING
    const clampedX = Math.max(minX, Math.min(maxX, x))
    const clampedY = Math.max(minY, Math.min(maxY, y))
    return { clampedX, clampedY }
  }

  public getHoverLocation(x: number, y: number) {
    const dragMidX = x + this.draggedTaskWidth / 2
    const dragMidY = y + this.draggedTaskHeight / 2

    let categoryIndex
    for (let i = 0; i < this.categories.length; i++) {
      const category = this.categories[i]
      const midX = category.x + category.width / 2
      const delta = Math.abs(dragMidX - midX)
      if (delta / category.width < CATEGORY_X_THRESHOLD) {
        categoryIndex = i
        break
      }
    }

    let taskIndex = 0
    if (categoryIndex !== undefined) {
      const tasks = this.tasks[categoryIndex]
      let yOffset = this.taskLists[categoryIndex]
      for (let j = 0; j < tasks.length; j++) {
        const task = tasks[j]
        yOffset += task.height
        if (dragMidY > yOffset + TASK_MARGIN / 2) {
          taskIndex = j + 1
        }
        yOffset += TASK_MARGIN
      }
    }

    return categoryIndex !== undefined ? { i: categoryIndex, j: taskIndex } : null
  }
}

export default DragDropHelper
