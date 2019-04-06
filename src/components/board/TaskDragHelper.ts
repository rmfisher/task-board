const BOARD_BOUNDS_X_INSET = 8
const BOARD_BOUNDS_Y_INSET = 0
const DRAG_START_THRESHOLD = 10
const CATEGORY_SNAP_THRESHOLD = 0.45
const MARGIN_LEFT = 16
const RELEASE_TRANSITION_DURATION = 180
const BOARD_HEIGHT_OFFSET = 28
const SCROLL_EDGE_LEFT = 10
const SCROLL_EDGE_RIGHT = -10
const SCROLL_EDGE_TOP = 20
const SCROLL_EDGE_BOTTOM = 40
const SCROLL_RATE = 0.8 // Pixels per ms.

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
  private hoveredCategoryIndex?: number
  private hoveredTaskIndex?: number
  private scrollXAnimationDirection: number = 0
  private scrollYAnimationDirection: number = 0
  private scrollXAnimation?: { cancel: () => void }
  private scrollYAnimation?: { cancel: () => void }
  private horizontalScrollElement!: HTMLDivElement

  private onStart!: (
    taskId: string,
    taskIndex: number,
    taskHeight: number,
    categoryIndex: number,
    hoveredCategoryIndex?: number,
    hoveredTaskIndex?: number
  ) => void
  private onHover!: (hoveredCategoryIndex?: number, hoveredTaskIndex?: number) => void
  private onDrop!: (hoveredCategoryIndex?: number, hoveredTaskIndex?: number) => void
  private onEnd!: () => void

  public onMouseDown(
    mouseX: number,
    mouseY: number,
    draggedElement: HTMLDivElement,
    boardElement: HTMLDivElement,
    taskId: string,
    taskIndex: number,
    categoryIndex: number
  ) {
    this.clearSelection()
    this.mouseDown = true
    this.mouseStartX = mouseX
    this.mouseStartY = mouseY
    this.startX = draggedElement.offsetLeft
    this.startY = draggedElement.offsetTop
    this.width = draggedElement.clientWidth
    this.height = draggedElement.clientHeight
    this.draggedElement = draggedElement
    this.boardElement = boardElement
    this.boardWidth = boardElement.clientWidth
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
    this.boardHeight = this.calculateBoardHeight()
    this.horizontalScrollElement = document.querySelector('.task-board-overflow-container') as HTMLDivElement
  }

  public onMouseMove(mouseX: number, mouseY: number) {
    if (this.mouseDown) {
      const deltaX = mouseX - this.mouseStartX
      const deltaY = mouseY - this.mouseStartY

      let dragJustStarted = false
      if (!this.dragInProgress && Math.hypot(deltaX, deltaY) > DRAG_START_THRESHOLD) {
        this.dragInProgress = true
        this.draggedElement.style.width = this.width + 'px'
        this.draggedElement.style.height = this.height + 'px'
        this.boardElement.style.minHeight = this.boardHeight + 'px'
        dragJustStarted = true
      }

      if (this.dragInProgress) {
        const x = this.startX + deltaX
        const y = this.startY + deltaY
        const boardRect = this.boardElement.getBoundingClientRect()
        const viewportDeltaX = this.boardViewportX - boardRect.left
        const viewportDeltaY = this.boardViewportY - boardRect.top

        const xAdjusted = x + viewportDeltaX
        const yAdjusted = y + viewportDeltaY

        const minX = BOARD_BOUNDS_X_INSET
        const minY = BOARD_BOUNDS_Y_INSET - 1
        const maxX = this.boardWidth - this.width - BOARD_BOUNDS_X_INSET
        const maxY = this.boardHeight - this.height - BOARD_BOUNDS_Y_INSET
        const clampedX = Math.max(minX, Math.min(maxX, xAdjusted))
        const clampedY = Math.max(minY, Math.min(maxY, yAdjusted))

        this.draggedElement.style.left = clampedX + 'px'
        this.draggedElement.style.top = clampedY + 'px'

        this.recordHoverLocation(clampedX, yAdjusted)
        this.checkForScroll()

        if (dragJustStarted) {
          this.onStart(
            this.taskId,
            this.taskIndex,
            this.height,
            this.categoryIndex,
            this.hoveredCategoryIndex,
            this.hoveredTaskIndex
          )
          this.draggedElement.classList.add('dragged')
        } else {
          this.onHover(this.hoveredCategoryIndex, this.hoveredTaskIndex)
        }
      }
    }
  }

  public endDrag() {
    if (this.dragInProgress) {
      this.draggedElement.classList.add('released')
      this.draggedElement.classList.remove('dragged')

      let hoverStartX: number, hoverStartY: number
      const i = this.hoveredCategoryIndex
      const j = this.hoveredTaskIndex
      if (i !== undefined && j !== undefined) {
        hoverStartX = this.categories[i].x + MARGIN_LEFT
        hoverStartY = this.tasks[i].reduce((r, t, k) => (k < j ? r + t.height : r), this.taskLists[i])
      }

      setTimeout(() => {
        const destX = hoverStartX !== undefined ? hoverStartX : this.startX
        const destY = hoverStartY !== undefined ? hoverStartY : this.startY
        this.draggedElement.style.left = destX + 'px'
        this.draggedElement.style.top = destY + 'px'
      }, 1)

      setTimeout(() => {
        this.cleanUp()
        this.onEnd()
      }, RELEASE_TRANSITION_DURATION)

      this.onDrop(this.hoveredCategoryIndex, this.hoveredTaskIndex)
    }

    if (this.scrollXAnimation) {
      this.scrollXAnimation.cancel()
      this.scrollXAnimation = undefined
    }
    if (this.scrollYAnimation) {
      this.scrollYAnimation.cancel()
      this.scrollYAnimation = undefined
    }
    this.scrollXAnimationDirection = 0
    this.scrollYAnimationDirection = 0
    this.dragInProgress = false
    this.mouseDown = false
  }

  public setOnStart(onStart: any) {
    this.onStart = onStart
  }

  public setOnHover(onHover: any) {
    this.onHover = onHover
  }

  public setOnDrop(onDrop: any) {
    this.onDrop = onDrop
  }

  public setOnEnd(onEnd: any) {
    this.onEnd = onEnd
  }

  private recordHoverLocation(x: number, y: number) {
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
      this.hoveredCategoryIndex = categoryIndex
      this.hoveredTaskIndex = taskIndex
    } else {
      this.hoveredCategoryIndex = undefined
      this.hoveredTaskIndex = undefined
    }
  }

  private cleanUp() {
    if (this.draggedElement) {
      this.draggedElement.classList.remove('released')
      this.draggedElement.style.left = null
      this.draggedElement.style.top = null
      this.draggedElement.style.width = null
      this.draggedElement.style.height = null
    }
    if (this.boardElement) {
      this.boardElement.style.minHeight = null
    }

    this.hoveredCategoryIndex = undefined
    this.hoveredTaskIndex = undefined
  }

  private calculateBoardHeight() {
    const maxTaskHeight = this.tasks.reduce((max, c, i) => {
      const height = c.reduce((sum, t) => sum + t.height, 0) + this.taskLists[i]
      return height > max ? height : max
    }, 0)
    const maxTaskBoardHeight = maxTaskHeight + this.draggedElement.clientHeight + BOARD_HEIGHT_OFFSET
    return Math.max(maxTaskBoardHeight, this.boardElement.clientHeight)
  }

  private clearSelection() {
    const selection = window.getSelection()
    if (!selection) return
    if (selection.empty) {
      selection.empty()
    } else if (selection.removeAllRanges) {
      selection.removeAllRanges()
    }
  }

  private checkForScroll = () => {
    const { scrollX, scrollY } = this.getScrollDirections()
    if (scrollX !== this.scrollXAnimationDirection) {
      if (this.scrollXAnimation) {
        this.scrollXAnimation.cancel()
      }
      if (scrollX !== 0) {
        this.scrollXAnimation = this.startScrollAnimation(false, scrollX > 0)
      }
      this.scrollXAnimationDirection = scrollX
    }
    if (scrollY !== this.scrollYAnimationDirection) {
      if (this.scrollYAnimation) {
        this.scrollYAnimation.cancel()
      }
      if (scrollY !== 0) {
        this.scrollYAnimation = this.startScrollAnimation(true, scrollY > 0)
      }
      this.scrollYAnimationDirection = scrollY
    }
  }

  private getScrollDirections = () => {
    const r = this.draggedElement.getBoundingClientRect()
    let scrollX: number = 0
    let scrollY: number = 0

    if (r.left < -SCROLL_EDGE_LEFT) {
      scrollX = -1
    } else if (r.right > window.innerWidth + SCROLL_EDGE_RIGHT) {
      scrollX = 1
    }

    if (r.top < -SCROLL_EDGE_TOP) {
      scrollY = -1
    } else if (r.bottom > window.innerHeight + SCROLL_EDGE_BOTTOM) {
      scrollY = 1
    }
    return { scrollX, scrollY }
  }

  private startScrollAnimation(vertical: boolean, increasing: boolean) {
    let cancelled = false
    const initial = vertical ? window.scrollY : this.horizontalScrollElement.scrollLeft
    let start: number
    const step = (timestamp: number) => {
      if (!cancelled) {
        if (!start) start = timestamp
        const amount = (timestamp - start) * SCROLL_RATE * (increasing ? 1 : -1)
        if (vertical) {
          window.scrollTo(0, initial + amount)
        } else {
          this.horizontalScrollElement.scrollTo(initial + amount, 0)
        }
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
    return { cancel: () => (cancelled = true) }
  }
}

export default DragDropHelper
