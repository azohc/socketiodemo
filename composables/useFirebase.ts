import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "@firebase/auth";

export default function () {
  const { $auth } = useNuxtApp();

  // basic store, could use pinia for more power...
  const user = useState<User | null>("firebase-user", () => null);

  const email = "juanchozass@gmail.com",
    password = "123456";

  function handleError(place: string, error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(
      `error in useFirebase.ts::${place}: ${errorCode} ${errorMessage}`
    );
  }

  async function register() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        $auth,
        email,
        password
      );
      console.log("signed in", user);
    } catch (error: any) {
      handleError("register", error);
    }
  }

  async function login() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        $auth,
        email,
        password
      );
      user.value = userCredential.user;
    } catch (error: any) {
      handleError("login", error);
    }
  }

  async function googleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup($auth, provider);
      user.value = userCredential.user;
    } catch (error: any) {
      handleError("googleLogin", error);
    }
  }

  function logout() {
    try {
      signOut($auth);
      user.value = null;
    } catch (error: any) {
      handleError("logout", error);
    }
  }

  return {
    user,
    login,
    glogin: googleLogin,
    register,
    logout,
  };
}
