"use server"

import { signIn,signOut } from "../../../auth"



export const SingWithGoogle = async () => {
    await signIn('google')
}
export const SingOut = async () => {
    await signOut()
}
