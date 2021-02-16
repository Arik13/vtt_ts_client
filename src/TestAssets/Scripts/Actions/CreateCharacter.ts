export default
`
par race;
par subrace;
par alignment;

InitializeCharacter();

if (race == "aasimar") {
    Aasimar();
    if (subrace == "protector") {
        Protector();
    }
    elif (subrace == "scourge") {
        Scourge();
    }
    elif (subrace == "fallen") {
        Fallen();
    }
}
Alignment(alignment);

`