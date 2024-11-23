import {SignIn} from "@clerk/clerk-react";


export function AuthPage() {
    return (
        <div style={{display: "flex", justifyContent: "center", marginTop: 64}}>
            <SignIn />
        </div>
    )
}
