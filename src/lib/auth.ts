
"use client";

import { signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { AppUser, SignUpData } from "./types";

export const signUpWithEmail = async (data: SignUpData) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = result.user;

        const newUser: AppUser = {
            uid: user.uid,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            age: data.age,
            photoURL: "",
        };
        
        await setDoc(doc(db, "users", user.uid), newUser);
        
        return { success: true };
    } catch (error: any) {
        console.error("Error signing up with email: ", error);
        return { success: false, error: error.message };
    }
}

export const signInWithEmail = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: result.user };
    } catch (error: any) {
        console.error("Error signing in with email: ", error);
        return { success: false, error: error.message };
    }
}


export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error("Error signing out: ", error);
    }
};

export const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error: any) {
        console.error("Error sending password reset email: ", error);
        return { success: false, error: error.message };
    }
}
