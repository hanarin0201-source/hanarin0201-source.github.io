(()=>{
// v25: an empty slot can be filled from any other non-empty pending group,
// not only from a full four-person group.
fullGroups24=function(except=''){
  return (S.pendingGames||[]).filter(g=>g.id!==except&&Array.isArray(g.players)&&g.players.length>0);
};
render();
})();
