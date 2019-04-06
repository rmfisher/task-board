(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[,,,,,,,,,,,function(e,t,a){e.exports=a(22)},,,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),i=a(9),s=a.n(i),r=a(1),l=a(2),d=a(4),h=a(3),c=a(5),u=a(10),g=a.n(u),m=(a(17),function(e){var t=e.users;return o.a.createElement("div",{className:"header"},o.a.createElement("h1",null,o.a.createElement("a",{href:"https://www.github.com/rmfisher/task-board"},"Bug Tracking")),o.a.createElement("div",{className:"avatars"},t.map(function(e){return o.a.createElement("div",{key:e.id,className:"avatar "+e.label})})))}),v=a(6),p=a(7),f=function(){return o.a.createElement("svg",{className:"icon",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},o.a.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}),o.a.createElement("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",className:"fill"}))},k=function(){return o.a.createElement("svg",{className:"icon",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},o.a.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}),o.a.createElement("path",{className:"fill",d:"M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"}))},E=(a(18),function(e){var t=e.task,a=e.rootRef;return o.a.createElement("div",{className:"task",ref:a},o.a.createElement("div",{className:"task-content"},o.a.createElement("div",{className:"top-row"},o.a.createElement("div",{className:"description"},t.description),o.a.createElement("button",{className:"plain"},o.a.createElement(k,null))),o.a.createElement("div",{className:"avatar "+t.userLabel}),o.a.createElement("div",{className:"labels"},t.labels.map(function(e){return o.a.createElement("div",{key:e.name,className:"label "+e.color},e.name)}))))}),b=function(e){function t(){var e,a;Object(r.a)(this,t);for(var n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];return(a=Object(d.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(o)))).rootElement=void 0,a.handleMouseDown=function(e){0===e.button?(e.preventDefault(),a.props.onMouseDown(e.clientX,e.clientY,a.rootElement,a.props.task.id,a.props.taskIndex,a.props.categoryIndex)):a.handleMouseUp()},a.handleTouchStart=function(e){1===e.touches.length&&(e.preventDefault(),a.props.onMouseDown(e.touches[0].clientX,e.touches[0].clientY,a.rootElement,a.props.task.id,a.props.taskIndex,a.props.categoryIndex))},a.handleMouseMove=function(e){a.props.onMouseMove(e.clientX,e.clientY)},a.handleTouchMove=function(e){e.changedTouches.length>0&&a.props.onMouseMove(e.changedTouches[0].clientX,e.changedTouches[0].clientY)},a.handleMouseUp=function(){a.props.onMouseUp()},a}return Object(c.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){this.rootElement.addEventListener("mousedown",this.handleMouseDown),this.rootElement.addEventListener("touchstart",this.handleTouchStart),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("touchmove",this.handleTouchMove),window.addEventListener("mouseup",this.handleMouseUp),window.addEventListener("blur",this.handleMouseUp),window.addEventListener("touchend",this.handleMouseUp)}},{key:"componentWillUnmount",value:function(){this.rootElement.removeEventListener("mousedown",this.handleMouseDown),this.rootElement.removeEventListener("touchstart",this.handleTouchStart),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("touchmove",this.handleTouchMove),window.removeEventListener("mouseup",this.handleMouseUp),window.removeEventListener("blur",this.handleMouseUp),window.addEventListener("touchend",this.handleMouseUp)}},{key:"render",value:function(){var e=this;return o.a.createElement(E,{task:this.props.task,rootRef:function(t){return e.rootElement=t}})}}]),t}(o.a.Component),w=8,y=5,M=function(){function e(){var t=this;Object(r.a)(this,e),this.mouseDown=!1,this.mouseStartX=0,this.mouseStartY=0,this.mouseX=0,this.mouseY=0,this.startX=0,this.startY=0,this.width=void 0,this.height=void 0,this.dragInProgress=!1,this.draggedElement=void 0,this.boardElement=void 0,this.boardWidth=void 0,this.boardHeight=void 0,this.taskId=void 0,this.taskIndex=void 0,this.categoryIndex=void 0,this.categories=void 0,this.tasks=void 0,this.taskLists=void 0,this.hoveredCategoryIndex=void 0,this.hoveredTaskIndex=void 0,this.scrollXAnimationDirection=0,this.scrollYAnimationDirection=0,this.scrollXAnimation=void 0,this.scrollYAnimation=void 0,this.horizontalScrollElement=void 0,this.scrollXOnDragStart=0,this.scrollYOnDragStart=0,this.onStart=void 0,this.onHover=void 0,this.onDrop=void 0,this.onEnd=void 0,this.checkForScroll=function(e,a){var n=t.getScrollDirections(e,a),o=n.scrollX,i=n.scrollY;o!==t.scrollXAnimationDirection&&(t.scrollXAnimation&&t.scrollXAnimation.cancel(),0!==o&&(t.scrollXAnimation=t.startScrollAnimation(!1,o>0)),t.scrollXAnimationDirection=o),i!==t.scrollYAnimationDirection&&(t.scrollYAnimation&&t.scrollYAnimation.cancel(),0!==i&&(t.scrollYAnimation=t.startScrollAnimation(!0,i>0)),t.scrollYAnimationDirection=i)},this.getScrollDirections=function(e,a){var n=t.boardElement.getBoundingClientRect(),o=0,i=0;return n.left+e<-y?o=-1:n.left+t.width+e>window.innerWidth+y&&(o=1),n.top+a+w<-y?i=-1:n.top+t.height+a-w>window.innerHeight+y&&(i=1),{scrollX:o,scrollY:i}}}return Object(l.a)(e,[{key:"onMouseDown",value:function(e,t,a,n,o,i,s){var r=this;this.clearSelection(),this.mouseDown=!0,this.mouseStartX=e,this.mouseStartY=t,this.startX=a.offsetLeft,this.startY=a.offsetTop,this.width=a.clientWidth,this.height=a.clientHeight,this.draggedElement=a,this.boardElement=n,this.boardWidth=n.clientWidth,this.taskId=o,this.taskIndex=i,this.categoryIndex=s,this.categories=[],this.tasks=[],this.taskLists=[],n.childNodes.forEach(function(e,t){if(e instanceof HTMLDivElement){r.categories.push({x:e.offsetLeft,width:e.clientWidth}),r.tasks[t]=[],e.querySelectorAll(".task").forEach(function(e,n){e instanceof HTMLDivElement&&e!==a&&r.tasks[t].push({width:e.clientWidth,height:e.clientHeight})});var n=e.querySelector(".task-list");n instanceof HTMLDivElement&&(r.taskLists[t]=n.offsetTop)}}),this.boardHeight=this.calculateBoardHeight(),this.horizontalScrollElement=document.querySelector(".task-board-overflow-container"),this.scrollXOnDragStart=this.horizontalScrollElement.scrollLeft,this.scrollYOnDragStart=window.scrollY}},{key:"onMouseMove",value:function(e,t){if(this.mouseDown){this.mouseX=e,this.mouseY=t;var a=e-this.mouseStartX,n=t-this.mouseStartY,o=!1;if(!this.dragInProgress&&Math.hypot(a,n)>10&&(this.dragInProgress=!0,this.draggedElement.style.width=this.width+"px",this.draggedElement.style.height=this.height+"px",this.boardElement.style.minHeight=this.boardHeight+"px",o=!0),this.dragInProgress){var i=this.startX+a,s=this.startY+n,r=i+(this.horizontalScrollElement.scrollLeft-this.scrollXOnDragStart),l=s+(window.scrollY-this.scrollYOnDragStart),d=this.boardWidth-this.width-8,h=this.boardHeight-this.height-0,c=Math.max(8,Math.min(d,r)),u=Math.max(-1,Math.min(h,l));this.draggedElement.style.left=c+"px",this.draggedElement.style.top=u+"px",this.recordHoverLocation(c,l),o?(this.onStart(this.taskId,this.taskIndex,this.height,this.categoryIndex,this.hoveredCategoryIndex,this.hoveredTaskIndex),this.draggedElement.classList.add("dragged")):this.onHover(this.hoveredCategoryIndex,this.hoveredTaskIndex),this.checkForScroll(r,l)}}}},{key:"endDrag",value:function(){var e=this;if(this.dragInProgress){var t,a;this.draggedElement.classList.add("released"),this.draggedElement.classList.remove("dragged");var n=this.hoveredCategoryIndex,o=this.hoveredTaskIndex;void 0!==n&&void 0!==o&&(t=this.categories[n].x+16,a=this.tasks[n].reduce(function(e,t,a){return a<o?e+t.height:e},this.taskLists[n])),setTimeout(function(){var n=void 0!==t?t:e.startX,o=void 0!==a?a:e.startY;e.draggedElement.style.left=n+"px",e.draggedElement.style.top=o+"px"},1),setTimeout(function(){e.cleanUp(),e.onEnd()},180),this.onDrop(this.hoveredCategoryIndex,this.hoveredTaskIndex)}this.scrollXAnimation&&(this.scrollXAnimation.cancel(),this.scrollXAnimation=void 0),this.scrollYAnimation&&(this.scrollYAnimation.cancel(),this.scrollYAnimation=void 0),this.scrollXAnimationDirection=0,this.scrollYAnimationDirection=0,this.dragInProgress=!1,this.mouseDown=!1}},{key:"setOnStart",value:function(e){this.onStart=e}},{key:"setOnHover",value:function(e){this.onHover=e}},{key:"setOnDrop",value:function(e){this.onDrop=e}},{key:"setOnEnd",value:function(e){this.onEnd=e}},{key:"recordHoverLocation",value:function(e,t){for(var a,n=e+this.width/2,o=t+this.height/2,i=0;i<this.categories.length;i++){var s=this.categories[i],r=s.x+s.width/2;if(Math.abs(n-r)/s.width<.45){a=i;break}}var l=0;if(void 0!==a)for(var d=this.tasks[a],h=this.taskLists[a],c=0;c<d.length;c++){o>(h+=d[c].height)&&(l=c+1)}void 0!==a?(this.hoveredCategoryIndex=a,this.hoveredTaskIndex=l):(this.hoveredCategoryIndex=void 0,this.hoveredTaskIndex=void 0)}},{key:"cleanUp",value:function(){this.draggedElement&&(this.draggedElement.classList.remove("released"),this.draggedElement.style.left=null,this.draggedElement.style.top=null,this.draggedElement.style.width=null,this.draggedElement.style.height=null),this.boardElement&&(this.boardElement.style.minHeight=null),this.hoveredCategoryIndex=void 0,this.hoveredTaskIndex=void 0}},{key:"calculateBoardHeight",value:function(){var e=this,t=this.tasks.reduce(function(t,a,n){var o=a.reduce(function(e,t){return e+t.height},0)+e.taskLists[n];return o>t?o:t},0)+this.draggedElement.clientHeight+28;return Math.max(t,this.boardElement.clientHeight)}},{key:"clearSelection",value:function(){var e=window.getSelection();e&&(e.empty?e.empty():e.removeAllRanges&&e.removeAllRanges())}},{key:"startScrollAnimation",value:function(e,t){var a,n=this,o=!1,i=e?window.scrollY:this.horizontalScrollElement.scrollLeft;return window.requestAnimationFrame(function s(r){if(!o){a||(a=r);var l=r-a,d=Math.min(Math.pow(l/750,2),.6),h=i+l*d*(t?1:-1);e?(window.scrollTo(0,h),n.onMouseMove(n.mouseX,n.mouseY)):(n.horizontalScrollElement.scrollTo(Math.min(h,n.boardWidth-window.innerWidth),0),n.onMouseMove(n.mouseX,n.mouseY)),window.requestAnimationFrame(s)}}),{cancel:function(){return o=!0}}}}]),e}(),x=(a(19),function(e){function t(){var e,a;Object(r.a)(this,t);for(var n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];return(a=Object(d.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(o)))).state={height:a.props.expanded?a.props.height:0},a}return Object(c.a)(t,e),Object(l.a)(t,[{key:"componentDidUpdate",value:function(e){e.expanded!==this.props.expanded&&this.setState({height:this.props.expanded?this.props.height:0})}},{key:"render",value:function(){var e=this.props.expanded,t=this.state.height;return o.a.createElement("div",{className:"placeholder"+(e?" expanded":""),style:{height:t}},o.a.createElement("div",{className:"placeholder-fill"}))}}]),t}(o.a.Component)),I=(a(20),function(e){function t(){var e,a;Object(r.a)(this,t);for(var n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];return(a=Object(d.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(o)))).state={dropping:!1},a.rootElement=void 0,a.dragHelper=new M,a.handleMouseDown=function(e,t,n,o,i,s){a.dragHelper.onMouseDown(e,t,n,a.rootElement,o,i,s)},a.handleMouseMove=function(e,t){a.dragHelper.onMouseMove(e,t)},a.handleMouseUp=function(){a.dragHelper.endDrag()},a.handleDragStart=function(e,t,n,o,i,s){a.setState({dragState:{draggedTaskId:e,draggedTaskIndex:t,draggedTaskHeight:n,draggedCategoryIndex:o,hoveredCategoryIndex:i,hoveredTaskIndex:s},dataSnapshot:a.props.data})},a.handleDragHover=function(e,t){var n=a.state.dragState;e===n.hoveredCategoryIndex&&t===n.hoveredTaskIndex||a.setState({dragState:Object(p.a)({},n,{hoveredCategoryIndex:e,hoveredTaskIndex:t})})},a.handleDragDrop=function(e,t){if(a.setState({dropping:!0}),void 0!==e&&void 0!==t){var n=a.state.dragState,o=n.draggedCategoryIndex,i=n.draggedTaskIndex;o===e&&i===t||a.notifyChange(o,i,e,t)}},a.handleDragEnd=function(){a.setState({dataSnapshot:void 0,dragState:void 0,dropping:!1})},a}return Object(c.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){this.dragHelper.setOnStart(this.handleDragStart),this.dragHelper.setOnHover(this.handleDragHover),this.dragHelper.setOnDrop(this.handleDragDrop),this.dragHelper.setOnEnd(this.handleDragEnd)}},{key:"render",value:function(){var e=this,t=this.props.data,a=this.state,n=a.dataSnapshot,i=a.dragState,s=a.dropping;return o.a.createElement("div",{className:"task-board"+(s?" dropping":""),ref:function(t){return e.rootElement=t}},(n||t).map(function(t,a){var n=i&&i.hoveredCategoryIndex===a;return o.a.createElement("div",{key:t.id,className:"category"},o.a.createElement("h2",null,t.label),o.a.createElement("button",{className:"add-button"},o.a.createElement(f,null)),o.a.createElement("div",{className:"task-list"},i&&o.a.createElement(x,{key:"hover-placeholder-0",height:i.draggedTaskHeight,expanded:!!n&&0===i.hoveredTaskIndex}),t.tasks.map(function(t,s){var r,l;return i&&(r=i.draggedCategoryIndex===a&&i.draggedTaskId===t.id,n&&(l=i.draggedCategoryIndex===a&&i.draggedTaskIndex<i.hoveredTaskIndex?i.hoveredTaskIndex===s:i.hoveredTaskIndex===s+1)),o.a.createElement(o.a.Fragment,{key:t.id},o.a.createElement(b,{key:t.id,task:t,taskIndex:s,categoryIndex:a,dragged:r,onMouseDown:e.handleMouseDown,onMouseMove:e.handleMouseMove,onMouseUp:e.handleMouseUp}),i&&t.id!==i.draggedTaskId&&o.a.createElement(x,{key:"hover-placeholder-"+(s+1),height:i.draggedTaskHeight,expanded:!!l}))})))}))}},{key:"notifyChange",value:function(e,t,a,n){var o=Object(v.a)(this.props.data);if(e===a){var i=Object(v.a)(o[e].tasks);i.splice(n,0,i.splice(t,1)[0]),o[e]=Object(p.a)({},o[e],{tasks:i})}else{var s=Object(v.a)(o[e].tasks),r=Object(v.a)(o[a].tasks);r.splice(n,0,s.splice(t,1)[0]),o[e]=Object(p.a)({},o[e],{tasks:s}),o[a]=Object(p.a)({},o[a],{tasks:r})}this.props.onChange(o)}}]),t}(o.a.Component)),S={users:[{id:"1",label:"sorcerio"},{id:"2",label:"bean"},{id:"3",label:"elfo"}],categories:[{id:"1",label:"Backlog",tasks:[{id:"1",description:"Font size is too small in registration form",userLabel:"sorcerio",labels:[{name:"Low",color:"green"},{name:"All",color:"yellow"}]},{id:"2",description:"Local storage is not cleaned up on logout",userLabel:"bean",labels:[{name:"Medium",color:"orange"},{name:"Chrome",color:"lime"}]},{id:"3",description:"Login doesn't work if third-party cookies are disabled",userLabel:"sorcerio",labels:[{name:"Low",color:"green"},{name:"IE",color:"blue"}]}]},{id:"2",label:"Ready",tasks:[{id:"4",description:"Items are missing from search results when filtering by date",userLabel:"sorcerio",labels:[{name:"Medium",color:"orange"},{name:"All",color:"yellow"}]},{id:"5",description:"Link clicks cause a full page reload",userLabel:"sorcerio",labels:[{name:"Medium",color:"orange"}]}]},{id:"3",label:"In Progress",tasks:[{id:"6",description:"Apple Pay integration is broken on iOS",userLabel:"bean",labels:[{name:"High",color:"red"}]}]},{id:"4",label:"Done",tasks:[]}]};a(21);g.a.load({google:{families:["Lato:400,700,900"]}});var D=function(e){function t(){var e,a;Object(r.a)(this,t);for(var n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];return(a=Object(d.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(o)))).state={data:S.categories},a.handleChange=function(e){a.setState({data:e})},a}return Object(c.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return o.a.createElement(o.a.Fragment,null,o.a.createElement(m,{users:S.users}),o.a.createElement("div",{className:"task-board-overflow-container"},o.a.createElement(I,{data:this.state.data,onChange:this.handleChange})))}}]),t}(o.a.Component);s.a.render(o.a.createElement(D,null),document.getElementById("root"))}],[[11,1,2]]]);
//# sourceMappingURL=main.9daf7285.chunk.js.map