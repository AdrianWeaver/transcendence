class Dimension
{
    public height: number;
    public width: number;
    public setDimension: (newHeight: number, newWidth: number) => void;

    public constructor()
    {
        this.height = 0;
        this.width = 0;
        this.setDimension = (newHeight, newWidth) =>
        {
            this.height = newHeight;
            this.width = newWidth;
        };
    }
}

export default Dimension;
