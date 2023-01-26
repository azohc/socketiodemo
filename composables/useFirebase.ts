import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  User,
} from "@firebase/auth";

export default function () {
  const { $auth } = useNuxtApp();

  // basic state, could use store...
  const user = useState<User | null>("firebase-user", () => null);

  const email = "juanchozass@gmail.com",
    password = "123456";

  async function register() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        $auth,
        email,
        password
      );
      console.log("signed in", user);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        `error in useFirebase.ts::register: ${errorCode} ${errorMessage}`
      );
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
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        `error in useFirebase.ts::login: ${errorCode} ${errorMessage}`
      );
    }
  }

  return {
    user,
    login,
    register,
  };
}
