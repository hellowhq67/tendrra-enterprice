"use server"

<<<<<<< HEAD

import { signIn, signOut } from "../../../auth"
=======
import { signIn,signOut } from "../../../auth"
>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c



export const SingWithGoogle = async () => {
    await signIn('google')
}
<<<<<<< HEAD


export const SignOut= async()=>{
    await signOut()

}
=======
export const SingOut = async () => {
    await signOut()
}
>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c
