
"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState(null);

    const loadProfile = useCallback(async (currentUser) => {
        if (!currentUser) {
            setProfile(null);
            setProfileError(null);
            setProfileLoading(false);
            return;
        }

        setProfileLoading(true);
        setProfileError(null);
        setProfile(null);

        try {
            const userRef = doc(db, "users", currentUser.uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {
                setProfileError({
                    type: "not-found",
                    message:
                        "Your account profile was not found. Please contact your administrator.",
                });
                return;
            }

            setProfile({
                uid: currentUser.uid,
                ...userSnapshot.data(),
            });
        } catch (error) {
            console.error("Unable to load user profile:", error);

            setProfileError({
                type: "unavailable",
                message:
                    "We couldn't connect to your account profile. Check your internet connection and try again.",
            });
        } finally {
            setProfileLoading(false);
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        const currentUser = auth.currentUser;

        setUser(currentUser);

        if (!currentUser) {
            setProfile(null);
            setProfileError(null);
            setProfileLoading(false);
            return;
        }

        await loadProfile(currentUser);
    }, [loadProfile]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            // Firebase has identified the authentication session.
            setLoading(false);

            if (!currentUser) {
                setProfile(null);
                setProfileError(null);
                setProfileLoading(false);
                return;
            }

            // Load the Firestore profile separately.
            await loadProfile(currentUser);
        });

        return () => unsubscribe();
    }, [loadProfile]);

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                profileLoading,
                profileError,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
