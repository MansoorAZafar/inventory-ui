"use client"
import { useRouter } from "next/navigation";
import { popupSignIn } from "../utils/firebase/firebase.utils";

export default function Login() {
  const router = useRouter();
  
  const logGoogleUser = async () => {
    try {
      if(localStorage.getItem('IdToken')) {
        router.push('/inventory')
        return;
      }

      const response = await popupSignIn();
      console.log(response.user)
      localStorage.setItem('IdToken', await response.user.getIdToken());
      router.push('/inventory')
          
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {}
  }

  return (
    <div className="flex justify-center items-center h-screen flex-col">
        <button
          type="button"
          className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 
          focus:outline-none focus:ring-blue-300 font-medium 
          rounded-lg text-xl px-20 py-5 text-center me-2 mb-2 
          dark:border-blue-500 dark:text-blue-500 dark:hover:text-white 
          dark:hover:bg-blue-500 dark:focus:ring-blue-800
          dark:hover:cursor-pointer"
          onClick={logGoogleUser}
        >
          Login
        </button>
    </div>
  );
}
