
class Game
{
    public x: number;
    public hello: () => number;

    public constructor()
    {
        this.x = 0;
        this.hello = () =>
        {
            console.log("world");
            return (42);
        };
    }
}

export default Game;
