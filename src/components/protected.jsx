import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase";
import Loader from "./loader";

// Protected component'i icerisinde alinan route'lara sadece oturum acik olan kullanicilar erisebilecek
const Protected = () => {
  // aktif kullanici (oturum acik) state'i
  const [user, setUser] = useState(undefined);

  // aktif kullanici verisini al
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });
  }, []);

  // kullanici verisi yukle niyorsa loader bas
  if (user === undefined) return <Loader />;

  // kullanici oturumu kapaliysa logine yonlendir
  if (user === null) return <Navigate to="/" replace />;

  // kullanici oturumu aciksa sayfayi goster

  return <Outlet context={user} />;
};

export default Protected;
