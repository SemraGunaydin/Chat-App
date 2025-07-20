import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        toast.success("Login Successed");
        navigate("/room");
      })
      .catch((err) => toast.error("Error occured", err.message));
  };

  return (
    <div className="wrapper">
      <div className="box h-[450px] flex flex-col justify-center items-center gap-[50px]">
        <h1 className="text-4xl">Chat Room</h1>

        <p className="text-gray-400">Log In To Continue</p>

        <button onClick={handleLogin} className=" btn flex gap-5 items-center">
          <img src="/google-logo.png" alt="google" className="w-[30px]" />
          <span>Login with Google Account</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
