# Comments

## Write comments as standalone facts about the code, not narrated history

State what the code does, and only when non-obvious, why — as a property of the code itself. Never narrate the decision that produced it ("chose X over Y", "per review"), describe a prior state no longer in the file ("used to do X", "replaces the old approach"), date-stamp it, or attribute it to a person.

**Why:** a comment tied to its own history goes stale the moment the "before" state it references is gone, misleading a reader who never saw it; a comment stating a fact about the code stays true for as long as the code does. That history belongs in the commit message, which is versioned and doesn't need to stay accurate in the working tree.
