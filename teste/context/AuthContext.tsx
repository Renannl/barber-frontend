import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "../services/apiClient";
interface AuthContextData {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signUp: (credentials: SignUpProps) => Promise<void>;
  logOutUser: () => Promise<void>;
}

type AuthProviderProps = {
  children: ReactNode;
};
interface UserProps {
  id: string;
  name: string;
  email: string;
  endereco: string | null;

  subscription?: SubscriptionProps | null;
}

interface SignUpProps {
  name: string;
  email: string;
  password: string;
}

interface SignInProps {
  email: string;
  password: string;
}
interface SubscriptionProps {
  id: string;
  status: string;
}
export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  console.log("ERROR LOGOUT");

  try {
    destroyCookie(null, "@barber.token", { path: "/" });
    Router.push("/login");
  } catch {
    console.log("Erro ao sair");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;
  useEffect(() => {
    const { "@barber.token": token } = parseCookies();
    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { id, name, endereco, email, subscription } = response.data;
          setUser({
            id,
            name,
            endereco,
            email,
            subscription,
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/session", {
        email,
        password,
      });

      const { id, name, token, subscription, endereco } = response.data;
      //Salvando token
      setCookie(undefined, "@barber.token", token, {
        maxAge: 60 * 60 * 24 * 30, //Esse token vai espirar em um mês
        path: "/",
      });

      setUser({
        id,
        name,
        email,
        endereco,
        subscription,
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");

      console.log(response.data);
    } catch (err) {
      console.log("Erro ao entrar ", err);
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const response = await api.post("/users", { name, email, password });

      Router.push("/login");
    } catch (err) {
      console.log("Erro ao criar usuario", err);
    }
  }

  async function logOutUser() {
    try {
      destroyCookie(null, "@barber.token", {
        path: "/",
      });
      Router.push("/login");
      setUser(null);
    } catch (err) {
      console.log("ERROR AO SAIR", err);
    }
  }
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signUp, logOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
