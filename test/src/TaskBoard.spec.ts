import { expect } from 'chai'
import { dragDropRandomTasks, getTaskCount, goToTaskBoard } from './TaskBoardPage'

describe('Task board', () => {
  it('works if random tasks are dragged and dropped repeatedly', () => {
    goToTaskBoard()

    const initialTaskCount = getTaskCount()
    dragDropRandomTasks(20)
    const finalTaskCount = getTaskCount()

    expect(finalTaskCount).to.eq(initialTaskCount)
  })
})
