gl.setup(NATIVE_WIDTH, NATIVE_HEIGHT)

-- sys.set_flag("slow_gc")

util.resource_loader{
    "shaderE18.frag",
    "bgcolor.png",
}

function node.render()
    local now = sys.now()

    shaderE18:use{
        time = now;
    }

    bgcolor:draw(0, 0, NATIVE_WIDTH, NATIVE_HEIGHT)
end
