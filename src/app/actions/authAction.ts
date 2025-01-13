"use server"

import { signIn } from "../../../auth"



export const SingWithGoogle = async () => {
    await signIn('google')
}