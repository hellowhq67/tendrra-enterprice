"use client";

import { useContext, createContext, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userdata, setUser] = useState(null);
  const { data: session } = useSession();
  const isCreatingUser = useRef(false);  // Track whether the user creation process is running

  useEffect(() => {
    if (session && !isCreatingUser.current) {
      const apiEndpoint = "/api/v1/sign-up";

      const fetchOrCreateUser = async () => {
        try {
          isCreatingUser.current = true;  // Set flag to true when starting the user creation process
          
          const randomUID = crypto.randomUUID(); // Generate a random UID using crypto

          // Prepare the data to be sent
          const postData = {
            email: session.user.email,
            name: session.user.name || "Unknown User",
            uid: randomUID,
            subscription: "Free", // Default subscription
            profile: "user", // Default profile
            tokens: 60000, // Default tokens
            Agents: 6, // Default Agents
          };

          // Check if the user already exists
          const checkUserResponse = await fetch(`${apiEndpoint}?email=${session.user.email}`);
          const checkUserData = await checkUserResponse.json();

          if (checkUserResponse.ok && checkUserData.user) {
            console.log("User already exists:", checkUserData.user);
            setUser(checkUserData.user);
          } else {
            // User doesn't exist, create a new user
            const createUserResponse = await fetch(apiEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(postData),
            });

            if (createUserResponse.ok) {
              const createdUserData = await createUserResponse.json();
              console.log("User created successfully:", createdUserData);

              // Set the user data in the state
              setUser(createdUserData.user);
            } else {
              const errorData = await createUserResponse.json();
              console.error("Failed to create user:", errorData.message);
            }
          }
        } catch (error) {
          console.error("Error in user fetch/create:", error.message);
        } finally {
          isCreatingUser.current = false;  // Reset flag after process is complete
        }
      };

      fetchOrCreateUser();
    }
  }, [session]);  // Runs whenever the session changes

  return (
    <AuthContext.Provider value={{ userdata }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => useContext(AuthContext);
