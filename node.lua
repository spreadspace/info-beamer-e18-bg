gl.setup(NATIVE_WIDTH, NATIVE_HEIGHT)

util.resource_loader{
    "bgcolor.png",
    "shaderE18.frag",
}

function node.render()
    local now = sys.now()

    shaderE18:use{
       iTime = now,
       iResolution = {NATIVE_WIDTH, NATIVE_HEIGHT}
    }

    bgcolor:draw(0, 0, NATIVE_WIDTH, NATIVE_HEIGHT)
end
