NATIVE_WIDTH = NATIVE_WIDTH or 1280
NATIVE_HEIGHT = NATIVE_HEIGHT or 720

gl.setup(NATIVE_WIDTH, NATIVE_HEIGHT)

util.resource_loader{
    "bgcolor.png",
    "shaderE18.frag",
}

function node.render()
    local now = sys.now()

    shaderE18:use{
       iTime = now,
       iResolution = {NATIVE_WIDTH, NATIVE_HEIGHT, 0.0}
    }

    bgcolor:draw(0, 0, NATIVE_WIDTH, NATIVE_HEIGHT)
end
