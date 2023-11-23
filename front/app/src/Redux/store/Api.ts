import axios from "axios";

export default (uri: string) =>
{
    return (
        axios.create(
        {
            baseURL: uri +":3000",
            timeout: 0
        })
    );
};
