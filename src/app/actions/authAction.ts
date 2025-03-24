"use server"


import { signIn, signOut } from "../../../auth"



export const SingWithGoogle = async () => {
    await signIn('google')
}


export const SignOut= async()=>{
    await signOut()

}