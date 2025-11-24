import { HTMLAttributes } from "react";

type MyComponentProps = HTMLAttributes<HTMLDivElement> & {
    includeStyle?: boolean,
};

function AddToLibrary({onClick, style, children, includeStyle = true, ...rest}: MyComponentProps) {
    return(
        <div             
            style={{
                ...(includeStyle ? {height: '35px', width: '35px',fontSize: '20px', marginLeft: '15px', cursor: 'pointer', border: '1px solid #7a19e9', 
                borderRadius: '5px', color: 'rgb(90, 210, 216)'} : {}),
                ...style,
            }}
            onClick={onClick}
            {...rest}
        >
            {children}
        </div>
    );
};

export { AddToLibrary };