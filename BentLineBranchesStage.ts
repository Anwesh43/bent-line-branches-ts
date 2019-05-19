const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.05
const scDiv : number = 0.51
const strokeFactor : number = 90
const sizeFactor : number = 2.9
const foreColor : string = "#1A237E"
const backColor : string = "#BDBDBD"
const nodes : number = 5
const parts : number = 2
const lines : number = 2
const lineFactor : number = 0.66

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return  Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i , n)) * n
    }

    static scaleFactor(scale : number) : number {
        return Math.floor(scale / scDiv)
    }

    static mirrorValue(scale : number, a : number, b : number) : number {
        const k : number = ScaleUtil.scaleFactor(scale)
        return (1 - k) / a + k / b
    }

    static updateValue(scale : number, dir : number, a : number, b : number) : number {
        return ScaleUtil.mirrorValue(scale, a, b) * dir * scGap
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawBentLineBranches(context : CanvasRenderingContext2D, i : number, sc1 : number, sc2 : number, size : number) {
        const y : number = size * lineFactor
        const l : number = size - y
        const sc1i : number = ScaleUtil.divideScale(sc1, i, parts)
        const sc2i : number = ScaleUtil.divideScale(sc2, i, parts)
        context.save()
        context.rotate(Math.PI / 2 * i)
        DrawingUtil.drawLine(context, -size, 2 * size / 3, size, size)
        for (var j = 0; j < lines; j++) {
            const sf : number = 1 - 2 * j
            context.save()
            context.translate(size, y)
            context.rotate(sf * Math.PI / 4 * ScaleUtil.divideScale(sc2i, j, lines))
            DrawingUtil.drawLine(context, 0, 0, 0, l * sc1i)
            context.restore()
        }
        context.restore()
    }

    static drawBLBNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const gap : number = h / (nodes + 1)
        const size : number = gap / sizeFactor
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = foreColor
        context.save()
        context.translate(w / 2, gap * (i + 1))
        DrawingUtil.drawBentLineBranches(context, i, sc1, sc2, size)
        context.restore()
    }
}

class BentLineBranchesStage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : BentLineBranchesStage = new BentLineBranchesStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}
