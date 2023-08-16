class Position
{
    public x: number;
    public y: number;
    public setCoordinateXYZ: (px: number, py: number) => void;

    public constructor()
    {
        this.x = 0;
        this.y = 0;
        this.setCoordinateXYZ = (px, py) =>
        {
            this.x = px;
            this.y = py;
            // this.z = p_z;
        };
    }
}

export default Position;
