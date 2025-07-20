import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db, auth } from "../firebase";
import Message from "./message";
import Arrow from "./arrow";

const List = ({ room }) => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastMessageRef = useRef(null);
  const containerRef = useRef(null);
  const prevMessagesLength = useRef(0);
  const audioRef = useRef(new Audio("/notify.mp3"));

  // veritabanindan mesajlari al
  useEffect(() => {
    // koleksiyon referansini al
    const collectionRef = collection(db, "message");

    // sorgu ayarlarini yap
    const q = query(
      collectionRef,
      where("room", "==", room),
      orderBy("createdAt", "asc")
    );

    // mesajlari koleksiyonuna abone ol(degisiklik talep edildikce)
    //koleksiyondaki her degisiklikte fonksiyon bize dokumanlari getirsin
    const unsub = onSnapshot(q, (snapshot) => {
      // dokumanlarin gecici olarak tutuldugu dizi
      const temp = [];

      // dokumanlari donup icerisindeki datalara erisip diziye aktarma
      snapshot.docs.forEach((doc) => {
        temp.push(doc.data());
      });

      // dokumanlari state'e atma
      setMessages(temp);
    });

    // componentWillUnmount: component ekrandan ayrilinca calisir
    //unsub ile veritabanina yapilan aboneligi ital eder
    return () => unsub();
  }, []);

  // her yeni mesaj geldiginde ekrani asagi kaydiran
  useEffect(() => {
    if (messages.length > 1) {
      const latsMsg = messages[messages.length - 1];

      // kullanici yukardayken yeni mesaj gelirse unread sayisini arttir
      if (messages.length > prevMessagesLength.current && !isAtBottom) {
        //eger son mesaji gonderen kullanici kendisi degilse
        if (latsMsg.author.id !== auth.currentUser.uid ) {
          setUnreadCount((prev) => prev + 1);
          playSound();

        }
      }

      prevMessagesLength.current = messages.length;

      if (latsMsg.author.id === auth.currentUser.uid) {
        // eger son mesaji aktif kullanici attiysa her  kosulda kaydir
        scrollToBottom();
      } else if (isAtBottom) {
        // eger son mesaji farkli kullanici attiysa kullanici asagi kaydirilsin
        scrollToBottom();
      }
    }
    playSound();
  }, [messages]);

  // kullanicinin asagida olup olmadigini tespit eden fonksiyon
  const handleScroll = () => {
    // scrollTop : kullanicinin yukaridan itibaren ne kadar kaydirdigi
    //clientHeight : kullanicinin ekranda gordugu kismi yukladigi
    // scrollHeight: tum icerign yuksekligi(gizli kisimlar dahil)
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;

    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 100);
  };

  // en asagiya kaydir
  const scrollToBottom = () => {
    // son mesaja kaydir
    lastMessageRef.current.scrollIntoView();

    // okunmayan mesaj sayisini sifirla
    setUnreadCount(0);
  };
// bildirim yeni gelen mesage bildirim sesi ekleme baskalari mesaj atiginda 
const playSound = () => {

  audioRef.current.currentTime = 0;
  audioRef.current.play();
}
  return (
    <main className="flex-1 p-3 flex flex-col gap-3 w-full overflow-y-auto relative">
      {messages.length < 1 ? (
        <div className="h-full grid place-items-center text-zinc-400">
          <p>Send your first message</p>
        </div>
      ) : (
        messages.map((i, key) => <Message item={i} key={key} />)
      )}
      <div ref={lastMessageRef} />

      <Arrow
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        unreadCount={unreadCount}
      />
    </main>
  );
};

export default List;
