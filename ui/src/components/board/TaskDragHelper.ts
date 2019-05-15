const BOARD_BOUNDS_X_INSET = 8
const BOARD_BOUNDS_Y_INSET = 0
const DRAG_START_THRESHOLD = 10
const HORIZONTAL_DROP_THRESHOLD = 0.5
const MARGIN_LEFT = 16
const RELEASE_TRANSITION_DURATION = 180
const BOARD_HEIGHT_OFFSET = 28
const SCROLL_THRESHOLD = 5 // Scroll if dragged task outside viewport by at least this (in px).
const SCROLL_RATE = 0.6 // Pixels per ms.
const SCROLL_ACCELERATION = 750 // Time in ms to reach scroll rate.

class DragDropHelper {
  private mouseDown: boolean = false
  private mouseStartX: number = 0
  private mouseStartY: number = 0
  private mouseX: number = 0
  private mouseY: number = 0
  private startX: number = 0
  private startY: number = 0
  private width!: number
  private height!: number
  private dragInProgress: boolean = false
  private draggedElement!: HTMLDivElement
  private boardElement!: HTMLDivElement
  private boardWidth!: number
  private boardHeight!: number
  private taskId!: string
  private taskIndex!: number
  private columnIndex!: number
  private columns!: Array<{ x: number; width: number }>
  private tasks!: Array<Array<{ width: number; height: number }>>
  private taskLists!: number[]
  private hoveredColumnIndex?: number
  private hoveredTaskIndex?: number
  private scrollXAnimationDirection: number = 0
  private scrollYAnimationDirection: number = 0
  private scrollXAnimation?: { cancel: () => void }
  private scrollYAnimation?: { cancel: () => void }
  private horizontalScrollElement!: HTMLDivElement
  private scrollXOnDragStart: number = 0
  private scrollYOnDragStart: number = 0

  private onStart!: (
    taskId: string,
    taskIndex: number,
    taskHeight: number,
    columnIndex: number,
    hoveredColumnIndex?: number,
    hoveredTaskIndex?: number
  ) => void
  private onHover!: (hoveredColumnIndex?: number, hoveredTaskIndex?: number) => void
  private onDrop!: (hoveredColumnIndex?: number, hoveredTaskIndex?: number) => void
  private onEnd!: () => void

  public onMouseDown(
    mouseX: number,
    mouseY: number,
    draggedElement: HTMLDivElement,
    boardElement: HTMLDivElement,
    taskId: string,
    taskIndex: number,
    columnIndex: number
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
    this.taskId = taskId
    this.taskIndex = taskIndex
    this.columnIndex = columnIndex

    this.columns = []
    this.tasks = []
    this.taskLists = []
    boardElement.childNodes.forEach((columnElement, i) => {
      if (columnElement instanceof HTMLDivElement) {
        this.columns.push({ x: columnElement.offsetLeft, width: columnElement.clientWidth })

        this.tasks[i] = []
        columnElement.querySelectorAll('.task-container').forEach((taskElement, j) => {
          if (taskElement instanceof HTMLDivElement && taskElement !== draggedElement) {
            this.tasks[i].push({ width: taskElement.clientWidth, height: taskElement.clientHeight })
          }
        })

        const taskListElement = columnElement.querySelector('.task-list')
        if (taskListElement instanceof HTMLDivElement) {
          this.taskLists[i] = taskListElement.offsetTop
        }
      }
    })
    this.boardHeight = this.calculateBoardHeight()
    this.horizontalScrollElement = document.querySelector('.task-board-overflow-container') as HTMLDivElement
    this.scrollXOnDragStart = this.horizontalScrollElement.scrollLeft
    this.scrollYOnDragStart = window.scrollY
  }

  public onMouseMove(mouseX: number, mouseY: number) {
    if (this.mouseDown) {
      this.mouseX = mouseX
      this.mouseY = mouseY
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
        const viewportDeltaX = this.horizontalScrollElement.scrollLeft - this.scrollXOnDragStart
        const viewportDeltaY = window.scrollY - this.scrollYOnDragStart

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

        if (dragJustStarted) {
          this.onStart(
            this.taskId,
            this.taskIndex,
            this.height,
            this.columnIndex,
            this.hoveredColumnIndex,
            this.hoveredTaskIndex
          )
          this.draggedElement.classList.add('dragged')
          this.draggedElement.classList.remove('creating')
        } else {
          this.onHover(this.hoveredColumnIndex, this.hoveredTaskIndex)
        }

        this.checkForScroll(xAdjusted, yAdjusted)
      }
    }
  }

  public endDrag() {
    if (this.dragInProgress) {
      this.draggedElement.classList.add('released')
      this.draggedElement.classList.remove('dragged')

      let hoverStartX: number, hoverStartY: number
      const i = this.hoveredColumnIndex
      const j = this.hoveredTaskIndex
      if (i !== undefined && j !== undefined) {
        hoverStartX = this.columns[i].x + MARGIN_LEFT
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

      this.onDrop(this.hoveredColumnIndex, this.hoveredTaskIndex)
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

    let columnIndex
    for (let i = 0; i < this.columns.length; i++) {
      const column = this.columns[i]
      const midX = column.x + column.width / 2
      const delta = Math.abs(dragMidX - midX)
      if (delta / column.width < HORIZONTAL_DROP_THRESHOLD) {
        columnIndex = i
        break
      }
    }

    let taskIndex = 0
    if (columnIndex !== undefined) {
      const tasks = this.tasks[columnIndex]
      let yOffset = this.taskLists[columnIndex]
      for (let j = 0; j < tasks.length; j++) {
        const task = tasks[j]
        yOffset += task.height
        if (dragMidY > yOffset) {
          taskIndex = j + 1
        }
      }
    }

    if (columnIndex !== undefined) {
      this.hoveredColumnIndex = columnIndex
      this.hoveredTaskIndex = taskIndex
    } else {
      this.hoveredColumnIndex = undefined
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

    this.hoveredColumnIndex = undefined
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

  private checkForScroll = (x: number, y: number) => {
    const { scrollX, scrollY } = this.getScrollDirections(x, y)
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

  private getScrollDirections = (x: number, y: number) => {
    const r = this.boardElement.getBoundingClientRect()

    let scrollX: number = 0
    let scrollY: number = 0
    if (r.left + x < -SCROLL_THRESHOLD) {
      scrollX = -1
    } else if (r.left + this.width + x > window.innerWidth + SCROLL_THRESHOLD) {
      scrollX = 1
    }

    if (r.top + y < -SCROLL_THRESHOLD) {
      scrollY = -1
    } else if (r.top + this.height + y > window.innerHeight + SCROLL_THRESHOLD) {
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
        const delta = timestamp - start
        const currentScrollRate = Math.min(Math.pow(delta / SCROLL_ACCELERATION, 2), SCROLL_RATE)
        const newScroll = initial + delta * currentScrollRate * (increasing ? 1 : -1)
        if (vertical) {
          window.scrollTo(0, newScroll)
          this.onMouseMove(this.mouseX, this.mouseY)
        } else {
          this.horizontalScrollElement.scrollTo(Math.min(newScroll, this.boardWidth - window.innerWidth), 0)
          this.onMouseMove(this.mouseX, this.mouseY)
        }

        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
    return { cancel: () => (cancelled = true) }
  }
}

export default DragDropHelper
