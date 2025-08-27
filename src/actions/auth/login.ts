'use server';

import { signIn } from "@/auth.config";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', { ...Object.fromEntries(formData), redirect: false });

    return 'Success';

  } catch (error: any) {
    console.log({error});    
    return 'CredentialsSignin';
    // if (error) {
    //   switch (error.type) {
    //     case 'CredentialsSignin':
    //       return 'Invalid credentials.';
    //     default:
    //       return 'Something went wrong.';
    //   }
    // }
    // throw error;
  }
}

export async function login( email: string, password: string ) {

  try {
    
    await signIn('credentials', { email, password, redirect: false });

    return {
      ok: true,
      message: 'Sesión iniciada'
    }
  } catch (error) {
    console.error( error );
    return {
      ok: false,
      message: 'No se pudo iniciar sesión'
    }
  }
}