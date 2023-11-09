import axios from "axios";

export default (uri: string) =>
{
    console.log("uri api", uri);
    return (
        axios.create(
        {
            baseURL: uri +":3000",
            timeout: 0
        })
    );
};
