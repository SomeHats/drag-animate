(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{16:function(e,t,n){"use strict";var i=n(1),o=n(4);class s{constructor(e,t){this.id=Object(o.b)(),this.x=void 0,this.y=void 0,this.x=e,this.y=t}clone(){return new s(this.x,this.y)}distanceTo(e){const t=this.x-e.x,n=this.y-e.y;return Math.sqrt(t*t+n*n)}setXY(e,t){this.x=e,this.y=t}set(e){this.x=e.x,this.y=e.y}findNearest(e){let t=null,n=1/0;return e.forEach(e=>{const i=this.distanceTo(e);i<n&&(t=e,n=i)}),t}add(e){return new s(this.x+e.x,this.y+e.y)}subtract(e){return new s(this.x-e.x,this.y-e.y)}}Object(o.f)(s,"Vector2",["x","y"]),Object(i.i)(s,{x:i.n,y:i.n}),t.a=s},228:function(e,t,n){n(227),e.exports=n(88)},4:function(e,t,n){"use strict";var i=n(3),o=n.n(i);let s=0;const r=()=>`${Date.now().toString(36)}.${(s++).toString(36)}`;function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),i.forEach(function(t){h(e,t,n[t])})}return e}function h(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n.d(t,"c",function(){return g}),n.d(t,"d",function(){return P}),n.d(t,"e",function(){return f}),n.d(t,"f",function(){return S}),n.d(t,"g",function(){return C}),n.d(t,"a",function(){return k}),n.d(t,"b",function(){return r});const c=e=>new Error(`impossible value ${e}`),l=new Map,p=new Map,d=(e,t)=>({ctor:t.ctor||e.ctor,name:t.name||e.name,primitives:[...e.primitives,...t.primitives],refs:a({},e.refs,t.refs)}),u=e=>{const t=l.get(e);return o()(t,`model ${e.__proto__.constructor.name} is not serializable`),t},m=(e,t)=>{const n=(e=e,o()(!String(e.id).includes("#"),`id "${String(e.id)}" must not include "#"`),`${u(e.__proto__.constructor).name}#${String(e.id)}`);return t[n]||(t[n]=y(e,t)),n};var w;const v=(e,t,n)=>{if(null===t)return null;switch(e.type){case"one":return m(t,n);case"list":return((e,t)=>e.map(e=>m(e,t)))(t,n);case"object-map":return((e,t)=>Object.keys(e).map(n=>[n,m(e[n],t)]).reduce((e,[t,n])=>a({},e,{[t]:n}),{}))(t,n);default:throw c(e.type)}},y=(e,t)=>{const n=u(e.__proto__.constructor),i=n.primitives,o=n.refs,s={};return i.forEach(t=>s[t]=e[t]),Object.keys(o).forEach(n=>{s[n]=v(o[n],e[n],t)}),s},g=e=>({type:"one",target:e}),P=e=>({type:"list",target:e}),f=e=>({type:"object-map",target:e}),b=e=>{const t=e.__proto__,n=t?b(t):[],i=l.get(e);return i?[...n,i]:n},S=(e,t,n,i={})=>{o()(!t.includes("#"),`name "${t}" cant include "#"`),o()(!p.has(t),`serializable class with name ${t} already exists`);const s=[...b(e),{ctor:e,name:t,primitives:n,refs:i}].reduce(d);l.set(e,s),p.set(t,s)},C=e=>{const t={};return{rootId:m(e,t),objectsById:t}},E=(e,t,n={})=>{if(!n[t]){const i=e[t];o()(i,`no object found for id ${String(t)}`);const s=(e=>{const t=e.split("#");o()(2===t.length,`invalid id "${e}"`);const n=p.get(t[0]);return o()(n,`unknown serialize model ${t[0]}`),{model:n,id:t[1]}})(t),r=s.model,h=s.id,l=r.primitives,d=r.refs,u=new(0,r.ctor);u.id=h,l.forEach(e=>u[e]=i[e]),Object.keys(d).forEach(t=>{u[t]=((e,t,n,i={})=>{if(null===t)return null;switch(e.type){case"one":return E(n,t,i);case"list":return t.map(e=>E(n,e,i));case"object-map":return Object.keys(t).map(e=>[e,E(n,t[e],i)]).reduce((e,[t,n])=>a({},e,{[t]:n}),{});default:throw c(e.type)}})(d[t],i[t],e,n)}),n[t]=u}return n[t]},k=e=>{const t=e.rootId,n=e.objectsById;return E(n,t)}},57:function(e,t,n){"use strict";(function(e){n.d(t,"a",function(){return r});var i=n(3),o=n.n(i);n(16);n(92);var s=function(){var t,n,i,s=function(e,t){var n=function(e,t){var n=0;if(!e.length)return Math.sqrt(Math.pow(e-t,2));for(var i=0;i<e.length;i++)n+=Math.pow(e[i]-t[i],2);return Math.sqrt(n)}(e,t);return 0===n?0:Math.pow(n,2)*Math.log(n)};this.compile=function(r,a){o()(r&&r.length,"bad centers array :/"),t=r.map(function(e){return e}),i=a.map(function(e){return e});for(var h=[],c=[],l=[],p=[],d=0;d<t.length;d++){c=[],p=[1];for(var u=0;u<t[d].length;u++)p.push(t[d][u]);for(var m=0;m<t.length;m++)c.push(s(t[d],t[m]));l.push(p),h.push(c.concat(p))}var w=e.$M(l).transpose().elements.map(function(e){for(var t=e.length;t<h[0].length;t++)e.push(0);return e});for(d=0;d<w.length;d++)h.push(w[d]),i.push(0);n=this._solve(i,h),o()(n,"rbf failed to compile with given centers./nCenters must be unique :/")},this._solve=function(t,n){var i=e.$M(n),o=e.$V(t);if(i=i.inverse())return i.multiply(o)},this.getValue=function(e){var i=0,o=0;for(o=0;o<t.length;o++)i+=Number(n.elements[o])*s(e,t[o]);for(i+=Number(n.elements[t.length]),o=0;o<e.length;o++)i+=e[o]*Number(n.elements[t.length+(o+1)]);return i},this.getValues=function(e,t){setTimeout(function(){var n=e.map(function(e){return this.getValue(e)},this);t(null,{points:e,ys:n})}.bind(this),0)}};class r{constructor(e,t){this.tps=new s,this.tps.compile(e.map(({x:e,y:t})=>[e,t]),t)}getValue(e){return this.tps.getValue([e.x,e.y])}}}).call(this,n(20))},88:function(e,t,n){"use strict";n.r(t);var i=n(0),o=n.n(i),s=n(19),r=n.n(s),a=n(3),h=n.n(a),c=n(229),l=n.n(c),p=n(7),d=n(84),u=n.n(d);const m=()=>document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement,w={position:"fixed",top:"0px",left:"0px",width:"100%",height:"100%",zIndex:"10000",touchAction:"none"};class v{constructor({down:e,move:t,up:n}={}){this.onDown=null,this.onMove=null,this.onUp=null,this.attachedTo=null,this.cover=void 0,this.onDown=e,this.onMove=t,this.onUp=n;const i=document.createElement("div");Object.assign(i.style,w),i.setAttribute("touch-action","none"),this.cover=i}attach(){if(!this.attachedTo){const e=m()||document.body;h()(null!=e,"target must exist"),e.appendChild(this.cover),this.attachedTo=e,this.attachEvents()}}remove(){const e=this.attachedTo;e&&(this.attachedTo=null,this.removeEvents(),e.removeChild(this.cover))}attachEvents(){this.onDown&&this.cover.addEventListener("pointerdown",this.onDown,!1),this.onMove&&this.cover.addEventListener("pointermove",this.onMove,!1),this.onUp&&this.cover.addEventListener("pointerup",this.onUp,!1)}removeEvents(){this.onDown&&this.cover.removeEventListener("pointerdown",this.onDown),this.onMove&&this.cover.removeEventListener("pointermove",this.onMove),this.onUp&&this.cover.removeEventListener("pointerup",this.onUp)}}var y=n(25),g=n.n(y),P=n(1),f=n(16);var b=Object(P.i)(class extends g.a{constructor(e){super(),this.viewport=void 0,this.screenPosition=null,this.isDown=!1,this.viewport=e}get isActive(){return null!==this.screenPosition}get scenePosition(){const e=this.screenPosition;return e?this.viewport.screenCoordsToSceneCoords(e.x,e.y):null}setPosition(e,t){this.screenPosition?this.screenPosition.setXY(e,t):this.screenPosition=new f.a(e,t)}clearPosition(){this.screenPosition=null}triggerPointerDown(){this.isDown=!0,this.emit("pointerDown")}triggerPointerMove(){this.emit("pointerMove")}triggerPointerUp(){this.isDown=!1,this.emit("pointerUp")}onPointerDown(e){const t=()=>e(this.viewport);return this.addListener("pointerDown",t),()=>{this.removeListener("pointerDown",t)}}onPointerMove(e){const t=()=>e(this.viewport);return this.addListener("pointerMove",t),()=>{this.removeListener("pointerMove",t)}}onPointerUp(e){const t=()=>e(this.viewport);return this.addListener("pointerUp",t),()=>{this.removeListener("pointerUp",t)}}get hoveredItem(){return this.scenePosition?this.viewport.getItemAtSceneCoord(this.scenePosition):null}},{isDown:P.n,screenPosition:P.n,scenePosition:P.f,isActive:P.f,hoveredItem:P.f,setPosition:P.d,triggerPointerDown:P.d,triggerPointerMove:P.d,triggerPointerUp:P.d}),S=n(34),C=n.n(S);class E{constructor(){this._events=new g.a,this._isPressedByKeyCode={},this.handleKeyDown=(e=>{this._isPressedByKeyCode[e.keyCode]=!0,this._events.emit(`keyDown:${e.keyCode}`)}),this.handleKeyUp=(e=>{this._isPressedByKeyCode[e.keyCode]=!1,this._events.emit(`keyUp:${e.keyCode}`)})}setup(){window.addEventListener("keydown",this.handleKeyDown,!1),window.addEventListener("keyup",this.handleKeyUp,!1)}teardown(){window.removeEventListener("keydown",this.handleKeyDown,!1),window.removeEventListener("keyup",this.handleKeyUp,!1)}keyCodeOrNameToKeyCode(e){return"number"===typeof e?e:C()(e)}isPressed(e){const t=this.keyCodeOrNameToKeyCode(e);return!!this._isPressedByKeyCode[t]}onKeyDown(e,t){const n=this.keyCodeOrNameToKeyCode(e),i=()=>t();return this._events.addListener(`keyDown:${n}`,i),()=>{this._events.removeListener(`keyDown:${n}`,i)}}onKeyUp(e,t){const n=this.keyCodeOrNameToKeyCode(e),i=()=>t();return this._events.addListener(`keyUp:${n}`,i),()=>{this._events.removeListener(`keyUp:${n}`,i)}}}Object(P.i)(E,{_isPressedByKeyCode:P.n,handleKeyDown:P.d,handleKeyUp:P.d});var k=new E;const x=15,O=document.createElement("canvas").getContext("2d");var D=Object(P.i)(class extends g.a{constructor(e){super(),this.keyboard=k,this.top=0,this.left=0,this.bottom=0,this.right=0,this.windowWidth=window.innerWidth,this.windowHeight=window.innerHeight,this.scale=window.devicePixelRatio||1,this.editor=void 0,this.basePoint=new f.a(0,0),this.pointer=new b(this),this.sceneCoordsToScreenCoords=((e,t)=>new f.a(e*this.zoom+this.panX+this.left,t*this.zoom+this.panY+this.top)),this.screenCoordsToSceneCoords=((e,t)=>new f.a((e-this.left-this.panX)/this.zoom,(t-this.top-this.panY)/this.zoom)),this.editor=e,this.basePoint.set(e.scene.keyPointSet.keyPoints[0])}get sceneWidth(){return this.editor.scene.width}get sceneHeight(){return this.editor.scene.height}get pxWidth(){return this.windowWidth-this.left-this.right}get pxHeight(){return this.windowHeight-this.top-this.bottom}get zoom(){const e=this.pxWidth-2*x,t=this.pxHeight-2*x;return Math.min(e/this.sceneWidth,t/this.sceneHeight)}get panX(){const e=this.pxWidth-2*x;return this.zoom*this.sceneWidth<e?x+(e/2-this.zoom*this.sceneWidth/2):x}get panY(){const e=this.pxHeight-2*x;return this.zoom*this.sceneHeight<e?x+(e/2-this.zoom*this.sceneHeight/2):x}get px(){return 1/this.zoom}get nearestKeyPoint(){const e=this.basePoint.findNearest(this.editor.scene.keyPointSet.keyPoints);return h()(e,"nearest must be found"),e}get scene(){return this.editor.scene}setSize(e,t,n,i,o,s,r){this.windowWidth=e,this.windowHeight=t,this.scale=n,this.left=i,this.top=o,this.right=s,this.bottom=r}getItemAtSceneCoord(e){const t=8*this.px;O.lineWidth=t;for(const n of this.editor.scene.shapes){for(const o of n.points)if(e.distanceTo(o.originPoint.getAtBasePoint(this.basePoint))<t)return{type:"MagicPointThingySelectionItem",point:o,inShape:n};const i=n.getCanvasPathAtBasePoint(this.basePoint);if(O.isPointInStroke(i,e.x,e.y))return{type:"ShapeSelectionItem",shape:n}}return null}},{windowWidth:P.n,windowHeight:P.n,scale:P.n,top:P.n,left:P.n,bottom:P.n,right:P.n,editor:P.n,pointer:P.n,sceneWidth:P.f,sceneHeight:P.f,pxWidth:P.f,pxHeight:P.f,zoom:P.f,panX:P.f,panY:P.f,px:P.f,scene:P.f,nearestKeyPoint:h.a,setSize:P.d});const j=i.createContext(null),M=j.Provider,T=j.Consumer,K=({children:e})=>i.createElement(T,null,t=>(h()(t,"Viewport must exist"),e(t)));class _ extends i.Component{constructor(...e){var t;return t=super(...e),this.state={viewport:null},this.sizer=null,this.pointableCover=void 0,this.isPointerDown=!1,this.handleResize=(()=>{this.setViewportSize(this.state.viewport)}),this.sizerRef=(e=>{this.sizer=e}),this.handleMouseDown=(()=>{const e=this.state.viewport;h()(e,"viewport must exist"),this.isPointerDown=!0,this.pointableCover.attach(),e.pointer.triggerPointerDown()}),this.handleMouseMove=(e=>{const t=this.state.viewport;h()(t,"viewport must exist"),t.pointer.setPosition(e.clientX,e.clientY),t.pointer.triggerPointerMove()}),this.handleMouseUp=(()=>{const e=this.state.viewport;h()(e,"viewport must exist"),this.isPointerDown=!1,this.pointableCover.remove(),e.pointer.triggerPointerUp();const t=e.pointer.screenPosition;h()(t,"viewport pointer must be active"),(e.left>t.x||t.x>e.windowWidth-e.right||e.top>t.y||t.y>e.windowHeight-e.bottom)&&e.pointer.clearPosition()}),this.handleMouseLeave=(()=>{const e=this.state.viewport;h()(e,"viewport must exist"),this.isPointerDown||e.pointer.clearPosition()}),t}componentDidMount(){this.pointableCover=new v({down:this.handleMouseDown,move:this.handleMouseMove,up:this.handleMouseUp});const e=new D(this.props.editor);this.setState({viewport:e}),this.setViewportSize(e),window.addEventListener("resize",this.handleResize)}componentDidUpdate(){this.setViewportSize(this.state.viewport)}componentWillUnmount(){this.pointableCover.remove(),window.removeEventListener("resize",this.handleResize)}setViewportSize(e){const t=this.sizer;h()(t,"container must be set"),h()(e,"viewport must be set");const n=window.innerWidth,i=window.innerHeight,o=window.devicePixelRatio||1,s=t.getBoundingClientRect(),r=s.left,a=s.top,c=s.right,l=s.bottom;e.setSize(n,i,o,r,a,n-c,i-l)}renderViewport(e){const t=this.props,n=t.children,o=t.editor;return h()(e.editor===o,"prop editor must not change"),i.createElement(M,{value:e},n)}render(){const e=this.props,t=e.style,n=e.children,o=e.editor,s=this.state.viewport;return s&&h()(s.editor===o,"prop editor must not change"),i.createElement(i.Fragment,null,s&&i.createElement(M,{value:s},n),i.createElement("div",{ref:this.sizerRef,style:t,onMouseDown:this.handleMouseDown,onMouseMove:this.handleMouseMove,onMouseUp:this.handleMouseUp,onMouseLeave:this.handleMouseLeave}))}}const I=e=>{var t,n;return n=t=class extends i.Component{render(){return i.createElement(K,null,t=>i.createElement(e,Object.assign({},this.props,{viewport:t})))}},t.displayName=`withViewport(${u()(e)})`,n};var U=n(26),A=n(242),z=n.n(A),B=n(241),W=n.n(B),L=n(82),$=n.n(L);var N=Object(U.withStyles)(e=>({appBar:{zIndex:e.zIndex.drawer+1}}))(({classes:e})=>o.a.createElement(z.a,{position:"absolute",className:e.appBar},o.a.createElement(W.a,null,o.a.createElement($.a,{variant:"title",color:"inherit"},"Drag Animate")))),R=n(87),H=n.n(R),V=n(86),X=n.n(V),Y=n(240),F=n.n(Y),q=n(85),J=n.n(q),G=n(239),Q=n.n(G);var Z=e=>e;var ee=Z(Object(U.withStyles)(e=>({drawerPaper:{width:300},addButton:{position:"absolute",bottom:2*e.spacing.unit,right:2*e.spacing.unit},toolbar:e.mixins.toolbar}))(Object(p.a)(class extends o.a.Component{render(){const e=this.props,t=e.classes,n=e.editor;return o.a.createElement(H.a,{variant:"permanent",anchor:"right",classes:{paper:t.drawerPaper}},o.a.createElement("div",{className:t.toolbar}),o.a.createElement(X.a,{subheader:o.a.createElement(F.a,null,"Shapes")},n.scene.shapes.map((e,t)=>o.a.createElement(J.a,{key:t,button:!0},o.a.createElement(Q.a,null,o.a.createElement("pre",null,JSON.stringify(e,null,2)))))))}}))),te=n(236),ne=n.n(te),ie=n(235),oe=n.n(ie);var se={SELECT:"SELECT",PEN:"PEN"},re=n(12),ae=n.n(re),he=n(237),ce=n.n(he),le=n(238),pe=n.n(le);var de=class extends o.a.Component{constructor(...e){var t;return t=super(...e),this._unsubscribes=[],this.handleKeyDown=(()=>{this.props.onDown&&this.props.onDown(k)}),this.handleKeyUp=(()=>{this.props.onUp&&this.props.onUp(k)}),t}componentDidMount(){this.listen()}componentDidUpdate(e){e.name!==this.props.name&&(this.unsubscribe(),this.listen())}listen(){const e=this.props.name;this._unsubscribes.push(k.onKeyDown(e,this.handleKeyDown)),this._unsubscribes.push(k.onKeyUp(e,this.handleKeyUp))}unsubscribe(){this._unsubscribes.forEach(e=>e()),this._unsubscribes=[]}render(){return null}};var ue=Object(U.withStyles)(e=>({listItem:{padding:1.5*e.spacing.unit},active:{color:e.palette.primary.light},inactive:{color:e.palette.text.primary},popper:{marginLeft:40}}))(Object(p.a)(class extends i.Component{constructor(...e){var t;return t=super(...e),this.handleClick=(()=>{const e=this.props,t=e.editor,n=e.tool;t.setTool(n)}),t}render(){const e=this.props,t=e.name,n=e.shortcutKey,o=e.tool,s=e.editor,r=e.icon,a=e.classes;return i.createElement(i.Fragment,null,i.createElement(de,{name:n,onDown:this.handleClick}),i.createElement(pe.a,{title:`${t} (${n.toUpperCase()})`,placement:"right",classes:{popper:a.popper}},i.createElement(J.a,{button:!0,classes:{root:ae()(a.listItem,{[a.active]:o===s.tool})},onClick:this.handleClick},i.createElement(ce.a,{classes:{root:o===s.tool?a.active:a.inactive}},r))))}}));var me=Z(Object(U.withStyles)(e=>({drawerPaper:{width:48},toolbar:e.mixins.toolbar}))(Object(p.a)(class extends o.a.Component{render(){const e=this.props,t=e.classes,n=e.editor;return o.a.createElement(H.a,{variant:"permanent",anchor:"left",classes:{paper:t.drawerPaper}},o.a.createElement("div",{className:t.toolbar}),o.a.createElement(X.a,null,o.a.createElement(ue,{name:"Select",shortcutKey:"v",tool:se.SELECT,icon:o.a.createElement(ne.a,null),editor:n}),o.a.createElement(ue,{name:"Pen",shortcutKey:"p",tool:se.PEN,icon:o.a.createElement(oe.a,null),editor:n})))}}))),we=n(234),ve=n.n(we);function ye(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var ge=Object(p.a)(class extends i.Component{constructor(...e){var t;return t=super(...e),this.canvas=null,this.ctx=null,this.disposeRenderer=null,this.draw=(()=>{const e=this.ctx;if(!e)return;const t=window.devicePixelRatio,n=this.props,i=n.width,o=n.height,s=n.draw;e.save(),e.scale(t,t),e.clearRect(0,0,i,o),s(e),e.restore()}),this.canvasRef=(e=>{this.canvas=e||null,this.ctx=e?e.getContext("2d"):null,this.props.canvasRef&&this.props.canvasRef(this.canvas),this.props.contextRef&&this.props.contextRef(this.ctx)}),t}componentDidMount(){this.disposeRenderer=Object(P.e)(this.draw,{scheduler:e=>window.requestAnimationFrame(()=>e())})}componentDidUpdate(){this.draw()}componentWillUnmount(){this.disposeRenderer&&this.disposeRenderer()}render(){const e=this.props,t=e.className,n=e.style,o=e.width,s=e.height,r=e.onMouseEnter,a=e.onMouseLeave,h=e.onMouseDown,c=e.onMouseMove,l=e.onMouseUp,p=e.onClick,d=window.devicePixelRatio;return i.createElement("canvas",{ref:this.canvasRef,className:t,style:function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),i.forEach(function(t){ye(e,t,n[t])})}return e}({},n,{width:o,height:s}),width:o*d,height:s*d,onMouseEnter:r,onMouseLeave:a,onMouseDown:h,onMouseMove:c,onMouseUp:l,onClick:p})}});var Pe=Z(I(Object(p.a)(class extends i.Component{constructor(...e){var t;return t=super(...e),this.draw=(e=>{const t=this.props,n=t.viewport,i=t.draw,o=n.panX,s=n.panY,r=n.zoom;e.translate(o,s),e.scale(r,r),i(e,n)}),t}render(){const e=this.props,t=e.viewport,n=e.cursor,o=e.canvasRef,s=e.contextRef,r=t.pxWidth,a=t.pxHeight,h=t.left,c=t.top;return i.createElement(ge,{style:{position:"absolute",left:h,top:c,cursor:null==n?void 0:n},draw:this.draw,width:r,height:a,canvasRef:o,contextRef:s})}})));var fe=class extends o.a.Component{constructor(...e){var t;return t=super(...e),this.draw=((e,t)=>{this.drawOutline(e,t),this.drawBasePoint(e,t)}),t}drawOutline(e,{px:t,sceneWidth:n,sceneHeight:i}){e.strokeStyle="rgba(0, 0, 0, 0.5)",e.lineWidth=t,e.strokeRect(0,0,n,i)}drawBasePoint(e,{basePoint:t,px:n,top:i,left:o,windowWidth:s,windowHeight:r,bottom:a,right:h,screenCoordsToSceneCoords:c}){const l=c(o,i),p=c(s-h,r-a);e.beginPath(),e.moveTo(l.x,t.y),e.lineTo(p.x,t.y),e.moveTo(t.x,l.y),e.lineTo(t.x,p.y),e.lineWidth=n,e.strokeStyle=ve.a.A400,e.stroke()}render(){return o.a.createElement(Pe,{draw:this.draw})}},be=n(232),Se=n.n(be),Ce=n(233),Ee=n.n(Ce);var ke=Z(I(Object(U.withStyles)({canvas:{position:"absolute",top:0,left:0}})(Object(p.a)(class extends o.a.Component{constructor(...e){var t;return t=super(...e),this.draw=(e=>{const t=this.props,n=t.viewport,i=t.width,o=t.height,s=t.draw;e.translate(i/2,o/2),s(e,n)}),t}render(){const e=this.props,t=e.width,n=e.height,i=e.sceneX,s=e.sceneY,r=e.viewport,a=e.classes,h=r.panX,c=r.panY,l=r.zoom,p=i*l+h-t/2+r.left,d=s*l+c-n/2+r.top;return o.a.createElement(ge,{draw:this.draw,className:a.canvas,width:t,height:n,style:{transform:`translate(${p}px, ${d}px)`}})}}))));var xe=Z(I(Object(p.a)(class extends o.a.Component{constructor(...e){var t;return t=super(...e),this.draw=((e,{nearestKeyPoint:t,keyboard:n})=>{const i=t===this.props.keyPoint;(n.isPressed("ctrl")||i)&&(e.beginPath(),e.arc(0,0,10,0,2*Math.PI,!0),e.moveTo(-15,0),e.lineTo(-5,0),e.moveTo(5,0),e.lineTo(15,0),e.moveTo(0,-15),e.lineTo(0,-5),e.moveTo(0,5),e.lineTo(0,15),i&&(e.moveTo(-14.5,-2.5),e.lineTo(-14.5,2.5),e.moveTo(14.5,-2.5),e.lineTo(14.5,2.5),e.moveTo(-2.5,-14.5),e.lineTo(2.5,-14.5),e.moveTo(-2.5,14.5),e.lineTo(2.5,14.5)),e.lineWidth=1,e.strokeStyle=i?Ee.a.A700:Se.a.A400,e.stroke())}),t}render(){const e=this.props.keyPoint;return o.a.createElement(ke,{draw:this.draw,width:30,height:30,sceneX:e.x,sceneY:e.y})}})));var Oe=Z(I(Object(p.a)(class extends o.a.Component{render(){const e=this.props.viewport.scene.keyPointSet;return o.a.createElement(o.a.Fragment,null,e.keyPoints.map(e=>o.a.createElement(xe,{keyPoint:e,key:String(e.id)})))}}))),De=n(231),je=n.n(De),Me=n(4);class Te{constructor(){this.id=Object(Me.b)(),this.keyPointsById={}}get keyPoints(){return Object.keys(this.keyPointsById).map(e=>this.keyPointsById[e])}addKeyPoint(e){this.keyPointsById[String(e.id)]=e}get(e){return this.keyPointsById[String(e)]||null}has(e){return this.get(e.id)===e}}Object(Me.f)(Te,"KeyPointSet",[],{keyPointsById:Object(Me.e)(f.a)});var Ke=Object(P.i)(Te,{keyPointsById:P.n,keyPoints:P.f,addKeyPoint:P.d}),_e=n(57);class Ie{constructor(){this.id=Object(Me.b)(),this.keyPointSet=void 0,this.pointsByKeyPointId={}}init(e){return this.keyPointSet=e,this}get definedKeyPoints(){return Object.keys(this.pointsByKeyPointId).filter(e=>null!=this.pointsByKeyPointId[e]).map(e=>{const t=this.keyPointSet.get(e);return h()(t,"point must exist"),t})}get thinPlateSplinesX(){const e=this.keyPointSet.keyPoints,t=e.map(e=>this.getAtKeyPoint(e).x);return new _e.a(e,t)}get thinPlateSplinesY(){const e=this.keyPointSet.keyPoints,t=e.map(e=>this.getAtKeyPoint(e).y);return new _e.a(e,t)}getAtKeyPoint(e){if(h()(this.keyPointSet.has(e),"key point must be in scene"),null!=this.pointsByKeyPointId[String(e.id)])return this.pointsByKeyPointId[String(e.id)];const t=e.findNearest(this.definedKeyPoints);return h()(t,"nearest point must be found"),this.pointsByKeyPointId[String(t.id)]}setAtKeyPoint(e,t){h()(this.keyPointSet.has(e),"keyPoint must exist in scene"),this.pointsByKeyPointId[String(e.id)]=t}getAtBasePoint(e){return new f.a(this.thinPlateSplinesX.getValue(e),this.thinPlateSplinesY.getValue(e))}}Object(Me.f)(Ie,"MagicPointThingy",[],{keyPointSet:Object(Me.c)(Ke),pointsByKeyPointId:Object(Me.e)(f.a)});var Ue=Object(P.i)(Ie,{keyPointSet:P.n,pointsByKeyPointId:P.n,setAtKeyPoint:P.d,definedKeyPoints:P.f,thinPlateSplinesX:P.f,thinPlateSplinesY:P.f});class Ae{constructor(){this.id=Object(Me.b)(),this.originPoint=void 0,this._leadingControlPoint=null,this._followingControlPoint=null,this.lockedControlPoints=!0}init(e){return this.originPoint=e,this}}Object(Me.f)(Ae,"ShapePoint",["lockedControlPoints"],{originPoint:Object(Me.c)(Ue),_leadingControlPoint:Object(Me.c)(Ue),_followingControlPoint:Object(Me.c)(Ue)});var ze=Object(P.i)(Ae,{origin:P.n,_leadingControlPoint:P.n,_followingControlPoint:P.n,lockedControlPoints:P.n});const Be=(e,{x:t,y:n},i)=>{const o=i/2;e.moveTo(t-o,n-o),e.lineTo(t+o,n-o),e.lineTo(t+o,n+o),e.lineTo(t-o,n+o),e.lineTo(t-o,n-o)},We=(e,t,n)=>{e.beginPath(),Be(e,t,n),e.globalCompositeOperation="destination-out",e.fill(),e.globalCompositeOperation="source-over",e.stroke()},Le=(e,t,n)=>{const i=new Path2D;return e.forEach((e,n)=>{const o=e.originPoint.getAtBasePoint(t),s=o.x,r=o.y;0===n?i.moveTo(s,r):i.lineTo(s,r)}),n&&i.closePath(),i},$e=5,Ne=150;var Re=Z(I(class extends i.Component{constructor(...e){var t;return t=super(...e),this._unsubscribes=[],this._drag=null,this.handlePointerDown=(()=>{const e=this.props.viewport.pointer.scenePosition;h()(e,"viewport must have position to be pressed"),this._drag={startTime:Date.now(),startScenePosition:e.clone(),hasNotifiedStart:!1,asyncDrag:this.startAsyncDrag()},this.props.onPointerDown&&this.props.onPointerDown(this.props.viewport)}),this.handlePointerMove=(()=>{const e=this.props.viewport,t=e.pointer.screenPosition;h()(t,"viewport must have position for pointermove");const n=this._drag;if(n){if(!n.hasNotifiedStart){const i=e.sceneCoordsToScreenCoords(n.startScenePosition.x,n.startScenePosition.y);(n.startTime+Ne>Date.now()||t.distanceTo(i)>$e)&&(this.props.onDragStart&&this.props.onDragStart(e),n.hasNotifiedStart=!0,n.asyncDrag&&n.asyncDrag.notifyStart())}n.hasNotifiedStart&&(this.props.onDragMove&&this.props.onDragMove(this.props.viewport),n.asyncDrag&&n.asyncDrag.notifyMove())}this.props.onPointerMove&&this.props.onPointerMove(this.props.viewport)}),this.handlePointerUp=(()=>{const e=this._drag;h()(e,"drag must be defined"),e.hasNotifiedStart?this.props.onDragEnd&&this.props.onDragEnd(this.props.viewport):this.props.onClick&&this.props.onClick(this.props.viewport),this.props.onPointerUp&&this.props.onPointerUp(this.props.viewport),e.asyncDrag&&e.asyncDrag.notifyEnd()}),t}componentDidMount(){const e=this.props.viewport.pointer;this._unsubscribes.push(e.onPointerDown(this.handlePointerDown)),this._unsubscribes.push(e.onPointerMove(this.handlePointerMove)),this._unsubscribes.push(e.onPointerUp(this.handlePointerUp))}componentWillUnmount(){this._unsubscribes.forEach(e=>e()),this._unsubscribes=[]}startAsyncDrag(){const e=this.props,t=e.viewport,n=e.onDragAsync;if(!n)return null;let i=e=>{},o=e=>{};return n(t,new Promise(e=>{i=e}),()=>new Promise(e=>{o=e})),{notifyStart:()=>{i(!1)},notifyMove:()=>{o(!0)},notifyEnd:()=>{i(!0),o(!1)}}}render(){return null}}));var He=class extends o.a.Component{constructor(...e){var t;return t=super(...e),this.draw=((e,t)=>{const n=t.pointer.hoveredItem;n&&this.drawSelectionItem(e,n,je.a.A400,t)}),this.handleClick=(e=>{const t=e.pointer.hoveredItem;console.log(t)}),this.handleDragAsync=(async(e,t,n)=>{const i=e.pointer.hoveredItem;if(i)switch(i.type){case"MagicPointThingySelectionItem":return await this.handleMagicPointThingyDrag(i,e,t,n);case"ShapeSelectionItem":return await this.handleShapeDrag(i,e,t,n);default:throw new Error(`Unknown selection type: ${i.type}`)}}),t}drawSelectionItem(e,t,n,i){switch(t.type){case"ShapeSelectionItem":return this.drawShapeSelectionItem(e,t,n,i);case"MagicPointThingySelectionItem":return this.drawMagicPointThingySelectionItem(e,t,n,i);default:throw new Error(`Unknown selection item type: ${t.type}`)}}drawShapeSelectionItem(e,{shape:t},n,i){this.drawShapeOutline(e,t,n,i),this.drawPointOutlines(e,t,n,i)}drawMagicPointThingySelectionItem(e,{point:t,inShape:n},i,o){this.drawShapeOutline(e,n,i,o),this.drawPointOutlines(e,n,i,o),e.beginPath(),e.fillStyle=i;const s=o.px,r=o.basePoint;Be(e,t.originPoint.getAtBasePoint(r),5*s),e.fill()}drawShapeOutline(e,t,n,{px:i,basePoint:o}){e.lineWidth=i,e.strokeStyle=n,e.stroke(t.getCanvasPathAtBasePoint(o))}drawPointOutlines(e,t,n,{px:i,basePoint:o}){e.lineWidth=i,e.strokeStyle=n,t.points.forEach(t=>{We(e,t.originPoint.getAtBasePoint(o),5*i)})}async handleMagicPointThingyDrag(e,t,n,i){if(!await n)for(;await i();){const n=t.pointer.scenePosition;n&&e.point.originPoint.setAtKeyPoint(t.nearestKeyPoint,n)}}async handleShapeDrag(e,t,n,i){let o=t.pointer.scenePosition;if(h()(o,"viewport pointer must be active"),!await n)for(;await i();){const n=t.pointer.scenePosition;h()(n,"viewport pointer must be active");const i=n.subtract(o);e.shape.points.forEach(e=>{e.originPoint.setAtKeyPoint(t.nearestKeyPoint,e.originPoint.getAtKeyPoint(t.nearestKeyPoint).add(i))}),o=n}}render(){return o.a.createElement(o.a.Fragment,null,o.a.createElement(Pe,{draw:this.draw}),o.a.createElement(Re,{onClick:this.handleClick,onDragAsync:this.handleDragAsync}))}},Ve=n(230),Xe=n.n(Ve);class Ye{constructor(){this.id=Object(Me.b)(),this.strokeWidth=1,this.strokeColor="black",this.fillColor=null}drawCurrentContextPath(e){null!==this.fillColor&&(e.fillStyle=this.fillColor,e.fill()),null!==this.strokeColor&&(e.lineWidth=this.strokeWidth,e.strokeStyle=this.strokeColor,e.stroke())}drawPath(e,t){null!==this.fillColor&&(e.fillStyle=this.fillColor,e.fill(t)),null!==this.strokeColor&&(e.lineWidth=this.strokeWidth,e.strokeStyle=this.strokeColor,e.stroke(t))}}Object(Me.f)(Ye,"ShapeStyle",["strokeWidth","strokeColor","fillColor"]);var Fe=Object(P.i)(Ye,{strokeWidth:P.n,strokeColor:P.n,fillColor:P.n});class qe{constructor(){this.id=Object(Me.b)(),this.style=new Fe,this.points=[],this.isClosed=!1}addPoint(e){this.points.push(e)}close(){this.isClosed=!0}getCanvasPathAtBasePoint(e){return Le(this.points,e,this.isClosed)}drawToCanvasAtBasePoint(e,t){this.style.drawPath(e,this.getCanvasPathAtBasePoint(t))}}Object(Me.f)(qe,"Shape",["isClosed"],{style:Object(Me.c)(Fe),points:Object(Me.d)(Ue)});var Je=Object(P.i)(qe,{style:P.n,points:P.n,isClosed:P.n});var Ge=I(Object(p.a)(class extends o.a.Component{constructor(...e){var t;return t=super(...e),this.liveState=Object(P.n)({targetShape:null}),this.draw=((e,{nearestKeyPoint:t,px:n})=>{const i=this.getTargetScenePoints(),o=i.shapePoints,s=i.isClosed;e.lineWidth=n,e.strokeStyle=Xe.a.A400,e.stroke(Le(o,t,s)),o.forEach(i=>{We(e,i.originPoint.getAtBasePoint(t),5*n)})}),this.handleDrag=(async({pointer:e,editor:t,nearestKeyPoint:n},i)=>{const o=e.scenePosition;h()(o,"pointer must be active");const s=this.getOrCreateTargetShape(),r=this.shouldSnapClosed();let a;if(r)a=s.points[0],s.close();else{const e=t.scene.createMagicPointThingy();e.setAtKeyPoint(n,o),a=(new ze).init(e),s.addPoint(a)}await i,r&&(this.liveState.targetShape=null)}),t}shouldSnapClosed(){const e=this.props.viewport,t=e.nearestKeyPoint,n=e.pointer,i=e.sceneCoordsToScreenCoords,o=n.screenPosition;if(!o)return!1;const s=this.liveState.targetShape&&this.liveState.targetShape.points;if(!s||s.length<2)return!1;const r=s[0].originPoint.getAtKeyPoint(t);return i(r.x,r.y).distanceTo(o)<7}getTargetScenePoints(){const e=this.props.viewport,t=e.pointer,n=e.editor,i=e.nearestKeyPoint,o=this.liveState.targetShape,s=t.scenePosition,r=o?o.points:[];if(s){if(this.shouldSnapClosed())return{shapePoints:r,isClosed:!0};const e=n.scene.createMagicPointThingy();return e.setAtKeyPoint(i,s),{shapePoints:[...r,(new ze).init(e)],isClosed:!1}}return{shapePoints:r,isClosed:!1}}getOrCreateTargetShape(){if(this.liveState.targetShape)return this.liveState.targetShape;const e=new Je;return this.props.viewport.editor.scene.addShape(e),this.liveState.targetShape=e,e}render(){return o.a.createElement(o.a.Fragment,null,o.a.createElement(Pe,{draw:this.draw}),o.a.createElement(Re,{onDragAsync:this.handleDrag}))}}));var Qe=Z(I(Object(p.a)(class extends o.a.Component{render(){const e=this.props.viewport.editor.tool;switch(e){case"SELECT":return o.a.createElement(He,null);case"PEN":return o.a.createElement(Ge,null);default:throw new Error(`unknown tool: ${e}`)}}})));var Ze=Object(p.a)(class extends o.a.Component{constructor(...e){var t;return t=super(...e),this.draw=((e,{basePoint:t})=>{this.props.shape.drawToCanvasAtBasePoint(e,t)}),t}render(){return o.a.createElement(Pe,{draw:this.draw})}});var et=Z(I(Object(p.a)(class extends o.a.Component{render(){const e=this.props.viewport.editor.scene;return o.a.createElement(o.a.Fragment,null,e.shapes.map((e,t)=>o.a.createElement(Ze,{shape:e,key:t})))}})));var tt=Z(I(class extends o.a.Component{constructor(...e){var t;return t=super(...e),this._unsubscribes=[],this.handlePointerMove=(({keyboard:e,pointer:t,basePoint:n})=>{e.isPressed("ctrl")&&t.scenePosition&&n.set(t.scenePosition)}),this.handleCtrlDown=(()=>{const e=this.props.viewport,t=e.pointer,n=e.basePoint;t.scenePosition&&n.set(t.scenePosition)}),this.handleCtrlUp=(()=>{const e=this.props.viewport,t=e.basePoint,n=e.nearestKeyPoint;t.set(n)}),t}render(){return o.a.createElement(o.a.Fragment,null,o.a.createElement(Re,{onPointerMove:this.handlePointerMove}),o.a.createElement(de,{name:"ctrl",onDown:this.handleCtrlDown,onUp:this.handleCtrlUp}))}}));var nt=Object(p.a)(class extends o.a.Component{render(){const e=this.props.editor;return o.a.createElement(o.a.Fragment,null,o.a.createElement(N,null),o.a.createElement(me,{editor:e}),o.a.createElement(ee,{editor:e}),o.a.createElement(_,{editor:e,style:{position:"absolute",top:64,left:48,right:300,bottom:0}},o.a.createElement(et,null),o.a.createElement(fe,null),o.a.createElement(tt,null),o.a.createElement(Oe,null),o.a.createElement(Qe,null)))}});class it{constructor(){this.id=Object(Me.b)(),this.width=void 0,this.height=void 0,this.keyPointSet=void 0,this.shapes=[]}static deserialize(e){const t=Object(Me.a)(e);return h()(t instanceof it,"deserialized object is not Scene"),t}init(e,t){return this.width=e,this.height=t,this.keyPointSet=new Ke,this.keyPointSet.addKeyPoint(new f.a(.25*e,.25*t)),this.keyPointSet.addKeyPoint(new f.a(.75*e,.25*t)),this.keyPointSet.addKeyPoint(new f.a(.75*e,.75*t)),this.keyPointSet.addKeyPoint(new f.a(.25*e,.75*t)),this}addShape(e){this.shapes.push(e)}serialize(){return Object(Me.g)(this)}createMagicPointThingy(){return(new Ue).init(this.keyPointSet)}}Object(Me.f)(it,"Scene",["width","height"],{keyPointSet:Object(Me.c)(Ke),shapes:Object(Me.d)(Je)});var ot=Object(P.i)(it,{width:P.n,height:P.n,shapes:P.n});window.Scene=it;const st="drag-animate.autosave";class rt{static fromAutoSave(e){try{const t=localStorage.getItem(st);h()(null!=t,"no autosave present");const n=JSON.parse(t),i=ot.deserialize(n);return new rt(i)}catch(t){return console.warn(`Could not resore from autosave: ${t.message}`),new rt(e())}}constructor(e){this.tool=se.SELECT,this.scene=void 0,this.commands={replaceDocumentWithNew:(e=200,t=100)=>{this.scene=(new ot).init(e,t)}},this.scene=e,Object.keys(this.commands).forEach(e=>{this.commands[e]=Object(P.d)(`Editor.commands.${e}`,this.commands[e])})}startAutosaving(){return Object(P.e)(()=>{try{const e=this.scene.serialize(),t=JSON.stringify(e);localStorage.setItem(st,t),console.log("Saved.")}catch(e){console.warn(`couldnt autosave: ${e.message}`)}},{delay:2500})}setTool(e){this.tool=e}}var at=Object(P.i)(rt,{scene:P.n,tool:P.n,hoveredShapes:P.n,setTool:P.d,setHovers:P.d});k.setup();const ht=document.getElementById("root");h()(ht,"root must exist");const ct=at.fromAutoSave(()=>(new ot).init(200,100));ct.startAutosaving(),window.editor=ct,r.a.render(o.a.createElement(o.a.Fragment,null,o.a.createElement(l.a,null),o.a.createElement(nt,{editor:ct})),ht)}},[[228,0,1]]]);
//# sourceMappingURL=main.f268929a.chunk.js.map