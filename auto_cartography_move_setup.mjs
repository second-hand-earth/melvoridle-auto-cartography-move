// patch addItem after to claim mastery tokens.
export function setup({ patch }) {
    // console.log('auto cartography move v7 loaded');
    // add patches for skills
    // woodcutting, fishing, firemaking, cooking, mining, smithing, thieving, fletching, 
    // crafting, runecrafting, herblore, summoning, astrology
    // no points of interest for: agility, summoning and astrology

    const gatheringSkillStartPatch = patch(GatheringSkill, 'start'); 
    function beforeGatheringSkillStartPatch(returnValue) {
        // console.log("beforeGatheringSkillStartPatch");
        if ((this instanceof Woodcutting) || (this instanceof Mining)) {
            movePlayerToHexCoords(4, 0);
            return;
        }
        if (this instanceof Fishing) {
            movePlayerToHexCoords(10, 22);
            return;
        }
        if ((this instanceof Cooking) || (this instanceof Firemaking) || (this instanceof Smithing)) {
            movePlayerToHexCoords(29, -2);
            return;
        }
        if ((this instanceof Crafting) || (this instanceof Fletching)) {
            movePlayerToHexCoords(17, -6);
            return;
        }
        if ((this instanceof Herblore) || (this instanceof Runecrafting)) {
            movePlayerToHexCoords(17, 20);
            return;
        }
        if (this instanceof Thieving) {
            movePlayerToHexCoords(25, 5);
            return;
        }
    }
    gatheringSkillStartPatch.before(beforeGatheringSkillStartPatch);



    // moves the player to these hex coords.
    function movePlayerToHexCoords(q, r) {
        var worldMap = game.cartography.activeMap;
        var hexCoords = new HexCoords(q, r);
        var hex = worldMap.getHex(hexCoords);
        // not mastered, do nothing.
        if (!hex.isMastered) {
            return;
        }
        // move to hex.
        // probably doesn't move if out of money.
        // TODO: equip compass to reduce travel costs before move?
        if (worldMap.playerPosition != hex) {
            var path = worldMap.computePath(worldMap.playerPosition, hex);
            //console.log("moving player from:");
            //console.log(worldMap.playerPosition);
            game.cartography.movePlayer(path, false);
        }
    }
}