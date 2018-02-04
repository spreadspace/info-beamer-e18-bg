NATIVE_WIDTH = NATIVE_WIDTH or 1280
NATIVE_HEIGHT = NATIVE_HEIGHT or 720

local max = math.max
local min = math.min
local cos = math.cos
local sin = math.sin
local exp = math.exp
local PUSH = gl.pushMatrix
local POP = gl.popMatrix
local PI = math.pi
local RADTODEG = 180.0 / 3.14159265359
local DEGTORAD = 3.14159265359 / 180.0
local ROT1 = RADTODEG * PI

--util.noglobals()
local res = util.auto_loader()

-----------------------------------------

local QSIZE = 0.10
local QPOSX, QPOSY = 0.4, 0.3   -- querulant base position [(0,0) = center, (1,1) = bottom right corner]
local QMOVESCALE = 0.20
local PILLAR_TOP_GRANULARITY = 0.03   -- top looks better with larger rows (smaller model scale!)
local PILLAR_SIDE_GRANULARITY = 0.002 -- sides are better with smaller rows

res.yellow = resource.create_colored_texture(1.0, 0.913, 0.141)

---------------------------------

gl.setup(NATIVE_WIDTH, NATIVE_HEIGHT)

local function chaos(t)
  return (exp(sin(t*0.22))*exp(cos(t*0.39))*sin(t*0.3));
end

local function queruPos(t)
  local dx = chaos(t * PI)
  local dy = chaos(t * -1.3)
  return QPOSX + QMOVESCALE * dx, QPOSY + QMOVESCALE * dy
end

local function rotaterad(a, ...)
    gl.rotate(RADTODEG * a, ...)
end
local function rotate1(a, ...) -- 0.5 = half rotation, 1 = full rotation
    gl.rotate(ROT1 * a, ...)
end

local function drawqueru(now)
    PUSH()
        gl.translate(queruPos(now))
        rotate1(now, 0, 0, 1)
        gl.translate(QSIZE/-2, QSIZE/-2) -- center rotation point
        res.yellow:draw(0,0,QSIZE,QSIZE)
    POP()
end

local function drawside(params, ...)
    res.pillar:use(params)
    res.noise:draw(-0.5,-0.5,0.5,0.5,1, ...)
end


local function drawpillar(params)
    PUSH()
        gl.scale(0.1, 0.5, 0.1)

        PUSH() -- top
            rotate1(0.5, 0, 1, 0)
            rotate1(0.5, 1, 0, 0)
            gl.translate(0, 0, 0.5) -- -0.5 to draw bottom
            params.granularity = PILLAR_TOP_GRANULARITY
            drawside(params)
        POP()

        params.granularity = PILLAR_SIDE_GRANULARITY
        PUSH() -- front
            gl.scale(-1, 1, 1) -- this makes sure the textures line up and corner transition goes nicely
            gl.translate(0, 0, 0.5)
            drawside(params, 0, 0, 0.5, 1) -- first half of X-axis UV-coord space
        POP()

        PUSH() -- side
            rotate1(0.5, 0, 1, 0)
            gl.translate(0, 0, -0.5)
            drawside(params, 0.5, 0, 1, 1)  -- second half of X-axis UV-coord space
        POP()
    POP()
end

-- test function to try good looking rotation parameters...
local function lolpillar(now, seed)
    local params = {time=now, randseed = seed}
    local s, s2, c = sin(now), sin(now*0.5), cos(now*0.66)
    PUSH()
        rotate1(0.1*c, 0, 0, 1)       -- tilt left/right / roll
        rotate1(0.05*c+0.1, -1, 1, 0) -- tilt to viewer / pitch
        rotate1(0.1*s2+0.2, 0, 1, 0)  -- twist / yaw
        local ss = s * 0.2 + 1.5
        gl.scale(ss, ss, ss)
        drawpillar(params)
    POP()
end

local function drawpillars(now)

    PUSH()
        gl.translate(-0.2, 0, 0)
        lolpillar(now, 0)
    POP()

    PUSH()
        lolpillar(now + 1, 0)
    POP()

    PUSH()
        gl.translate(0.2, 0, 0)
        lolpillar(now + 2, 1)
    POP()

    res.pillar:deactivate()
end


function node.render()
    local aspect = WIDTH / HEIGHT
    local now = sys.now()

    local fov = math.atan2(HEIGHT, WIDTH*2) * 360 / math.pi
    gl.perspective(fov, WIDTH/2, HEIGHT/2, -WIDTH,
                    WIDTH/2, HEIGHT/2, 0)


    gl.translate(WIDTH/2, HEIGHT/2)
    gl.scale(WIDTH * (1/aspect), HEIGHT)
    drawpillars(now)


    gl.ortho()
    gl.translate(WIDTH/2, HEIGHT/2)
    gl.scale(WIDTH * (1/aspect), HEIGHT)
    drawqueru(now)
end

