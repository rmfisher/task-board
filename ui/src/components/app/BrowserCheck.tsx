import React from 'react'
import { isIE } from '../../utils/utils'
import './BrowserCheck.scss'

const browserOk = !isIE()

const BrowserCheck: React.FunctionComponent<{}> = ({ children }) =>
  browserOk ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <div className="unsupported-browser">This page does not run on Internet Explorer.</div>
  )

export default BrowserCheck
