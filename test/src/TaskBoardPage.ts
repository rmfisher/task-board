export const goToTaskBoard = () => {
  browser.url('/task-board')
  browser.waitUntil(() => $('.task-board').isDisplayed())
}

export const getTaskCount = () => $$('.task-list .task').length

export const dragDropRandomTasks = (count: number) => {
  for (let i = 0; i < count; i++) {
    browser.waitUntil(() => $('.task-board:not(.dropping').isExisting())
    dragDropRandomTask()
  }
}

export const dragDropRandomTask = () => {
  const { listIndex, listCount, element } = pickRandomTask()
  const xDirection = listIndex === 0 ? 1 : listIndex === listCount - 1 ? -1 : undefined
  element.moveTo(20, 20)
  browser.buttonDown()
  browser.moveToElement(null, getRandomOffset(xDirection), getRandomOffset())
  browser.buttonUp()
}

export const pickRandomTask = () => {
  if (getTaskCount() === 0) {
    throw Error('Expecting at least one task to be present!')
  }

  const taskLists = $$('.task-list')
  while (true) {
    const listCount = taskLists.length
    const listIndex = Math.floor(listCount * Math.random())
    const taskList = taskLists[listIndex]
    const tasks = taskList.$$('.task')

    if (tasks.length > 0) {
      return { listIndex, listCount, element: tasks[Math.floor(tasks.length * Math.random())] }
    }
  }
}

export const getRandomOffset = (direction?: number) => {
  if (!direction) {
    direction = Math.random() > 0.5 ? 1 : -1
  }
  const amount = 200 + Math.random() * 800
  return Math.round(direction * amount)
}
