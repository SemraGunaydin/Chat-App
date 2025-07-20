import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

const RoomPage = () => {
  const user = useOutletContext();
  const navigate = useNavigate();

  // sign in icin
  const handleSubmit = (e) => {
    e.preventDefault();

    // inputtaki girdiyi al
    const room = e.target[0].value.toLowerCase().replaceAll(" ", " -");

    // kullaniciyi sohbet odasina yonlendir
    navigate(`/chat${room}`);
  };
  //sing out icin
  const handleLogout = () => {
    signOut(auth);
    toast.info("Session closed");
  };

  return (
    <div className="wrapper">
      <form
        onSubmit={handleSubmit}
        className="box rounded-[10px] flex
      flex-col gap-10 text-center"
      >
        <h1 className="text-2xl "> Chat Room</h1>
        <p className="text-zinc-500">
          Hi, {user.displayName} <br /> Which room you want to login?{" "}
        </p>

        <input
          type="text"
          className="border border-gray-300 rounded-md shadow-lg p-2 px-4"
          placeholder="Type room name to here.."
        />

        <button type="submit" className="btn bg-zinc-700 text-white">
          Sign In{" "}
        </button>

        <button
          type="button"
          className="btn bg-red-500 text-white"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </form>
    </div>
  );
};

export default RoomPage;
