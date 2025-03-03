-- Vetrox https://discord.gg/jc3bxNTD9Y
cfg = {
    cfg = 'qb-core', -- اسم الكور حقك
    commandName = 'emotePanel', -- اسم الامر الي يفتح القائمة
    commandSuggestion = 'Open the emote panel', -- البايو الي يكون مع الامر
    commandNameEmote = 'e', -- لا تلعب فيها
    commandNameSuggestion = 'Play an animation by command', -- لا تلعب فيها
    keyActive = true, -- لا تلعب فيها
    keyLetter = 'F5', -- الزر الي يفتحلك القائمة
    keySuggestion = 'Open the emote panel by key', -- لا تلعب فيها
    walkingTransition = 0.5,-- لا تلعب فيها

    acceptKey = 38, -- لا تلعب فيها
    denyKey = 182, -- لا تلعب فيها
    waitBeforeWalk = 5000, --- لا تلعب فيها

    -- لا تلعب فيهم
    useTnotify = GetResourceState('t-notify') == 'started',
    panelStatus = false,
    animActive = false,
    animDuration = 1500,
    animLoop = false,
    animMovement = false,
    animDisableMovement = false,
    animDisableLoop = false,
    sceneActive = false,
    propActive = false,
    propsEntities = {},
    ptfxOwner = false,
    ptfxActive = false,
    ptfxEntities = {},
    ptfxEntitiesTwo = {},
    malePeds = {
        "mp_m_freemode_01"
    },
    sharedActive = false,
    cancelKey = 73, -- الزر الي يكنسل الرقصة  https://docs.fivem.net/docs/game-references/controls/
    defaultCommand = 'fav', -- ...
    defaultEmote = 'dance', -- ...
    defaultEmoteUseKey = false, -- لاتلعب فيها
    defaultEmoteKey = 20 -- لاتلعب فيها https://docs.fivem.net/docs/game-references/controls/
}
-- Vetrox https://discord.gg/jc3bxNTD9Y