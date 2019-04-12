import { expect } from 'chai'
import * as TaskBoardPage from './TaskBoardPage'

describe('Task board', () => {
  it('works if random tasks are dragged and dropped repeatedly', () => {
    TaskBoardPage.goToTaskBoard()

    const initialTaskCount = TaskBoardPage.getTaskCount()
    TaskBoardPage.dragDropRandomTasks(20)
    const finalTaskCount = TaskBoardPage.getTaskCount()

    expect(finalTaskCount).to.eq(initialTaskCount)
  })
})
