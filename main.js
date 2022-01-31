var drawingModeEl = document.getElementById('drawing-mode'),
    drawingOptionsEl = document.getElementById('drawing-mode-options'),
    drawingColorEl = document.getElementById('drawing-color'),
    drawingShadowColorEl = document.getElementById('drawing-shadow-color'),
    drawingLineWidthEl = document.getElementById('drawing-line-width'),
    drawingShadowWidth = document.getElementById('drawing-shadow-width'),
    drawingShadowOffset = document.getElementById('drawing-shadow-offset'),
    canvas = new fabric.Canvas('a'),
    json;


drawingColorEl.onchange = function () {
    var brush = canvas.freeDrawingBrush;
    brush.color = this.value;
    if (brush.getPatternSrc) {
        brush.source = brush.getPatternSrc.call(brush);
    }
};
drawingShadowColorEl.onchange = function () {
    canvas.freeDrawingBrush.shadow.color = this.value;
};
drawingLineWidthEl.onchange = function () {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.innerHTML = this.value;
};
drawingShadowWidth.onchange = function () {
    canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
    this.previousSibling.innerHTML = this.value;
};
drawingShadowOffset.onchange = function () {
    canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
    canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
    this.previousSibling.innerHTML = this.value;
};

function undo() {
    canvas.undo();
}

function redo() {
    canvas.redo();
}

function select() {
    canvas.isDrawingMode = false;
}

function text() {
    var text = new fabric.Text('AhmetBOZ', {
        fill: 'green'
    });

    // Render the Text on Canvas
    canvas.add(text);
}

function startDraw() {
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 10;
    console.log(canvas.freeDrawingBrush);
    fabric.PencilBrush.prototype.globalCompositeOperation = "source-over";
}

function startErase() {
    canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
    canvas.freeDrawingBrush.width = 10;
    canvas.isDrawingMode = true;
}

function circle() {
    canvas.isDrawingMode = false;

    let circle = new fabric.Circle({
        radius: 65,
        fill: '#039BE5',
        left: 0,
        stroke: 'red',
        strokeWidth: 3
    });

    canvas.add(circle);
}

function triangle() {
    canvas.isDrawingMode = false;

    var triangle = new fabric.Triangle({
        width: 110,
        height: 110,
        fill: 'blue',
        stroke: 'red',
        strokeWidth: 3
    });

    canvas.add(triangle);
}

function clearCanvas() {
    canvas.clear();
}

function saveCanvas() {
    json = canvas.toJSON();
    console.error("json", json);
}

function loadCanvas() {
    if (json) {
        canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function (o, object) {
            fabric.log(o, object);
        });
    }
}


document.onkeydown = function (evt) {
    if (evt.altKey === true) {
        canvas.isDrawingMode = false;
    }
};

canvas.on('mouse:down', function (opt) {
    var evt = opt.e;
    if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
    }
});

canvas.on('mouse:move', function (opt) {
    if (this.isDragging) {
        var e = opt.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();

        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
    }
});

canvas.on('mouse:up', function (opt) {
    console.error("this.isDragging", this.isDragging);
    this.setViewportTransform(this.viewportTransform);
    this.isDragging = false;
    this.selection = true;
});

canvas.on('mouse:wheel', function (opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
    console.error("zoom", zoom)
    opt.e.preventDefault();
    opt.e.stopPropagation();
    var vpt = this.viewportTransform;

    if (zoom < 400 / 1000) {
        vpt[4] = 200 - 1000 * zoom / 2;
        vpt[5] = 200 - 1000 * zoom / 2;
    } else {
        if (vpt[4] >= 0) {
            vpt[4] = 0;
        } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
            vpt[4] = canvas.getWidth() - 1000 * zoom;
        }
        if (vpt[5] >= 0) {
            vpt[5] = 0;
        } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
            vpt[5] = canvas.getHeight() - 1000 * zoom;
        }
    }
});
