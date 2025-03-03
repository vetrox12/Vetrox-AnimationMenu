local insert = table.insert

Load = {}

---@param dict string
Load.Dict = function(dict)
    local timeout = false
    SetTimeout(5000, function() timeout = true end)

    repeat
        RequestAnimDict(dict)
        Wait(50)
    until HasAnimDictLoaded(dict) or timeout
end

---@param model string
Load.Model = function(model)
    local timeout = false
    SetTimeout(5000, function() timeout = true end)

    local hashModel = GetHashKey(model)
    repeat
        RequestModel(hashModel)
        Wait(50)
    until HasModelLoaded(hashModel) or timeout
end

---@param walk string
Load.Walk = function(walk)
    local timeout = false
    SetTimeout(5000, function() timeout = true end)

    repeat
        RequestAnimSet(walk)
        Wait(50)
    until HasAnimSetLoaded(walk) or timeout
end

---@param asset string
Load.Ptfx = function(asset)
    local timeout = false
    SetTimeout(5000, function() timeout = true end)

    repeat
        RequestNamedPtfxAsset(asset)
        Wait(50)
    until HasNamedPtfxAssetLoaded(asset) or timeout
end

---@param ped number
---@param prop number
---@param name string
---@param placement table
---@param rgb table
Load.PtfxCreation = function(ped, prop, name, asset, placement, rgb)
    local ptfxSpawn = ped
    if prop then
        ptfxSpawn = prop
    end
    local newPtfx = StartNetworkedParticleFxLoopedOnEntityBone(name, ptfxSpawn, placement[1] + 0.0, placement[2] + 0.0, placement[3] + 0.0, placement[4] + 0.0, placement[5] + 0.0, placement[6] + 0.0, GetEntityBoneIndexByName(name, "VFX"), placement[7] + 0.0, 0, 0, 0, 1065353216, 1065353216, 1065353216, 0)
    if newPtfx then
        SetParticleFxLoopedColour(newPtfx, rgb[1] + 0.0, rgb[2] + 0.0, rgb[3] + 0.0)
        if ped == PlayerPedId() then
            insert(cfg.ptfxEntities, newPtfx)
        else
            cfg.ptfxEntitiesTwo[GetPlayerServerId(NetworkGetEntityOwner(ped))] = newPtfx
        end
        cfg.ptfxActive = true
    end
    RemoveNamedPtfxAsset(asset)
end

Load.PtfxRemoval = function()
    if cfg.ptfxEntities then
        for _, v in pairs(cfg.ptfxEntities) do
            StopParticleFxLooped(v, false)
        end
        cfg.ptfxEntities = {}
    end
end

---@param ped number
---@param prop string
---@param bone number
---@param placement table
Load.PropCreation = function(ped, prop, bone, placement)
    local coords = GetEntityCoords(ped)
    local newProp = CreateObject(GetHashKey(prop), coords.x, coords.y, coords.z + 0.2, true, true, true)
    if newProp then
        AttachEntityToEntity(newProp, ped, GetPedBoneIndex(ped, bone), placement[1] + 0.0, placement[2] + 0.0, placement[3] + 0.0, placement[4] + 0.0, placement[5] + 0.0, placement[6] + 0.0, true, true, false, true, 1, true)
        insert(cfg.propsEntities, newProp)
        cfg.propActive = true
    end
    SetModelAsNoLongerNeeded(prop)
end

---@param type string
Load.PropRemoval = function(type)
    if type == 'global' then
        if not cfg.propActive then
            for _, v in pairs(GetGamePool('CObject')) do
                if IsEntityAttachedToEntity(PlayerPedId(), v) then
                    SetEntityAsMissionEntity(v, true, true)
                    DeleteObject(v)
                end
            end
        else
            Play.Notification('info', 'Prevented real prop deletion...')
        end
    else
        if cfg.propActive then
            for _, v in pairs(cfg.propsEntities) do
                DeleteObject(v)
            end
            cfg.propsEntities = {}
            cfg.propActive = false
        end
    end
end

---@return any
Load.GetPlayer = function()
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local offset = GetOffsetFromEntityInWorldCoords(ped, 0.0, 1.3, 0.0)
    local rayHandle = StartShapeTestCapsule(coords.x, coords.y, coords.z, offset.x, offset.y, offset.z, 3.0, 12, ped, 7)
    local _, hit, _, _, pedResult = GetShapeTestResult(rayHandle)

    if hit and pedResult ~= 0 and IsPedAPlayer(pedResult) then
        if not IsEntityDead(pedResult) then
            return pedResult
        end
    end
    return false
end

---@param target number
---@param shared string
Load.Confirmation = function(target, shared)
    Play.Notification('info', '[E] Accept Request\n[L] Deny Request')
    local hasResolved = false
    SetTimeout(10000, function()
        if not hasResolved then
            hasResolved = true
            TriggerServerEvent('anims:resolveAnimation', target, shared, false)
        end
    end)

    CreateThread(function()
        while not hasResolved do
            if IsControlJustPressed(0, cfg.acceptKey) then
                if not hasResolved then
                    if cfg.animActive or cfg.sceneActive then
                        Load.Cancel()
                    end
                    TriggerServerEvent('anims:resolveAnimation', target, shared, true)
                    hasResolved = true
                end
            elseif IsControlJustPressed(0, cfg.denyKey) then
                if not hasResolved then
                    TriggerServerEvent('anims:resolveAnimation', target, shared, false)
                    hasResolved = true
                end
            end
            Wait(5)
        end
    end)
end

Load.Cancel = function()
    if cfg.animDisableMovement then
        cfg.animDisableMovement = false
    end
    if cfg.animDisableLoop then
        cfg.animDisableLoop = false
    end

    if cfg.animActive then
        ClearPedTasks(PlayerPedId())
        cfg.animActive = false
    elseif cfg.sceneActive then
        if cfg.sceneForcedEnd then
            ClearPedTasksImmediately(PlayerPedId())
        else
            ClearPedTasks(PlayerPedId())
        end
        cfg.sceneActive = false
    end

    if cfg.propActive then
       Load.PropRemoval()
       cfg.propActive = false
    end
    if cfg.ptfxActive then
        if cfg.ptfxOwner then
            TriggerServerEvent('anims:syncRemoval')
            cfg.ptfxOwner = false
        end
        Load.PtfxRemoval()
        cfg.ptfxActive = false
    end
end

exports('Load', function()
    return Load
end)

CreateThread(function()
    TriggerEvent('chat:addSuggestions', {
        {name = '/' .. cfg.commandNameEmote, help = cfg.commandNameSuggestion, params = {{name = 'emote', help = 'Emote name'}}},
        {name = '/' .. cfg.commandName, help = cfg.commandSuggestion, params = {}}
    })
end)

-- Vetrox https://discord.gg/jc3bxNTD9Y