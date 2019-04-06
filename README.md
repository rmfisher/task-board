# task-board

A 2D task board in the style of Asana or JIRA.

https://rmfisher.github.io/task-board

This is not a fully functional app. I am mostly interested in the drag & drop behavior, animation, scrolling etc.

## Notes

* Works on touch devices, but is designed with larger screen sizes in mind (e.g. desktop or iPad).
* The task's (x, y) coordinates during drag are not managed by React, I directly update the dom to achieve a higher framerate.
