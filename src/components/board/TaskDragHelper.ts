const BOARD_BOUNDS_PADDING = 10
const DRAG_START_THRESHOLD = 10
const CATEGORY_SNAP_THRESHOLD = 0.45

class DragDropHelper {
  private mouseDown: boolean = false
  private mouseStartX: number = 0
  private mouseStartY: number = 0
  private startX: number = 0
  private startY: number = 0
  private width!: number
  private height!: number
  private dragInProgress: boolean = false
  private draggedElement!: HTMLDivElement
  private boardElement!: HTMLDivElement
  private boardWidth!: number
  private boardHeight!: number
  private boardViewportX!: number
  private boardViewportY!: number
  private taskId!: string
  private taskIndex!: number
  private categoryIndex!: number
  private categories!: Array<{ x: number; width: number }>
  private tasks!: Array<Array<{ width: number; height: number }>>
  private taskLists!: number[]

  private onStart!: (
    taskId: string,
    taskIndex: number,
    taskHeight: number,
    categoryIndex: number,
    hoveredCategoryIndex?: number,
    hoveredTaskIndex?: number
  ) => void
  private onHover!: (hoveredCategoryIndex?: number, hoveredTaskIndex?: number) => void
  private onEnd!: () => void

  public onMouseDown(
    e: MouseEvent,
    draggedElement: HTMLDivElement,
    boardElement: HTMLDivElement,
    taskId: string,
    taskIndex: number,
    categoryIndex: number
  ) {
    if (e.button === 0) {
      e.preventDefault()
      this.mouseDown = true
      this.mouseStartX = e.clientX
      this.mouseStartY = e.clientY
      this.startX = draggedElement.offsetLeft
      this.startY = draggedElement.offsetTop
      this.width = draggedElement.clientWidth
      this.height = draggedElement.clientHeight
      this.draggedElement = draggedElement
      this.boardElement = boardElement
      this.boardWidth = boardElement.clientWidth
      this.boardHeight = boardElement.clientHeight
      const boardRect = boardElement.getBoundingClientRect()
      this.boardViewportX = boardRect.left
      this.boardViewportY = boardRect.top
      this.taskId = taskId
      this.taskIndex = taskIndex
      this.categoryIndex = categoryIndex

      this.categories = []
      this.tasks = []
      this.taskLists = []
      boardElement.childNodes.forEach((categoryElement, i) => {
        if (categoryElement instanceof HTMLDivElement) {
          this.categories.push({ x: categoryElement.offsetLeft, width: categoryElement.clientWidth })

          this.tasks[i] = []
          categoryElement.querySelectorAll('.task').forEach((taskElement, j) => {
            if (taskElement instanceof HTMLDivElement && taskElement !== draggedElement) {
              this.tasks[i].push({ width: taskElement.clientWidth, height: taskElement.clientHeight })
            }
          })

          const taskListElement = categoryElement.querySelector('.task-list')
          if (taskListElement instanceof HTMLDivElement) {
            this.taskLists[i] = taskListElement.offsetTop
          }
        }
      })
    } else {
      this.endDrag()
    }
  }

  public onMouseMove(e: MouseEvent) {
    if (this.mouseDown) {
      const deltaX = e.clientX - this.mouseStartX
      const deltaY = e.clientY - this.mouseStartY

      let dragJustStarted = false
      if (!this.dragInProgress && Math.hypot(deltaX, deltaY) > DRAG_START_THRESHOLD) {
        this.dragInProgress = true
        this.draggedElement.style.width = this.width + 'px'
        this.draggedElement.style.height = this.height + 'px'
        this.boardElement.style.height = this.boardHeight + 'px'
        dragJustStarted = true
      }

      if (this.dragInProgress) {
        const x = this.startX + deltaX
        const y = this.startY + deltaY
        const boardRect = this.boardElement.getBoundingClientRect()
        const viewportDeltaX = this.boardViewportX - boardRect.left
        const viewportDeltaY = this.boardViewportY - boardRect.top

        const minX = BOARD_BOUNDS_PADDING
        const minY = BOARD_BOUNDS_PADDING
        const maxX = this.boardWidth - this.width - BOARD_BOUNDS_PADDING
        const maxY = this.boardHeight - this.height - BOARD_BOUNDS_PADDING
        const clampedX = Math.max(minX, Math.min(maxX, x + viewportDeltaX))
        const clampedY = Math.max(minY, Math.min(maxY, y + viewportDeltaY))

        this.draggedElement.style.left = clampedX + 'px'
        this.draggedElement.style.top = clampedY + 'px'

        const { i, j } = this.getHoverLocation(clampedX, clampedY)

        if (dragJustStarted) {
          this.onStart(this.taskId, this.taskIndex, this.height, this.categoryIndex, i, j)
        } else {
          this.onHover(i, j)
        }
      }
    }
  }

  public endDrag() {
    this.mouseDown = false
    this.dragInProgress = false
    if (this.draggedElement) {
      this.draggedElement.style.left = null
      this.draggedElement.style.top = null
      this.draggedElement.style.width = null
      this.draggedElement.style.height = null
    }
    if (this.boardElement) {
      this.boardElement.style.height = null
    }
    this.onEnd()
  }

  public setOnStart(onStart: any) {
    this.onStart = onStart
  }

  public setOnHover(onHover: any) {
    this.onHover = onHover
  }

  public setOnEnd(onEnd: any) {
    this.onEnd = onEnd
  }

  private getHoverLocation(x: number, y: number) {
    const dragMidX = x + this.width / 2
    const dragMidY = y + this.height / 2

    let categoryIndex
    for (let i = 0; i < this.categories.length; i++) {
      const category = this.categories[i]
      const midX = category.x + category.width / 2
      const delta = Math.abs(dragMidX - midX)
      if (delta / category.width < CATEGORY_SNAP_THRESHOLD) {
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
        if (dragMidY > yOffset) {
          taskIndex = j + 1
        }
      }
    }

    if (categoryIndex !== undefined) {
      return { i: categoryIndex, j: taskIndex }
    } else {
      return { i: undefined, j: undefined }
    }
  }
}

export default DragDropHelper
