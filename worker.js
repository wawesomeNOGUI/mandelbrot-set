let WIDTH, HEIGHT, REAL_SET, IMAGINARY_SET, END_START_RL, END_START_IM
const MAX_ITERATION = 2000

onmessage = (e) => {
    const { isSettingUp } = e.data
    if (isSettingUp) {
        const { w, h, realSet, imaginarySet } = e.data

        REAL_SET = { start: realSet.start, end: realSet.end }
        IMAGINARY_SET = { start: imaginarySet.start, end: imaginarySet.end }

        END_START_RL = (REAL_SET.end - REAL_SET.start)
        END_START_IM = (IMAGINARY_SET.end - IMAGINARY_SET.start)

        WIDTH = w
        HEIGHT = h
    } else {
        const { col } = e.data
        const mandelbrotSets = []
        for (let row = 0; row < HEIGHT; row++)
            mandelbrotSets[row] = calculate(col, row)

        postMessage({ col, mandelbrotSets })
    }
}
const calculate = (i, j) => mandelbrot(relativePoint(i, j))

const relativePoint = (x, y) => {
    x = REAL_SET.start + (x / WIDTH) * (END_START_RL)
    y = IMAGINARY_SET.start + (y / HEIGHT) * (END_START_IM)

    return { x, y }
}

const mandelbrot = (c) => {
    var totalX = 0;
    var totalY = 0;
    var avgX = 0;
    var avgY = 0;
    let z = { x: 0, y: 0 }, n = 0, p, tempZ, d;
    do {
        tempZ = {
            x: z.x,
            y: z.y
        }
        p = {
            x: Math.pow(z.x, 2) - Math.pow(z.y, 2),
            y: 2 * z.x * z.y
        }
        z = {
            x: p.x + c.x,
            y: p.y + c.y
        }
        
        totalX += z.x;
        avgX = totalX / n;
        totalY += z.y;
        avgY = totalY / n;
        
        var jump = (avgX-z.x)*(avgX-z.x) + (avgY-z.y)*(avgY-z.y) < 1/3 * (tempZ.x-avgX)*(tempZ.x-avgX) + (tempZ.y-avgY)*(tempZ.y-avgY);
        
        d = 0.5 * (Math.pow(z.x, 2) + Math.pow(z.y, 2))
        n += 1
    } while (d <= 2 && n < MAX_ITERATION)

    return [n, d <= 2]
    
    /*
    var totalX = 0;
    var totalY = 0;
    var avgX = 0;
    var avgY = 0;
    
    let z = { x: 0, y: 0 }, n = 0, p, tempZ, d;
    do {
        tempZ = {
            x: z.x,
            y: z.y
        }
        p = {
            x: Math.pow(z.x, 3) - 3 * z.x * Math.pow(z.y, 2),
            y: 3 * Math.pow(z.x, 2) * z.y - Math.pow(z.y, 3)
        }        
        z = {
            x: p.x + c.x,
            y: p.y + c.y
        }       
        
        totalX += z.x;
        avgX = totalX / n;
        totalY += z.y;
        avgY = totalY / n;
        
        var jump = (avgX-z.x)*(avgX-z.x) + (avgY-z.y)*(avgY-z.y) > 1/3 * (tempZ.x-avgX)*(tempZ.x-avgX) + (tempZ.y-avgY)*(tempZ.y-avgY);
        
        d = 0.5 * (Math.pow(z.x, 2) + Math.pow(z.y, 2))
        n += 1
    } while (d <= 2 && n < MAX_ITERATION && jump)

    return [n, d <= 2]
    */
}
