import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState ,useRef, useEffect} from "react";
import { db } from "../firebase";
import EmojiPicker from "emoji-picker-react";




const Form = ({user, room}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState("");
    const emojiPickerRef = useRef(null);
    const buttonRef = useRef(null);
    

    // emojinin picker alaninin disinda herhangi bir yere tiklaninca modali kapat
    useEffect(() => {
        const handleClickOutside = (e) => {
        if (
            isOpen && 
            emojiPickerRef.current &&
            !emojiPickerRef.current.contains(e.target) &&
            !buttonRef.current.contains(e.target)
        ) {
            setIsOpen(false);
        }

    };

    document.addEventListener("mousedown" , handleClickOutside);
    }, [isOpen]);

// form gonderilnce
    const handleSubmit = async(e) => {
        e.preventDefault();

         // formu temizle
        setText("");
        setIsOpen(false);


        // mesaji kadedebilcegi kolleksiyonu al
        const collectionRef = collection(db, "message");

        // mesaji veritabanindaki message koleksiyonuna ekle
        await addDoc(collectionRef, {
            text,
            room,
            author:{
                id:user.uid,
                name:user.displayName,
                photo :user.photoURL,
            },
            createdAt:serverTimestamp(),
        });
    };
       


    // inputtaki secili alana emoji ekleme
    const handleEmojiClick = (e) => {
       const input =document.querySelector("input[type='text']");

       if(input) {
        // inputa secili karakterlerin baslangic sirasi
        const start = input.selectionStart;
        // inputta secili karakterlerin bitisi
        const end = input.selectionEnd;
        // secili emojiyi alana ekle
        const newText = text.substring(0, start) + e.emoji + text.substring(end);

        // state'i guncelle
        setText(newText);
       }

    };


  return (
    < form  
    onSubmit={handleSubmit}
    className="p-5 border border-gray-200 shadow-lg flex justify-center gap-3">
    
    <input 
    type="text"
    className="border border-gray-200 shadow-sm p-2 px-4 rounded-md w-1/2 "
    placeholder="write your message..."
    value={text}
    onChange={(e) => setText(e.target.value)}
     />


     <div className="relative">
        {isOpen && (
            <div className="absolute top-[-470px] right-[-140px]" ref={emojiPickerRef}>
            <EmojiPicker open={isOpen} onEmojiClick={handleEmojiClick } />
        </div>
        )}

        <button  ref={buttonRef}
        type= "button"
        className="btn text-base" 
        onClick={() => setIsOpen(!isOpen)}>
            ☺️
        </button>

     </div>

    <button 
    disabled={text.length < 1 } 
    type="submit" 
    className="btn bg-black text-white disabled:brightness-75">
        Send
    </button>
    
    </form>
  );
};

export default Form;