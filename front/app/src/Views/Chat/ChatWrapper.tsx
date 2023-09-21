import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import Chat from "./Chat";

export const ChatWrapper = () => 
{
    const   window = useAppSelector((state) =>
    {
        return (state.controller.user.chat.window);
    });

    const   mini = <>work to do</>;
    const   hidden = <></>;
    const   big = <Chat />;
    
    if (window.bigWindow)
        return big;
    else if (window.hiddenWindow)
        return hidden;
    else if (window.miniWindow)
        return mini; 
    else
        return (<></>);
}