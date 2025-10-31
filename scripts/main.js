import { world } from "@minecraft/server";

// Configuration
const config = {
  slotA: 0,
  slotB: 40,
  totemSlot: 36
};

world.beforeEvents.itemUse.subscribe(event => {
  const player = event.source;
  if (!player || player.typeId !== "minecraft:player") return;

  const item = event.itemStack;
  if (!item || item.typeId !== "custom:swap_tool") return;

  const inv = player.getComponent("inventory").container;

  // Swap any two inventory slots
  const itemA = inv.getItem(config.slotA);
  const itemB = inv.getItem(config.slotB);
  inv.setItem(config.slotA, itemB);
  inv.setItem(config.slotB, itemA);
  player.sendMessage(`§aSwapped inventory slots ${config.slotA + 1} and ${config.slotB + 1}!`);

  // Totem logic: move a Totem to any inventory slot
  let totemFound = false;
  for (let i = 0; i < inv.size; i++) {
    const currentItem = inv.getItem(i);
    if (currentItem?.typeId === "minecraft:totem") {
      inv.setItem(config.totemSlot, currentItem);
      inv.setItem(i, undefined); // remove from original slot
      player.sendMessage(`§eMoved Totem to slot ${config.totemSlot + 1}!`);
      totemFound = true;
      break;
    }
  }

  if (!totemFound) player.sendMessage("§cNo Totem found in inventory.");
});
